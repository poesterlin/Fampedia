const multer = require("multer");
const sharp = require('sharp');
const { MomentDB, ImageDB } = require("./app-db");
const { router, auth, authFail, log, handle } = require("./app");
// IMAGES
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
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
//Image upload
router.post("/addimage/:ID", upload.single("image"), async (req, res) => {
    try {
        await auth(req.headers.user, req.headers.token).catch(authFail);
        if (!req.file)
            throw 400;
        let aID = parseInt(req.params.ID);
        let modArt = await MomentDB.findOne({
            momentID: aID
        });
        if (!modArt)
            throw 404;
        const name = req.file.filename;
        const buffer = req.file.buffer;
        const data50 = await toBuffer(buffer, name, 50, 20);
        const data320 = await toBuffer(buffer, name, 320, 65);
        const data640 = await toBuffer(buffer, name, 1000, 100);
        log("Bilder konvertiert");
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
    }
    catch (error) {
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
router.get("/getImage/:width/:ID", async (req, res, next) => {
    try {
        let imgID = req.params.ID;
        let width = parseInt(req.params.width);
        let image = await ImageDB.findOne({
            _id: imgID
        });
        if (!image)
            throw 404;
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
    }
    catch (error) {
        handle(res, error);
    }
});
//delete image with id
router.delete("/deleteImage/:ID", async (req, res) => {
    // also update moment: need to add image to string array

    try {
        const id = req.params.ID;
        await auth(req.headers.user, req.headers.token).catch(authFail);
        await ImageDB.findByIdAndRemove(id);

        let affectedMoment = await MomentDB.findOne({ images: id });
        if (!affectedMoment)
            throw 404;
        log(affectedMoment.images);
        pointToDelete = affectedMoment.images.indexOf(id);
        affectedMoment.images.splice(pointToDelete, 1);
        await affectedMoment.save();
        log(affectedMoment.images);
        res.status(200).send("OK");
        log("Bild gelöscht");
    }
    catch (error) {
        handle(res, error);
    }
});

module.exports = router;