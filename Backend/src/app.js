/////////////////////////////
///// Setup - Loading Modules
/////////////////////////////

"use strict";

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

const { UserDB, TokenDB } = require("./app-db");

app.use("/moment", require('./app-moment')); // Route to app-moment-js
app.use("/image", require('./app-image')); // Route to app-image-js

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
