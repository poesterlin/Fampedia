// @ts-check
const crypto = require("crypto");
const moment = require("moment");
const { router, auth, authFail, log, handle } = require("./app");
const { MomentDB, ImageDB } = require("./app-db")
/////////////////////////////
///// Server - Paths
/////////////////////////////
// Add a new Moment 
router.post("/new", async (req, res) => {
    try {
        if (!req.body.title || !req.body.momentdescription) {
            throw 400;
        }
        const user = await auth(req.headers.user, req.headers.token).catch(authFail);
        //random integer 
        const count = crypto.randomBytes(64).readUIntBE(0, 3);
        let newMoment = new MomentDB({
            momentID: count,
            momenttitle: req.body.title,
            momentdescription: req.body.momentdescription,
            date: new Date().toUTCString(),
            images: [],
            familyID: user.familyID
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
    try {
        const user = await auth(req.headers.user, req.headers.token).catch(authFail);
        const allMoments = await MomentDB.find({ familyID: user.familyID });
        if (allMoments) {
            res.status(200).json(allMoments.map(mom => {
                mom.date = moment(mom.date).fromNow();
                return mom;
            }));
        } else {
            throw 404;
        }
        log("got moments:" + allMoments.length);
    } catch (err) {
        handle(res, err);
    }
});
// Get one moment
router.get("/oneMoment", async (req, res) => {
    try {
        const result = MomentDB.findOne({
            momentID: req.body.momentID,
            familyID: req.body.familyID
        });

        if (result) {
            res.status(200).json(await result)
        } else {
            res.status(404);
        }

        log("returned moment");
    } catch (error) {
        handle(res, error);
    }
});

// Delete one moment
router.delete("/delete", async (req, res) => {
    try {
        await auth(req.headers.user, req.headers.token).catch(authFail);

        const result = await MomentDB.findOne({
            momentID: req.body.momentID,
        });
        log("deleted moment");
        if (!result) {
            throw 404;
        }
        for (const image of result.images) {
            await ImageDB.findByIdAndRemove(image);
            log("delted image");
        }
        await result.remove();
        res.status(200).send("OK");
        log("Moment mit ID = " + req.body.momentID + " geloescht");
    }
    catch (error) {
        handle(res, error);
    }
});

// Edit one moment
router.post("/edit", async (req, res) => {
    try {
        await auth(req.headers.user, req.headers.token).catch(authFail);
        if (!req.body.title || !req.body.momentdescription || !req.body.momentID) {
            throw 400;
        }

        const query = { momentID: req.body.momentID };
        var newvalues = { $set: { momenttitle: req.body.title, momentdescription: req.body.momentdescription } };
        MomentDB.updateOne(query, newvalues, function (err) {
            if (err) {
                res.status(404).send("not found");
            } else {
                log("1 moment updated");
                res.status(200).send("OK");
            }
        });
    } catch (error) {
        handle(res, error);
    }
});

module.exports = router;