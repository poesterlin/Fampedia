// @ts-check
const { NewsDB, UserDB } = require("./app-db");
const { router } = require("./app");
const moment = require("moment");

router.get("/", async (req, res) => {
    const { auth, authFail, handle, sanitize } = require("./app");
    try {
        const reqUser = await auth(req.headers.user, req.headers.token).catch(authFail);
        let news = await NewsDB.find({ familyID: reqUser.familyID });
        if (news) {
            news = news.reverse()
            const userArray = await UserDB.find({familyID: reqUser.familyID})
            res.status(200).json(sanitize(news.map(newsItem => {
                let found = userArray.find(user=>user.id === newsItem.userID);
                newsItem = newsItem.toJSON();
                newsItem.userName = found.user;
                newsItem.date = moment(newsItem.date).fromNow();
                return newsItem;
            })));
        }
        else {
            throw 404;
        }
    } catch (err) {
        handle(res, err);
    }
});

async function createNews(type, userID, familyID, dataChunk ) {
    const data = { imageID: null, comment: null };
    if (type === "Image") {
        data.imageID = dataChunk;
    }
    else if (type == "Comment"){
        data.comment = dataChunk;
    }
    else if (type == "Register"){
        data.comment = dataChunk;
    }
    let newNews = new NewsDB({
        type: type,
        userID: userID,
        familyID: familyID,
        data: data
    });
    await newNews.save();
}

const msDay = 1000 * 60 * 60 * 24;
setInterval(async () => {
    const news = await NewsDB.find();
    for (const newsItem of news) {
        if (Date.now() - Date.parse(newsItem.date) > msDay) {
            await newsItem.remove();
        }
    }
}, msDay); //Run every day

exports.createNews = createNews;
exports.router = router;