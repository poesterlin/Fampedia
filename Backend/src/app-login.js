// @ts-check
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const randtoken = require("rand-token");
const { UserDB, TokenDB, FamilyDB } = require("./app-db");
const { router, log, handle } = require("./app");

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

        const findFamily = await FamilyDB.findOne({
            name: req.body.familyName
        });

        if (!findFamily) { throw 400; }

        const u = new UserDB({
            user,
            hash: await bcrypt.hash(req.body.pw, 10),
            familyID: findFamily.id
        })
        await u.save();

        res.status(201).send();
    }
    catch (error) {
        handle(res, error, "Nutzer konnte nicht registriert werden.");
    }
});


router.get("/family/:NAME", async (req, res) => {
    try {
        const findFamily = await FamilyDB.findOne({
            name: req.params.ID
        });

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

        await new FamilyDB({ name: req.body.name }).save();

        res.status(200).send();
    }
    catch (error) {
        handle(res, error);
    }
});

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