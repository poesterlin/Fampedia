// @ts-check
const multer = require("multer");
const { MomentDB, ImageDB } = require("./app-db");
const { createNews } = require("./app-news.js");
const { router, log, handle } = require("./app");

const sharp = require('sharp');
sharp.cache(false);


// IMAGES
const storage = multer.memoryStorage();
const fileFilter = (_req, file, cb) => {
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
    const { auth, authFail } = require("./app");
    try {
        const user = await auth(req.headers.token).catch(authFail);
        if (!req.file) throw 400;
        let aID = parseInt(req.params.ID);
        let modArt = await MomentDB.findOne({
            momentID: aID
        });
        if (!modArt) throw 404;
        const buffer = req.file.buffer;
        const data50 = await prepareImage(buffer, 50, 20);
        const data320 = await prepareImage(buffer, 320, 65);
        const data640 = await prepareImage(buffer);
        log("Bilder konvertiert");
        let img = new ImageDB({
            desc: req.headers.desc,
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
        createNews("Image", user.id, user.familyID, img.id);
    }
    catch (error) {
        handle(res, error);
    }
});

async function prepareImage(image, resize, option) {
    if (resize) {
        return sharp(image)
            .resize(resize)
            .jpeg({ quality: option })
            .toBuffer();
    } else {
        return sharp(image)
            .jpeg()
            .toBuffer();
    }
}

//get image with number ImageNr
router.get("/getImage/:width/:ID", async (req, res, next) => {
    const { auth, authFail } = require("./app");

    try {
        await auth(req.query.token).catch(authFail);
        let imgID = req.params.ID;
        let width = parseInt(req.params.width);
        let image = await ImageDB.findOne({
            _id: imgID
        });

        if (!image) throw 404;

        let data = image['data' + width];

        if (!data) throw 404;

        res.setHeader('Content-Transfer-Encoding', 'binary');
        res.setHeader('Content-Type', 'image/jpeg');
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
    const { auth, authFail } = require("./app");
    try {
        const id = req.params.ID;
        await auth(req.headers.token).catch(authFail);
        await ImageDB.findByIdAndRemove(id);

        let affectedMoment = await MomentDB.findOne({ images: id });
        if (!affectedMoment) throw 404;

        log(affectedMoment.images);
        const pointToDelete = affectedMoment.images.indexOf(id);
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

exports.prepareImage = prepareImage
exports.router = router;