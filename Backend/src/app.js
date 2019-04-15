/////////////////////////////
///// Setup - Loading Modules
/////////////////////////////

"use strict";


//const fs = require('fs');
//const crypto = require("crypto");
const cors = require("cors");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const passwordHash = require("password-hash");
const multer = require("multer");
const jwt = require('jsonwebtoken');
const randtoken = require("rand-token");
const moment = require("moment");
moment.locale("de");

const sharp = require('sharp');
sharp.cache({
    files: 0
});


// const settings = require("./settings.json");
// let Mailjet = require("node-mailjet").connect(
//     settings.APIKEY_PUBLIC,
//     settings.APIKEY_PRIVATE
// );
const port = process.env.PORT || 3000;

let noAuth = false;
if (process.argv[2] === "noAuth") {
    console.error("warning: no auth mode")
    noAuth = true;
}

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/", router);
app.use(function (err, _req, res, _next) {
    if (err) {
        if (err.message === "File too large") {
            handle(res, 400, "File too large");
        } else {
            handle(res, err);
        }
    }
});

const server = app.listen(port, function () {
    log("The Backend Server ist running on Port " + port);
});

const mongoose = require("mongoose");

exports.server = server;
exports.testUser = testUser;
exports.router = router;
exports.auth = auth;
exports.authFail = authFail;
exports.log = log;
exports.handle = handle;
exports.getIp = getIp;

const { IP, UserDB, TokenDB } = require("./app-db");

app.use("/moment", require('./app-moment')); // Route to app-moment-js
app.use("/image", require('./app-image')); // Route to app-moment-js

/*

let recursive = (remain, i, j) => {
    if (!i || !j) {
        return recursive(remain, 1, 1);
    }
    if (remain > 0) {
        let newI = j;
        let newJ = i + j;
        remain -= 1;
        return recursive(remain, newI, newJ);
    } else {
        return j;
    }
};
async function saveAndBlockIp(ip) {
    let delay = 1000 * 30; //30 Seconds
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + delay);

    let result = await IP.findOne({
        ip
    });
    //user known?
    if (result) {
        //new email allowed?
        if (new Date() < Date.parse(result.date)) {
            //still blocked
            result.state = result.state >= 26 ? 26 : result.state + 1;
            let multi = recursive(result.state);
            expireDate.setTime(expireDate.getTime() + delay * multi / 10);
            result.date = expireDate.toUTCString();
            await result.save();
            log(
                "blocked until " + expireDate.toDateString() + ", stage:" + result.state
            );
            throw 429;
        } else {
            //you are a nice guy again
            result.date = expireDate.toUTCString();
            if (result.state >= 12) {
                //permenently marked
                result.state = 12;
            } else {
                result.state = 0;
            }
            await result.save();
        }
    } else {
        //save unique ip
        await IP.findOneAndUpdate({
            ip
        }, {
                ip,
                date: expireDate.toUTCString(),
                state: 0
            }, {
                upsert: true
            });
    }
}


async function sendEmail(data) {
    try {
        let emailData = {
            // From
            FromEmail: settings.emailReciever,
            FromName: "Website Kontakt",
            // To
            Recipients: [{
                Email: settings.emailReciever
            }],
            // Subject
            Subject: data.betreff,
            // Body
            "Html-part": "<b>Kontakt Formular:</b>" +
                " <ul><li><b>Name: </b>" +
                data.name +
                "</li><li><b>Betreff: </b>" +
                data.betreff +
                "</li><li><b>Email: </b>" +
                data.email +
                "</li> </ul>" +
                "<br>" +
                "<h2>Mitteilung</h2><pre>" +
                data.text +
                "</pre>"
        };

        let sendEmail = Mailjet.post("send");

        sendEmail.request(emailData).catch(err => {
            throw err;
        });
    } catch (error) {
        throw 409;
    }
}
router.post("/contact", async (req, res) => {
    try {
        if (!req.body.email ||
            !req.body.betreff ||
            !req.body.name ||
            !req.body.text
        )
            throw 400;

        let ip =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        if (!ip) throw 500;
        await saveAndBlockIp(ip);

        if (process.env.test === "true") {
            log("email from " + req.body.email + ":" + req.body.betreff);
            throw 200; //spam block
        }

        await sendEmail(req.body).catch((err) => {
            throw err
        });
        log("new email from " + req.body.email + ":" + req.body.betreff);

        res.status(200).send("OK");
    } catch (error) {
        handle(res, error);
    }
});
*/
router.post("/login", async (req, res) => {
    try {
        if (!req.body.pw || !req.body.un) throw 403;
        const user = req.body.un;

        let findUser = await UserDB.findOne({
            user
        });
        if (!findUser || !passwordHash.verify(req.body.pw, findUser.hash)) {
            throw 401;
        }

        let token = jwt.sign({
            user,
            rand: randtoken.generate(10)
        }, findUser.hash, {
                expiresIn: '1h',
                issuer: getIp()
            });

        //delete old tokens of user
        await TokenDB.deleteMany({
            user
        });

        let newToken = new TokenDB({
            user: user,
            token
        });
        await newToken.save();
        let expireDate = new Date()
        expireDate.setHours(expireDate.getHours() + 1)
        log("token generated");
        res.status(200).json({
            token,
            expireDate
        });
    } catch (error) {
        handle(res, error, "Nutzer konnte nicht autentifiziert werden.");
    }
});

/**
 * verify token
 * @param {string} user 
 * @param {string} token 
 */
async function auth(user, token) {
    if (noAuth) { return true; }
    if (!user || !token) {
        throw 400;
    }
    try {
        let findUser = await UserDB.findOne({
            user
        });
        if (!findUser) throw "unknown user";
        let result = jwt.verify(token, findUser.hash, {
            issuer: getIp()
        });
        if (!result || result.user !== user)
            throw "cant verify token";

        log(user + " authorized");
        return true;

    } catch (err) {
        log(err)
        log(user + " unauthorized")
        throw 401;
    }
}



function authFail() {
    throw 401;
}

function handle(res, err, desc) {
    if (desc) {
        log(err + " " + desc);
    } else {
        log(err);
    }
    let status = 500;
    if (typeof err === "number") {
        status = err;
    }
    if (!res.headersSent) {
        res.status(status).send(desc);
    }
}

function getIp() {
    try {
        var os = require('os');
        var ifaces = os.networkInterfaces();
        let ifname = Object.keys(ifaces)[0];
        let iface = ifaces[ifname][0];
        return iface.address;
    } catch (error) {
        return "127.0.0.1"
    }
}

function log(text) {
    if (process.env.log != "quiet") {
        text = text + "";
        let d = new Date();
        const width = process.stdout.columns - 20;
        let equalizer = " ".repeat(width > 0 ? width : 70);
        equalizer = equalizer.slice(text.length);
        console.log(text + equalizer, d.getHours(), ":", d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes(),
            ":", d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds(), "-", d.getMilliseconds());
    }
}

async function testUser(user, password, keep) {
    let allUsers = await UserDB.find({
        user
    });

    if (allUsers.length === 0 && !keep) {
        mongoose.connection.db.dropDatabase();
        let newUser = new UserDB({
            user,
            hash: passwordHash.generate(password)
        });
        await newUser.save();
    }
}

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    log("shutdown");
});
