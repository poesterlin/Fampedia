const mongoose = require("mongoose");
const mongoUrl = process.env.mongoUrl || "mongodb://127.0.0.1:27017/news";

const { log } = require("./app");
mongoose.connect(mongoUrl);
// Try to connect to the database
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
    log("Database connection successfully");
    if (process.env.user && process.env.password) {
        await testUser(process.env.user, process.env.password, true);
    }
});
/////////////////////////////
///// mongoose database schemata
/////////////////////////////
// moment
let mom = mongoose.Schema({
    momentId: Number,
    momenttitle: String,
    momentdescription: String,
    date: String,
    images: [String],
    familyID: String
});
let ip = mongoose.Schema({
    ip: String,
    date: String,
    state: Number
});
let us = mongoose.Schema({
    user: String,
    hash: String
});
let token = mongoose.Schema({
    user: String,
    token: String,
    date: String
});
let image = mongoose.Schema({
    data50: Buffer,
    data320: Buffer,
    data640: Buffer,
    desc: String
});

async function testUser(user, password, keep) {
    let allUsers = await UserDB.find({
        user
    });

    if (allUsers.length === 0 && !keep) {
        mongoose.connection.db.dropDatabase();
        let newUser = new UserDB({
            user,
            hash: passwordHash.generate(password)
        });
        await newUser.save();
    }
}

//database models
let ImageDB = mongoose.model("image", image);
exports.ImageDB = ImageDB;
let MomentDB = mongoose.model("Moment", mom);
exports.MomentDB = MomentDB;
let UserDB = mongoose.model("user", us);
exports.UserDB = UserDB;
let TokenDB = mongoose.model("token", token);
exports.TokenDB = TokenDB;
let IP = mongoose.model("ip", ip);
exports.IP = IP;
