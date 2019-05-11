
const { NewsDB } = require("./app-db")
const { router, auth, authFail } = require("./app");

router.get("/nall", async (req, res) => {
    try {
        const user = await auth(req.headers.user, req.headers.token).catch(authFail);
        const news = await NewsDB.find({ familyID: user.familyID });
        if (news) {
            console.log("Found")
            res.status(200).json({ news: news });
        }
        else {
            throw 404;
        }
    } catch (err) {
        handle(res, err);
    }
});

function createNews() {
    
}

module.exports = router;