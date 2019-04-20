const crypto = require("crypto");
const moment = require("moment");
const { router, auth, authFail, log, handle } = require("./app");
const {MomentDB, ImageDB} = require("./app-db")
/////////////////////////////
///// Server - Paths
/////////////////////////////
// Add a new Moment 
router.post("/new", async (req, res) => {
    try {
        if (!req.body.title || !req.body.description || !req.body.familyID)   {
            throw 400;
        }
        await auth(req.headers.user, req.headers.token).catch(authFail);
        //random integer 
        const count = crypto.randomBytes(64).readUIntBE(0, 3);
        let newMoment = new MomentDB({
            momentID: count,
            momenttitle: req.body.title,
            momentdescription: req.body.momentdescription,
            date: new Date().toUTCString(),
            images: [],
            familyID: req.body.familyID
        });
        await newMoment.save();
        log("Added 1 moment into collection");
        return res.status(201).json({
            momentID: count
        });
    }
    catch (error) {
        handle(res, error);
    }
});
// Get all moments
router.get("/all", async (req, res) => {

    let allMoments = await MomentDB.find({familyID : req.body.familyID});
    if (allMoments) {
        res.status(200).json(allMoments.map(mom => {
            mom.date = moment(mom.date).fromNow();
            return mom;
        }));
    }
    else {
        errorhandlerFn(res, err);
    }
    log("got moments:" + allMoments.length);
});
// Get one moment
router.get("/oneMoment", async (req, res) => {

    let result = await MomentDB.findOne({
        momentID: req.body.momentID,
        familyID : req.body.familyID
    });

    if(result){
        return result;
    }
    
    log("got moment");
});

// Delete one moment
router.delete("/delete", async (req, res) => {
    try {
        await auth(req.headers.user, req.headers.token).catch(authFail);

        //let aID = parseInt(req.params.ID);
        let result = await MomentDB.findOne({
            momentID: req.body.momentID,
            familyID : req.body.familyID
        });
        if (!result){
            throw 404;
        }
        //let oldMoment = result.mom;
        await result.remove();
        if (result.ok === 0) {
              errorhandlerFn(res, req.body.momentID + " not found", 404);
        }
        else {
            res.status(200).send("OK");
           log("Moment mit ID = " + req.body.momentID + " geloescht");
        }
    }
    catch (error) {
        handle(res, error);
    }
});

router.post("/edit/:ID", async (req, res) => {
    try {
        if (!req.body.body || !req.body.title)
            throw 400;
        await auth(req.headers.user, req.headers.token).catch(authFail);
        let title = req.body.title;
        let body = req.body.body;
        let aID = parseInt(req.params.ID);
        let newArt = await MomentDB.findOne({
            articleId: aID
        });
        if (!newArt)
            throw 404;
        let prevArt = Object.assign({}, newArt);
        newArt.set({
            title,
            body
        });
        await newArt.save();
        if (newArt.title === prevArt._doc.title && newArt.body === prevArt._doc.body) {
            res.status(200).send("not changed");
            log("Artikel mit ID = " + aID + " nicht geändert");
        }
        else {
            res.status(200).send("OK");
            log("Artikel mit ID = " + aID + " geändert");
        }
    }
    catch (error) {
        handle(res, error);
    }
});

module.exports = router;