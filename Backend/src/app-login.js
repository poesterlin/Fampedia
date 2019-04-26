// @ts-check
const passwordHash = require("password-hash");
const jwt = require('jsonwebtoken');
const randtoken = require("rand-token");
const { UserDB, TokenDB } = require("./app-db");
const { router, getIp, log, handle } = require("./app");

router.post("/login", async (req, res) => {
    try {
        if (!req.body.pw || !req.body.un)
            throw 403;
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

module.exports = router;