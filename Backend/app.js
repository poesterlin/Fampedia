/////////////////////////////
///// Setup - Loading Modules
/////////////////////////////

"use strict";
const fs = require('fs');
const crypto = require("crypto");
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

const settings = require("./settings.json");
let Mailjet = require("node-mailjet").connect(
    settings.APIKEY_PUBLIC,
    settings.APIKEY_PRIVATE
);

const mongoUrl = process.env.mongoUrl || "mongodb://127.0.0.1:27017/news";
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

const mongoose = require("mongoose");
mongoose.connect(mongoUrl);

const server = app.listen(port, function () {
    log("The Backend Server ist running on Port " + port);
});

// Try to connect to the database
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
    log("Database connection successfull from " + getIp());
    if (process.env.user && process.env.password) {
        await testUser(process.env.user, process.env.password, true);
    }
});

/////////////////////////////
///// mongoose database schemata
/////////////////////////////

// moment
let mom = mongoose.Schema({
    momentId: Number,
    momenttitle: String,
    momentdescription: String,
    date: String,
    images: [String], // contains the id's of all images added to that moment
});

let ip = mongoose.Schema({
    ip: String,
    date: String,
    state: Number
});

let us = mongoose.Schema({
    user: String,
    hash: String
});

let token = mongoose.Schema({
    user: String,
    token: String,
    date: String
});

let image = mongoose.Schema({
    data50: Buffer,
    data320: Buffer,
    data640: Buffer,
    desc: String
});

//database models
let ImageDB = mongoose.model("image", image);
let MomentDB = mongoose.model("Moment", mom);
let UserDB = mongoose.model("user", us);
let TokenDB = mongoose.model("token", token);
let IP = mongoose.model("ip", ip);

/////////////////////////////
///// Server - Paths
/////////////////////////////

// Add a new Moment
router.post("/moment/new", async (req, res) => {
    try {
        if (!req.body.body || !req.body.title) throw 400;
        await auth(req.headers.user, req.headers.token).catch(authFail);
        
        //random integer // penis
        const count = crypto.randomBytes(64).readUIntBE(0, 3);
        
        let newMoment = new MomentDB({
            momentID: count,
            momenttitle: req.body.title,
            momentdescription: req.body.momentdescription,
            date: new Date().toUTCString(),
            // type: req.body.type, idk what type would be needed fpr
            images: []
        });

        await newMoment.save();

        log("Added 1 moment into collection");
        return res.status(201).json({
            momentID: count
        });
    } catch (error) {
        handle(res, error);
    }
});

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    // reject a file
    if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 20
    },
    fileFilter: fileFilter
});

// news
router.get("/moment/all", async (_req, res) => {
    let allMoments = await MomentDB.find();
    if (allMoments) {
        res.status(200).json(allMoments.map(mom => {
            mom.date = moment(mom.date).fromNow();
            return mom;
        }));
    } else {
        errorhandlerFn(res, err);
    }
    log("got news:" + allMoments.length);
});

//Image upload
router.post("/image/:ID", upload.single("image"), async (req, res) => {
    try {
        await auth(req.headers.user, req.headers.token).catch(authFail);
        if (!req.file) throw 400;

        let aID = parseInt(req.params.ID);
        let modArt = await MomentDB.findOne({
            articleId: aID
        });
        if (!modArt) throw 404;

        const name = req.file.filename;
        const buffer = req.file.buffer;

        const data50 = await toBuffer(buffer, name, 50, 20);
        const data320 = await toBuffer(buffer, name, 320, 65);
        const data640 = await toBuffer(buffer, name, 1000, 100);

        log("Bilder konvertiert")
        let img = new ImageDB({
            desc: req.body.desc || req.headers.desc,
            data50,
            data320,
            data640,
        });

        img = await img.save();
        modArt.images.push(img.id);
        await modArt.save();

        res.status(201).json({
            images: modArt.images
        });

        log("Bild hochgeladen");
    } catch (error) {
        handle(res, error);
    }
});

async function toBuffer(image, name, imgWidth, option) {
    return await sharp(image)
        .resize(imgWidth - 10)
        .webp({ quality: option })
        .sharpen()
        .toBuffer();
    // .background('white')
    // .embed()
}

//get image with number ImageNr
router.get("/image/:width/:ID", async (req, res, next) => {
    try {
        let imgID = req.params.ID;
        let width = parseInt(req.params.width);

        let image = await ImageDB.findOne({
            _id: imgID
        });
        if (!image) throw 404;

        let data;

        switch (width) {
            case 50:
                data = image.data50;
                break;

            case 320:
                data = image.data320;
                break;

            case 640:
                data = image.data640;
                break;

            default:
                data = image.data320;
        }

        res.setHeader('description', image.desc);
        res.setHeader('Content-Transfer-Encoding', 'binary');
        res.setHeader('Content-Type', 'image/webp');
        res.send(data);

        log("Bild gesendet");
    } catch (error) {
        handle(res, error);
    }
});


//delete image with id
router.get("/deleteimage/:ID", async (req, res) => {
    try {
        const id = req.params.ID;
        await auth(req.headers.user, req.headers.token).catch(authFail);
        await ImageDB.findByIdAndRemove(id);
        let affectedArt = await MomentDB.findOne({ images: id });
        if (!affectedArt) throw 404;
        affectedArt.images.splice(affectedArt.images.indexOf(id));
        await affectedArt.save();
        res.status(200).send("OK");
        log("Bild gelöscht");
    } catch (error) {
        handle(res, error);
    }
});

//delete article
router.get("/delete/:ID", async (req, res) => {
    try {
        await auth(req.headers.user, req.headers.token).catch(authFail);
        let aID = parseInt(req.params.ID);

        let result = await MomentDB.findOne({
            articleId: aID
        });
        if (!result) throw 404;
        let oldImages = result.images;
        await result.remove();

        if (result.ok === 0) {
            errorhandlerFn(res, aId + " not found", 404);
        } else {
            for (const imageId of oldImages) {
                await ImageDB.findByIdAndRemove(imageId)
            }

            res.status(200).send("OK");
            log("Artikel mit ID = " + aID + " geloescht");
        }
    } catch (error) {
        handle(res, error);
    }
});

router.post("/edit/:ID", async (req, res) => {
    try {
        if (!req.body.body || !req.body.title) throw 400;

        await auth(req.headers.user, req.headers.token).catch(authFail);
        let title = req.body.title;
        let body = req.body.body;
        let aID = parseInt(req.params.ID);
        let newArt = await MomentDB.findOne({
            articleId: aID
        });
        if (!newArt) throw 404;
        let prevArt = Object.assign({}, newArt);
        newArt.set({
            title,
            body
        });
        await newArt.save();

        if (newArt.title === prevArt._doc.title && newArt.body === prevArt._doc.body) {
            res.status(200).send("not changed");
            log("Artikel mit ID = " + aID + " nicht geändert");
        } else {
            res.status(200).send("OK");
            log("Artikel mit ID = " + aID + " geändert");
        }
    } catch (error) {
        handle(res, error);
    }
});

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
};

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

module.exports = {
    server,
    testUser
};