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
        if (!req.body.title || !req.body.momentdescription || !req.body.familyID)   {
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
    try {
        let result =  MomentDB.findOne({
            momentID: req.body.momentID,
            familyID : req.body.familyID
        });
    
        if(result){
            res.status(200).json(await result)
        }else{
            res.status(404);
        }
        
        log("returned moment");
    } catch(error){
        handle(res, error);
    }
});

// Delete one moment
router.delete("/delete", async (req, res) => {
    try {
        await auth(req.headers.user, req.headers.token).catch(authFail);

        let result = await MomentDB.findOne({
            momentID: req.body.momentID,
            familyID : req.body.familyID
        });
        log(result);
        if (!result){
            throw 404;
        }
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

// Edit one moment
router.post("/edit", async (req, res) => {

    if (!req.body.title || !req.body.momentdescription || !req.body.momentID || !req.body.familyID )   {
        res.status(400).send("Incomplete body");
    }

    var myquery = { momentID: req.body.momentID, familyID: req.body.familyID };
    var newvalues = { $set: {momenttitle: req.body.title , momentdescription: req.body.momentdescription } };
    MomentDB.updateOne(myquery, newvalues, function(err) {
        if (err) {
            res.status(404).send("not found");
        }else{
            console.log("1 moment updated");
            res.status(200).send("OK");
        }
      });
});

module.exports = router;