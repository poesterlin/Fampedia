const { router, auth, authFail, log, handle, sanitize } = require("./app");
const { MomentDB } = require("./app-db")


router.post("/moment/:ID/tag", async (req, res) => {
    try {
        if (!req.body.ids) {
            throw 400;
        }
        await auth(req.headers.token).catch(authFail);

        await MomentDB.update({ momentID: req.params.ID }, { $set: { taggedUsers: req.body.ids } });
        
        res.status(201).json();
        log(`Saved tagged users to moment with id: ${req.params.ID}`);
    }
    catch (error) {
        handle(res, error);
    }
});

router.get("/tagged/:ID", async (req, res) => {
    try {
        await auth(req.headers.token).catch(authFail);
        const allMoments = await MomentDB.find({ taggedUsers: req.params.ID });

            res.status(200).json(sanitize(allMoments.map(mom => {
                return mom.momentID;
            })));
            log(`user was tagged in ${allMoments.length} moments.`); 
    } catch (err) {
        handle(res, err);
    }
});

module.exports = router;