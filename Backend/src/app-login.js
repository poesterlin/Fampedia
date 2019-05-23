// @ts-check
const fs = require('fs');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const randtoken = require("rand-token");
const { UserDB, TokenDB, FamilyDB, LogsDB } = require("./app-db");
const { router, log, handle } = require("./app");
const { createNews } = require("./app-news.js");
const { createQRCode } = require("./app-qr_code.js");



let secret;
try {
    secret = fs.readFileSync('../privkey.pem').toString('base64');
} catch (e) {
    console.log('unsave dev mode');
    secret = '1234';
}

router.post("/login", async (req, res) => {
    try {
        if (!req.body.pw || !req.body.un)
            throw 403;
        const user = req.body.un;
        let findUser = await UserDB.findOne({
            user
        });
        if (!findUser || ! await bcrypt.compare(req.body.pw, findUser.hash)) {
            throw 401;
        }
        let token = jwt.sign({
            userId: findUser.id,
            rand: randtoken.generate(10)
        }, secret, {
                expiresIn: '1h',
                issuer: getIp()
            });

        token = encodeURIComponent(token);

        //delete old tokens of user
        await TokenDB.deleteMany({
            user
        });
        let newToken = new TokenDB({
            user: user,
            token
        });
        await newToken.save();
        let expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 1);
        log("token generated");
        res.status(200).json({
            token,
            expireDate
        });
    }
    catch (error) {
        handle(res, error, "Nutzer konnte nicht autentifiziert werden.");
    }
});


router.post("/register", async (req, res) => {
    try {
        if (!req.body.pw || !req.body.un || !req.body.familyName) { throw 400; }
        const user = req.body.un;
        const findUser = await UserDB.findOne({ user });

        if (findUser) { throw 400; }

        const findFamily = await FamilyDB.findById(req.body.familyName);

        if (!findFamily) { throw 400; }

        const u = new UserDB({
            user,
            hash: await bcrypt.hash(req.body.pw, 13),
            familyID: findFamily.id
        })
        await u.save();
        createNews("Register", u.id, u.familyID, `${user} joined the family`);
        res.status(201).send();
    }
    catch (error) {
        handle(res, error, "Nutzer konnte nicht registriert werden.");
    }
});


router.get("/family/:ID", async (req, res) => {
    try {
        const findFamily = await FamilyDB.findById(req.params.ID);
        res.status(200).json({ avaliable: !!findFamily });
    }
    catch (error) {
        handle(res, error);
    }
});

router.post("/family/new", async (req, res) => {
    try {
        if (!req.body.name) { throw 400; }

        const findFamily = await FamilyDB.findOne({
            name: req.params.ID
        });

        if (findFamily) { throw 400; }

        const family = await new FamilyDB({ name: req.body.name }).save();

        let qrCode = await createQRCode(`https://fampedia.de/#/register?family=${family.id}`);

        const update = await FamilyDB.update({ _id: family.id }, { $set: { qrCode: qrCode } });
        res.status(201).json({ familyId: family.id });
    }
    catch (error) {
        handle(res, error);
    }
});


router.get("/logs", async (req, res) => {
    try {
        const logs = await LogsDB.find();
        log('LOGS RECIEVED: ' + req.ip, true);
        res.status(200).json(logs);
    }
    catch (error) {
        handle(res, error);
    }
});

router.get("/logs/clear", async (req, res) => {
    try {
        const logs = await LogsDB.find();
        for (const log of logs) {
            if (!log.permanent) {
                await log.remove();
            }
        }
        res.status(200).send();
    }
    catch (error) {
        handle(res, error);
    }
});

/**
 * verify token
 * @param {string | string[]} token 
 */
async function auth(token) {
    if (!token || Array.isArray(token)) {
        throw 400;
    }
    try {
        token = decodeURIComponent(token);

        let result = jwt.verify(token, secret, {
            issuer: getIp()
        });


        // @ts-ignore
        let findUser = await UserDB.findById(result.userId);
        log(findUser.user + " authorized");

        return findUser;
    } catch (err) {
        log(err);
        log("unauthorized");
        throw 401;
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

exports.auth = auth;
exports.router = router;