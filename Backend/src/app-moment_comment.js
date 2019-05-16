// @ts-check
const { MomentCommentDB, UserDB } = require("./app-db");
const moment = require("moment");
const { auth, authFail, handle, sanitize, router, log } = require("./app");

router.get("/moment/:ID/comments", async (req, res) => {
    let momentID = req.params.ID;
    const { auth, authFail, handle, sanitize } = require("./app");
    try {
        const reqUser = await auth(req.headers.user, req.headers.token).catch(authFail);
        let comments = await MomentCommentDB.find({ momentID: momentID });
        if (comments) {
            comments = comments.reverse()
            const userArray = await UserDB.find({familyID: reqUser.familyID})
            res.status(200).json(sanitize(comments.map(comment => {
                let found = userArray.find(user=>user.id === comment.userID);
                comment = comment.toJSON();
                comment.userName = found.user;
                comment.date = moment(comment.date).fromNow();
                return comment;
            })));
        }
        else {
            throw 404;
        }
    } catch (err) {
        handle(res, err);
    }
});

router.post("/moment/:ID/comment", async (req, res) => {
    try {
        if (!req.body.desc) {
            throw 400;
        }
        const user = await auth(req.headers.user, req.headers.token).catch(authFail);
        
        let momentID = parseInt(req.params.ID);
        let moment = new MomentCommentDB({
            userID: user.id,
            desc: req.body.desc,
            momentID: momentID
        });
        await moment.save();
        log("Added 1 comment into collection");
        return res.status(201).json();        
    }
    catch (error) {
        handle(res, error);
    }
});

module.exports = router;