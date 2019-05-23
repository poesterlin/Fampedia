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


let server;
if (process.env.NODE_ENV === 'production') {
    server = https.createServer({
        key: fs.readFileSync('../privkey.pem'),
        cert: fs.readFileSync('../fullchain.pem')
    }, app).listen(port, () => {
        log("The Server ist running on Port " + port);
    });
}
else {
    server = app.listen(port, () => {
        log("The Server ist running on Port " + port);
    });
}

const io = require('socket.io').listen(server);

exports.server = server;
exports.router = router;
exports.authFail = authFail;
exports.log = log;
exports.handle = handle;
exports.sanitize = sanitize;
exports.sendToSocket = sendToSocket;

const { auth, router: userRoutes } = require('./app-login');
exports.auth = auth;

const { testUser, LogsDB } = require("./app-db");
exports.testUser = testUser;

const { router:newsRoutes } = require("./app-news")
const { router:qrRoutes } = require("./app-qr_code")
const { router:imageRoutes } = require("./app-image")

/**
 *  moment routes
 */
app.use("/moment", require('./app-moment'));
app.use("/", require('./app-moment_comment'));

/**
 * qr codes
 */
app.use("/", qrRoutes);
/**
 *  image routes
 */
app.use("/momentimage", imageRoutes);

/**
 *  user management routes
 */
app.use("/user", userRoutes);

/**
 *  news routes
 */
app.use("/news", newsRoutes);

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


/**
 * 
 * @param {{message: string, date: string}} log 
 */
function sendToSocket(log) {
    // io.emit('log', { for: 'everyone' }, JSON.stringify(log));
    io.emit('log', JSON.stringify(log));
}


function log(message, logPerm = false) {
    new LogsDB({ message, date: new Date(), permanent: logPerm }).save();
    if (process.env.log != "quiet") {
        message = message + "";
        let d = new Date();
        const date = `${d.getHours()} : ${d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes()} : ${d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds()} - ${d.getMilliseconds()}`
        const width = process.stdout.columns - 20;
        let equalizer = " ".repeat(width > 0 ? width : 70);
        equalizer = equalizer.slice(message.length);
        console.log(message + equalizer, date);
    }
}
