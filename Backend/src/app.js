// @ts-check
/////////////////////////////
///// Setup - Loading Modules
/////////////////////////////

"use strict";
var fs = require('fs');
var https = require('https');
const cors = require("cors");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

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


// for local dev
// const server = app.listen(port, () => {
//     log("The Server ist running on Port " + port);
// });

const server = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/backend.df-ma.de/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/backend.df-ma.de/fullchain.pem')
}, app).listen(port, () => {
    log("The Server ist running on Port " + port);
});

exports.server = server;
exports.router = router;
exports.authFail = authFail;
exports.log = log;
exports.handle = handle;
exports.sanitize = sanitize;

const { auth, router: userRoutes } = require('./app-login');
exports.auth = auth;

const { testUser } = require("./app-db");
exports.testUser = testUser;

/**
 *  moment routes
 */
app.use("/moment", require('./app-moment'));

/**
 *  image routes
 */
app.use("/momentimage", require('./app-image'));

/**
 *  user management routes
 */
app.use("/user", userRoutes);

///////////////////
// Required global functions
//////////////////

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

function sanitize(obj) {
    const forbiddenField = ['_id', '__v'];
    if (Array.isArray(obj)) {
        obj = obj.map(sanitize);
    } else if (typeof obj === 'object') {
        obj = JSON.parse(JSON.stringify(obj));
        for (const field of Object.keys(obj)) {
            if (forbiddenField.includes(field)) {
                obj[field] = undefined;
            }
        }
    }
    return obj;
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
