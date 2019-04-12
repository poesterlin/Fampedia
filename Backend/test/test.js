// @ts-check
"use strict";
var supertest = require("supertest");
var chai = require("chai");
chai.use(require('chai-fs'));
var {
  server,
  testUser
} = require("../app.js");

let accountSetup = testUser;
let expect = chai.expect;
let request = supertest(server);

let token = "";
const username = "fampedia";
const password = "fampedia";
const title = "Automated Test Article";
const body = "This is an automated article";
const type = "leistungen"
const edit = "--modified";
const imageFile = "testImage"
const description = "this is a test image"
const tooBigImageFile = "big"
const secondImageFile = "secondTestImage"
const addr = "test@test.de";
const betreff = "Automated Test Email";
const name = "Herr Node von JS";
const text = "I bims ein TEst";

describe("Task API Routes", function () {
  // This function will run before every test to clear database
  beforeEach(async () => {
    await accountSetup(username, password);
    token = await login(username, password);
    let articles = await getArt();
    for (let i = 0; i < articles.length; i++) {
      await deleteArt(articles[i].articleId, username, token);
    }
  });

  describe("GET /news", function () {
    it("empty news", (done) => {
      request
        .get("/news")
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.lengthOf(0);
          return done(err);
        });
    });
  });

  describe("GET /neu", function () {
    it("insert one article and test for its existence", async () => {
      await newArt(title, body, type, token, username);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].title).to.be.a("string");
      expect(allArt[0].title).to.equal(title);
      expect(allArt[0].body).to.be.a("string");
      expect(allArt[0].body).to.equal(body);
    });

    it("missing title", async () => {
      await newArt(null, body, type, token, username, 400);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(0);
    });

    it("missing body", async () => {
      await newArt(title, null, type, token, username, 400);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(0);
    });
    it("no data", async () => {
      await newArt(null, null, type, token, username, 400);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(0);
    });
    it("no token", async () => {
      await newArt(title, body, type, null, username, 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(0);
    });
    it("no user", async () => {
      await newArt(title, body, type, token, null, 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(0);
    });
    it("wrong token", async () => {
      await newArt(title, body, type, token + "wrooong", username, 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(0);
    });
    it("wrong user", async () => {
      await newArt(title, body, type, token, username + "wrooong", 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(0);
    });
  });

  describe("POST /login", function () {
    it("no credentials", async () => {
      await login(null, null, 403);
    });
    it("wrong username", async () => {
      await login("wrongUN!§$%&/(=", password, 401);
    });

    it("wrong password", async () => {
      await login(username, "wrongPW!§$%&/(=", 401);
    });

    it("correct", async () => {
      let restoken = await login(username, password);
      expect(restoken).to.be.a("string");
    });
    it("new token every time for Raphi", async () => {
      let restoken = await login(username, password);
      expect(restoken).to.be.a("string");
      expect(restoken).not.to.equal(token);
    });
  });

  describe("GET /delete/:id", function () {
    it("create an article and delete it", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await deleteArt(newArticle, username, token);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(0);
    });

    it("delete with wrong id", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await deleteArt(newArticle + 1, username, token, 404);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
    });

    it("try delete without credetials", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await deleteArt(newArticle, null, null, 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
    });

    it("delete without token", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await deleteArt(newArticle, username, null, 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
    });

    it("delete without user", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await deleteArt(newArticle, null, token, 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
    });

    it("delete with wrong token", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await deleteArt(newArticle, username, token + "wrongASDFA", 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
    });

    it("delete with wrong user", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await deleteArt(newArticle, username + "wrongASDFA", token, 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
    });
  });

  describe("POST /edit/:id", function () {
    it("create an article and edit it", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await editArt(newArticle, title + edit, body + edit, username, token);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].title).to.be.a("string");
      expect(allArt[0].title).to.equal(title + edit);
      expect(allArt[0].body).to.be.a("string");
      expect(allArt[0].body).to.equal(body + edit);
    });

    it("delete title by editing", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await editArt(newArticle, null, body + edit, username, token, 400);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].title).to.be.a("string");
      expect(allArt[0].title).to.equal(title);
      expect(allArt[0].body).to.be.a("string");
      expect(allArt[0].body).to.equal(body);
    });
    it("delete body by editing", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await editArt(newArticle, title + edit, null, username, token, 400);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].title).to.be.a("string");
      expect(allArt[0].title).to.equal(title);
      expect(allArt[0].body).to.be.a("string");
      expect(allArt[0].body).to.equal(body);
    });

    it("try edit without credentials", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await editArt(newArticle, title + edit, body + edit, null, null, 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].title).to.be.a("string");
      expect(allArt[0].title).to.equal(title);
      expect(allArt[0].body).to.be.a("string");
      expect(allArt[0].body).to.equal(body);
    });

    it("try edit without token", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await editArt(newArticle, title + edit, body + edit, username, null, 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].title).to.be.a("string");
      expect(allArt[0].title).to.equal(title);
      expect(allArt[0].body).to.be.a("string");
      expect(allArt[0].body).to.equal(body);
    });

    it("try edit without user", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await editArt(newArticle, title + edit, body + edit, null, token, 401);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].title).to.be.a("string");
      expect(allArt[0].title).to.equal(title);
      expect(allArt[0].body).to.be.a("string");
      expect(allArt[0].body).to.equal(body);
    });
  });

  describe.skip("POST /image/:id", function () {
    it("create an article and add an image", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await addImage(newArticle, 'test/' + imageFile + '.jpg', description, username, token);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].title).to.be.a("string");
      expect(allArt[0].title).to.equal(title);
      expect(allArt[0].body).to.be.a("string");
      expect(allArt[0].body).to.equal(body);
      expect(allArt[0].images).to.have.lengthOf(1);
    });

    it("create an article and add no image", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await addImage(newArticle, null, description, username, token, 400);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].title).to.be.a("string");
      expect(allArt[0].title).to.equal(title);
      expect(allArt[0].body).to.be.a("string");
      expect(allArt[0].body).to.equal(body);
      expect(allArt[0].images).to.have.lengthOf(0);
    });

    it("create an article and add a too big image", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await addImage(newArticle, 'test/' + tooBigImageFile + '.jpg', description, username, token, 400);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].title).to.be.a("string");
      expect(allArt[0].title).to.equal(title);
      expect(allArt[0].body).to.be.a("string");
      expect(allArt[0].body).to.equal(body);
      expect(allArt[0].images).to.have.lengthOf(0);
    });

    it("add second image files", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      await addImage(newArticle, 'test/' + imageFile + '.jpg', description, username, token);
      await addImage(newArticle, 'test/' + secondImageFile + '.jpg', description, username, token);
      let allArt = await getArt();
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].title).to.be.a("string");
      expect(allArt[0].title).to.equal(title);
      expect(allArt[0].body).to.be.a("string");
      expect(allArt[0].body).to.equal(body);
      expect(allArt[0].images).to.have.lengthOf(2);
    });
  });


  describe("POST /contact", function () {
    it("try sending an email without return address", async () => {
      await sendMail(null, betreff, name, text, 400);
    });
    it("try sending an email without a message", async () => {
      await sendMail(addr, betreff, name, null, 400);
    });
    it("try sending an email", async () => {
      await sendMail(addr, betreff, name, text);
    });
    it("try sending another email", async () => {
      await sendMail(addr, betreff, name, text, 429);
    });
  });

  describe.skip("GET image", function () {
    it("get thumnail", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      let images = await addImage(newArticle, 'test/' + imageFile + '.jpg', description, username, token);
      let image = await getImage(images[0], 50);
      expect(image.imgData).to.be.a("string");
      expect(image.desc).to.be.a("string");
      expect(image.desc).to.equal(description);
    });
    it("get medium res", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      let images = await addImage(newArticle, 'test/' + imageFile + '.jpg', description, username, token);
      let image = await getImage(images[0], 320);
      expect(image.imgData).to.be.a("string");
      expect(image.desc).to.be.a("string");
      expect(image.desc).to.equal(description);
    });
    it("get high res", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      let images = await addImage(newArticle, 'test/' + imageFile + '.jpg', description, username, token);
      let image = await getImage(images[0], 640);
      expect(image.imgData).to.be.a("string");
      expect(image.desc).to.be.a("string");
      expect(image.desc).to.equal(description);
    });
    it("compare size", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      let images = await addImage(newArticle, 'test/' + imageFile + '.jpg', description, username, token);
      let image50 = await getImage(images[0], 50);
      let image320 = await getImage(images[0], 320);
      let image640 = await getImage(images[0], 640);
      expect(image50.imgData.length < image320.imgData.length).to.be.true;
      expect(image320.imgData.length <= image640.imgData.length).to.be.true;
    });
  });
  describe.skip("DELETE image", function () {
    it("delete image and check on article", async () => {
      let newArticle = await newArt(title, body, type, token, username);
      let images = await addImage(newArticle, 'test/' + imageFile + '.jpg', description, username, token);
      await deleteImage(images[0], token, username)
      await getImage(images[0], 50, 404);
      await getImage(images[0], 320, 404);
      await getImage(images[0], 640, 404);
      let articles = await getArt();
      expect(articles[0].images).to.have.lengthOf(0);
    });
  });
});

/** @returns {Promise<{articleId: number, title: string, body: string, date: string, images: string[], type: string}[]>} */
async function getArt(httpStatus = 200) {
  var res = await request
    .get("/news")
    .expect(httpStatus)
  return res.body;
}

/** @returns {Promise<{imgData: string, desc: string}>} */
async function getImage(id, width, httpStatus = 200) {
  var res = await request
    .get("/image/" + width + "/" + id)
    .expect(httpStatus)
  return res.body;
}

/** @returns {Promise<void>} */
async function deleteImage(id, token, username, httpStatus = 200) {
  await request
    .get("/deleteimage/" + id)
    .set("token", token)
    .set("user", username)
    .expect(httpStatus)
}

/** @returns {Promise<string>} */
async function login(un, pw, httpStatus = 200) {
  var res = await request
    .post("/login")
    .send({
      un,
      pw
    })
    .expect(httpStatus);
  return res.body.token;
}

/** @returns {Promise<void>} */
async function deleteArt(id, username, token, httpStatus = 200) {
  await request
    .get("/delete/" + id)
    .set("token", token)
    .set("user", username)
    .expect(httpStatus)
}
/** @returns {Promise<string[]>} */
async function addImage(id, image, desc, username, token, httpStatus = 201) {
  var res;
  if (image) {
    res = await request
      .post("/image/" + id)
      .attach('image', image)
      .set("desc", desc)
      .set("token", token)
      .set("user", username)
      .expect(httpStatus)
  } else {
    res = await request
      .post("/image/" + id)
      .set("desc", desc)
      .set("token", token)
      .set("user", username)
      .expect(httpStatus)
  }
  return res.body.images;
}

/** @returns {Promise<number>} */
async function newArt(title, body, type, token, username, httpStatus = 201) {
  var res = await request
    .post("/neu")
    .send({
      title,
      body,
      type
    })
    .set("token", token)
    .set("user", username)
    .expect(httpStatus)

  return res.body.articleId;
}

/** @returns {Promise<void>} */
async function editArt(id, title, body, username, token, httpStatus = 200) {
  await request
    .post("/edit/" + id)
    .send({
      title: title,
      body: body
    })
    .set("token", token)
    .set("user", username)
    .expect(httpStatus)
}

/** @returns {Promise<void>} */
async function sendMail(addr, betreff, name, text, httpStatus = 200) {
  await request
    .post("/contact")
    .send({
      email: addr,
      betreff,
      name,
      text
    })
    .expect(httpStatus)
}

function thrower(err) {
  throw err;
}