// @ts-check
"use strict";
let supertest = require("supertest");
let chai = require("chai");
chai.use(require('chai-fs'));
let { server, testUser: accountSetup } = require("../src/app.js");

let expect = chai.expect;
let request = supertest(server);

let token = "";
const username = "fampedia";

const password = "fampedia";
const title = "Automated Test Article";
const body = "This is an automated article";
const edit = "--modified";
const imageFile = "./test/testImage.jpg";
const description = "this is a test image";
const tooBigImageFile = "big"
const secondImageFile = "./test/testImage.jpg"

process.env.test = "true";

describe("Task API Routes", () => {
  // before(async () => {
  //   const name = "second Family";
  //   await createFamily(name);
  //   await registerUser(username + name, password, name);
  //   token2 = await login(username + name, password);
  // })
  // This function will run before every test to clear database
  beforeEach(async () => {
    await accountSetup(username, password, false);
    token = await login(username, password);

    let articles = await getMom(token, username);
    for (let i = 0; i < articles.length; i++) {
      await deleteMom(articles[i].momentID, username, token);
    }
  });

  describe("GET /news", () => {
    it("empty news", async () => {
      const r = await getMom(token, username)
      expect(r).to.have.lengthOf(0);
    });
  });

  describe("GET /neu", () => {
    it("insert one article and test for its existence", async () => {
      await newMom(title, body, token, username);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
    });

    it("missing title", async () => {
      await newMom(null, body, token, username, 400);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(0);
    });

    it("missing body", async () => {
      await newMom(title, null, token, username, 400);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(0);
    });
    it("no data", async () => {
      await newMom(null, null, token, username, 400);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(0);
    });
    it("no token", async () => {
      await newMom(title, body, null, username, 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(0);
    });
    it("no user", async () => {
      await newMom(title, body, token, null, 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(0);
    });
    it("wrong token", async () => {
      await newMom(title, body, token + "wrooong", username, 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(0);
    });
    it("wrong user", async () => {
      await newMom(title, body, token, username + "wrooong", 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(0);
    });
  });

  describe("POST /login", () => {
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

  describe("GET /delete/:id", () => {
    it("create an article and delete it", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await deleteMom(newMomicle, username, token);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(0);
    });

    it("delete with wrong id", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await deleteMom(newMomicle + 1, username, token, 404);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
    });

    it("try delete without credetials", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await deleteMom(newMomicle, null, null, 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
    });

    it("delete without token", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await deleteMom(newMomicle, username, null, 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
    });

    it("delete without user", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await deleteMom(newMomicle, null, token, 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
    });

    it("delete with wrong token", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await deleteMom(newMomicle, username, token + "wrongASDFA", 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
    });

    it("delete with not registerd user", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await deleteMom(newMomicle, username + "wrongASDFA", token, 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
    });
  });

  describe("POST /edit/:id", () => {
    it("create an article and edit it", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await editMom(newMomicle, title + edit, body + edit, username, token);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title + edit);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body + edit);
    });

    it("delete title by editing", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await editMom(newMomicle, null, body + edit, username, token, 400);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
    });
    it("delete body by editing", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await editMom(newMomicle, title + edit, null, username, token, 400);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
    });

    it("try edit without credentials", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await editMom(newMomicle, title + edit, body + edit, null, null, 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
    });

    it("try edit without token", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await editMom(newMomicle, title + edit, body + edit, username, null, 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
    });

    it("try edit without user", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await editMom(newMomicle, title + edit, body + edit, null, token, 401);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
    });
  });

  describe("POST /image/:id", () => {
    it("create an article and add an image", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await addImage(newMomicle, imageFile, description, username, token);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
      expect(allArt[0].images).to.have.lengthOf(1);
    });

    it("create an article and add no image", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await addImage(newMomicle, null, description, username, token, 400);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
      expect(allArt[0].images).to.have.lengthOf(0);
    });

    it.skip("create an article and add a too big image", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await addImage(newMomicle, tooBigImageFile, description, username, token, 400);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
      expect(allArt[0].images).to.have.lengthOf(0);
    });

    it("add second image files", async () => {
      let newMomicle = await newMom(title, body, token, username);
      await addImage(newMomicle, imageFile, description, username, token);
      await addImage(newMomicle, secondImageFile, description, username, token);
      let allArt = await getMom(token, username);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
      expect(allArt[0].images).to.have.lengthOf(2);
    });
  });

  describe("GET image", () => {
    it("get thumnail", async () => {
      let newMomicle = await newMom(title, body, token, username);
      let images = await addImage(newMomicle, imageFile, description, username, token);
      let image = await getImage(images[0], 50);
      expect(image).to.be.instanceOf(Buffer);
    });
    it("get medium res", async () => {
      let newMomicle = await newMom(title, body, token, username);
      let images = await addImage(newMomicle, imageFile, description, username, token);
      let image = await getImage(images[0], 320);
      expect(image).to.be.instanceOf(Buffer);
    });
    it("get high res", async () => {
      let newMomicle = await newMom(title, body, token, username);
      let images = await addImage(newMomicle, imageFile, description, username, token);
      let image = await getImage(images[0], 640);
      expect(image).to.be.instanceof(Buffer)
    });
    it("compare size", async () => {
      let newMomicle = await newMom(title, body, token, username);
      let images = await addImage(newMomicle, imageFile, description, username, token);
      let image50 = await getImage(images[0], 50);
      let image320 = await getImage(images[0], 320);
      let image640 = await getImage(images[0], 640);
      expect(image50.length < image320.length).to.be.true;
      expect(image320.length <= image640.length).to.be.true;
    });
  });
  describe("DELETE image", () => {
    it("delete image and check on article", async () => {
      let newMomicle = await newMom(title, body, token, username);
      let images = await addImage(newMomicle, imageFile, description, username, token);
      await deleteImage(images[0], token, username)
      await getImage(images[0], 50, 404);
      await getImage(images[0], 320, 404);
      await getImage(images[0], 640, 404);
      let articles = await getMom(token, username);
      expect(articles[0].images).to.have.lengthOf(0);
    });
    it("delete article and check for images", async () => {
      let newMomicle = await newMom(title, body, token, username);
      let images = await addImage(newMomicle, imageFile, description, username, token);
      await deleteMom(newMomicle, username, token);
      await getImage(images[0], 50, 404);
      await getImage(images[0], 320, 404);
      await getImage(images[0], 640, 404);
    });
  });
  describe("setup example family", () => {
    it("setup Family with multiple users", async () => {
      const familyName = "test fam";
      await createFamily(familyName);
      let token;
      for (let i = 0; i < 10; i++) {
        await registerUser(username + i, password, familyName);
        token = await login(username + i, password);
        await newMom("user " + i + "s moment", "test", token, username + i);
      }
      const moments = await getMom(token, username + 9);
      expect(moments).to.have.lengthOf(10);
    });
  });
  describe("setup example family", () => {
    it("add a lot of images", async () => {

      const titles = ['Summer Vacation', 'Winter Holiday', 'Grandmas Birthday'];
      const desc = ['Summer 2018, Teneriffa', ];

      for (let i = 0; i < 20; i++) {
        const t = Math.floor(Math.random() * titles.length);
        const d = Math.floor(Math.random() * desc.length);
        const id = await newMom(titles[t], desc[d], token, username);
        const n = Math.floor(Math.random() * 36);
        const promises = [];
        for (let j = 0; j < n; j++) {
          const r = Math.floor(Math.random() * 36);
          promises.push(addImage(id, `./test/images/im.${r}.jpg`, "no", username, token));
        }
        await Promise.all(promises);
      }
    }).timeout(10 * 60 * 1000); // 10 minutes
  });
});

/** @returns {Promise<{momentID: number, momenttitle: string, momentdescription: string, date: string, images: string[], type: string}[]>} */
async function getMom(token, username, httpStatus = 200) {
  let res = await request
    .get("/moment/all")
    .set("token", token)
    .set("user", username)
    .expect(httpStatus);
  return res.body;
}

/** @returns {Promise<Buffer>} */
async function getImage(id, width, httpStatus = 200) {
  let res;
  if (httpStatus === 200) {
    res = await request
      .get("/momentimage/getImage/" + width + "/" + id)
      .expect(httpStatus)
      .expect('Content-Type', /webp/)
  } else {
    res = await request
      .get("/momentimage/getImage/" + width + "/" + id)
      .expect(httpStatus)
  }
  return res.body;
}

/** @returns {Promise<void>} */
async function deleteImage(id, token, username, httpStatus = 200) {
  await request
    .delete("/momentimage/deleteimage/" + id)
    .set("token", token)
    .set("user", username)
    .expect(httpStatus)
}

/** @returns {Promise<string>} */
async function login(un, pw, httpStatus = 200) {
  let res = await request
    .post("/user/login")
    .send({
      un,
      pw
    })
    .expect(httpStatus);
  return res.body.token;
}

/** @returns {Promise<void>} */
async function deleteMom(id, username, token, httpStatus = 200) {
  await request
    .delete("/moment/delete")
    .send({ momentID: id })
    .set("token", token)
    .set("user", username)
    .expect(httpStatus)
}

/** @returns {Promise<string[]>} */
async function addImage(id, image, desc, username, token, httpStatus = 201) {
  let res;
  if (image) {
    res = await request
      .post("/momentimage/addimage/" + id)
      .attach('image', image)
      .set("desc", desc)
      .set("token", token)
      .set("user", username)
      .expect(httpStatus)
  } else {
    res = await request
      .post("/momentimage/addimage/" + id)
      .set("desc", desc)
      .set("token", token)
      .set("user", username)
      .expect(httpStatus)
  }
  return res.body.images;
}

/** @returns {Promise<number>} */
async function newMom(title, desc, token, username, httpStatus = 201) {
  let res = await request
    .post("/moment/new")
    .send({
      title,
      momentdescription: desc,
    })
    .set("token", token)
    .set("user", username)
    .expect(httpStatus)

  return res.body.momentID;
}

/** @returns {Promise<void>} */
async function editMom(id, title, body, username, token, httpStatus = 200) {
  await request
    .post("/moment/edit")
    .send({
      momentID: id,
      title: title,
      momentdescription: body
    })
    .set("token", token)
    .set("user", username)
    .expect(httpStatus)
}

/** @returns {Promise<void>} */
async function registerUser(un, pw, fam, httpStatus = 201) {
  await request
    .post("/user/register")
    .send({
      un,
      pw,
      familyName: fam
    })
    .expect(httpStatus);
}

/** @returns {Promise<void>} */
async function familyAvaliable(name, httpStatus = 200) {
  await request
    .get("/user/family/" + name)
    .expect(httpStatus)
}

/** @returns {Promise<void>} */
async function createFamily(name, httpStatus = 200) {
  await request
    .post("/user/family/new")
    .send({ name })
    .expect(httpStatus)
}