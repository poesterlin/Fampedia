// @ts-check
/////////////////////////////
///// Setup - Loading Modules
/////////////////////////////

"use strict";

const cors = require("cors");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const moment = require("moment");
moment.locale("de");

const sharp = require('sharp');
sharp.cache({
    files: 0
});

const port = process.env.PORT || 3000;

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
exports.router = router;
exports.auth = auth;
exports.authFail = authFail;
exports.log = log;
exports.handle = handle;
exports.getIp = getIp;

const { UserDB, testUser } = require("./app-db");
exports.testUser = testUser;

app.use("/moment", require('./app-moment')); // Route to app-moment-js
app.use("/momentimage", require('./app-image')); // Route to app-moment-js
app.use("/user", require('./app-login')); // Route to app-moment-js


///////////////////
// Required global functions
//////////////////


/**
 * verify token
 * @param {string | string[]} user 
 * @param {string | string[]} token 
 */
async function auth(user, token) {
    if (!user || !token || Array.isArray(user) || Array.isArray(token)) {
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
        // @ts-ignore
        if (!result || result.user !== user)
            throw "cant verify token";

        log(user + " authorized");
        return findUser;
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

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    log("shutdown");
});
