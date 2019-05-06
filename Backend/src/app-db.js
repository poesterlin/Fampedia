const mongoose = require("mongoose");
const mongoUrl = process.env.mongoUrl || "mongodb://127.0.0.1:27017/fampedia";
const bcrypt = require("bcrypt");

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

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    log("shutdown");
    process.exit(0);
});


/////////////////////////////
///// mongoose database schemata
/////////////////////////////
// moment
let mom = mongoose.Schema({
    momentID: Number,
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
    hash: String,
    familyID: String
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
let family = mongoose.Schema({
    name: String,
});

async function testUser(user, password, keep = true) {
    let allUsers = await UserDB.find({
        user
    });

    if (allUsers.length === 0 || !keep) {
        mongoose.connection.db.dropDatabase();
        const fam = await new FamilyDB({name: 'Test Family'}).save();
        let newUser = new UserDB({
            user,
            hash: await bcrypt.hash(password, 10),
            familyID: fam.id,
        });
        await newUser.save();
    }
}
exports.testUser = testUser;

//database models
let ImageDB = mongoose.model("image", image);
exports.ImageDB = ImageDB;
let MomentDB = mongoose.model("Moment", mom);
exports.MomentDB = MomentDB;
let UserDB = mongoose.model("user", us);
exports.UserDB = UserDB;
let FamilyDB = mongoose.model("family", family);
exports.FamilyDB = FamilyDB;
let TokenDB = mongoose.model("token", token);
exports.TokenDB = TokenDB;
let IP = mongoose.model("ip", ip);
exports.IP = IP;
