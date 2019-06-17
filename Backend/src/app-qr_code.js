// @ts-check
const { FamilyDB } = require("./app-db");
const { handle, router, log } = require("./app");
const { prepareImage } = require("./app-image");
const qr = require('qr-image');

router.get("/QRCode", async (req, res) => {
    try {
        const { auth, authFail } = require("./app");
        const reqUser = await auth(req.query.token).catch(authFail);

        let family = await FamilyDB.findById(reqUser.familyID);

        if (!family) throw 404;

        let data = family.qrCode;

        if (!data) throw 404;

        res.setHeader('Content-Transfer-Encoding', 'binary');
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(data);
        log("Bild gesendet");
    } catch (err) {
        handle(res, err);
    }
});

async function createQRCode(url) {
    const qr_png = qr.imageSync(url, { type: 'png' })
    const qr_png_buff = await prepareImage(qr_png, 320, 65);
    console.log(`Created QR Code`);
    return qr_png_buff;
}

exports.createQRCode = createQRCode;
exports.router = router;