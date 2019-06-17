// @ts-check
"use strict";
let supertest = require("supertest");
let chai = require("chai");
chai.use(require('chai-fs'));

var { server, testUser: accountSetup } = require("../src/app.js");

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

    let articles = await getMom(token);
    for (let i = 0; i < articles.length; i++) {
      await deleteMom(articles[i].momentID, token);
    }
  });

  describe("GET /news", () => {
    it("empty news", async () => {
      const r = await getMom(token)
      expect(r).to.have.lengthOf(0);
    });
  });

  describe("GET /neu", () => {
    it("insert one article and test for its existence", async () => {
      await newMom(title, body, token);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
    });

    it("missing title", async () => {
      await newMom(null, body, token, 400);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(0);
    });

    it("missing body", async () => {
      await newMom(title, null, token, 400);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(0);
    });
    it("no data", async () => {
      await newMom(null, null, token, 400);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(0);
    });
    it("no token", async () => {
      await newMom(title, body, null, 401);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(0);
    });
    it("wrong token", async () => {
      await newMom(title, body, token + "wrooong", 401);
      let allArt = await getMom(token);
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
      let newMomicle = await newMom(title, body, token);
      await deleteMom(newMomicle, token);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(0);
    });

    it("delete with wrong id", async () => {
      let newMomicle = await newMom(title, body, token);
      await deleteMom(newMomicle + 1, token, 404);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
    });

    it("try delete without credetials", async () => {
      let newMomicle = await newMom(title, body, token);
      await deleteMom(newMomicle, null, 401);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
    });

    it("delete without token", async () => {
      let newMomicle = await newMom(title, body, token);
      await deleteMom(newMomicle, null, 401);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
    });

    it("delete with wrong token", async () => {
      let newMomicle = await newMom(title, body, token);
      await deleteMom(newMomicle, token + "wrongASDFA", 401);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
    });
  });

  describe("POST /edit/:id", () => {
    it("create an article and edit it", async () => {
      let newMomicle = await newMom(title, body, token);
      await editMom(newMomicle, title + edit, body + edit, token);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title + edit);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body + edit);
    });

    it("delete title by editing", async () => {
      let newMomicle = await newMom(title, body, token);
      await editMom(newMomicle, null, body + edit, token, 400);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
    });
    it("delete body by editing", async () => {
      let newMomicle = await newMom(title, body, token);
      await editMom(newMomicle, title + edit, null, token, 400);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
    });

    it("try edit without credentials", async () => {
      let newMomicle = await newMom(title, body, token);
      await editMom(newMomicle, title + edit, body + edit, null, 401);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
    });

    it("try edit without token", async () => {
      let newMomicle = await newMom(title, body, token);
      await editMom(newMomicle, title + edit, body + edit, null, 401);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
    });
  });

  describe("POST /image/:id", () => {
    it("create an article and add an image", async () => {
      let newMomicle = await newMom(title, body, token);
      await addImage(newMomicle, imageFile, description, token);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
      expect(allArt[0].images).to.have.lengthOf(1);
    });

    it("create an article and add no image", async () => {
      let newMomicle = await newMom(title, body, token);
      await addImage(newMomicle, null, description, token, 400);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
      expect(allArt[0].images).to.have.lengthOf(0);
    });

    it.skip("create an article and add a too big image", async () => {
      let newMomicle = await newMom(title, body, token);
      await addImage(newMomicle, tooBigImageFile, description, token, 400);
      let allArt = await getMom(token);
      expect(allArt).to.have.lengthOf(1);
      expect(allArt[0].momenttitle).to.be.a("string");
      expect(allArt[0].momenttitle).to.equal(title);
      expect(allArt[0].momentdescription).to.be.a("string");
      expect(allArt[0].momentdescription).to.equal(body);
      expect(allArt[0].images).to.have.lengthOf(0);
    });

    it("add second image files", async () => {
      let newMomicle = await newMom(title, body, token);
      await addImage(newMomicle, imageFile, description, token);
      await addImage(newMomicle, secondImageFile, description, token);
      let allArt = await getMom(token);
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
      let newMomicle = await newMom(title, body, token);
      let images = await addImage(newMomicle, imageFile, description, token);
      let image = await getImage(images[0], 50, token);
      expect(image).to.be.instanceOf(Buffer);
    });
    it("get medium res", async () => {
      let newMomicle = await newMom(title, body, token);
      let images = await addImage(newMomicle, imageFile, description, token);
      let image = await getImage(images[0], 320, token);
      expect(image).to.be.instanceOf(Buffer);
    });
    it("get high res", async () => {
      let newMomicle = await newMom(title, body, token);
      let images = await addImage(newMomicle, imageFile, description, token);
      let image = await getImage(images[0], 640, token);
      expect(image).to.be.instanceof(Buffer)
    });
    it("compare size", async () => {
      let newMomicle = await newMom(title, body, token);
      let images = await addImage(newMomicle, imageFile, description, token);
      let image50 = await getImage(images[0], 50, token);
      let image320 = await getImage(images[0], 320, token);
      let image640 = await getImage(images[0], 640, token);
      expect(image50.length < image320.length).to.be.true;
      expect(image320.length <= image640.length).to.be.true;
    });
  });
  describe("DELETE image", () => {
    it("delete image and check on article", async () => {
      let newMomicle = await newMom(title, body, token);
      let images = await addImage(newMomicle, imageFile, description, token);
      await deleteImage(images[0], token)
      await getImage(images[0], 50, token, 404);
      await getImage(images[0], 320, token, 404);
      await getImage(images[0], 640, token, 404);
      let articles = await getMom(token);
      expect(articles[0].images).to.have.lengthOf(0);
    });
    it("delete article and check for images", async () => {
      let newMomicle = await newMom(title, body, token);
      let images = await addImage(newMomicle, imageFile, description, token);
      await deleteMom(newMomicle, token);
      await getImage(images[0], 50, token, 404);
      await getImage(images[0], 320, token, 404);
      await getImage(images[0], 640, token, 404);
    });
  });
  describe("setup example family", () => {
    it("setup Family with multiple users", async () => {
      const familyName = "test fam";
      const familyId = await createFamily(familyName);
      let token;
      for (let i = 0; i < 10; i++) {
        await registerUser(username + i, password, familyId);
        token = await login(username + i, password);
        await newMom("user " + i + "s moment", "test", token);
      }
      const moments = await getMom(token);
      expect(moments).to.have.lengthOf(10);
    }).timeout(20 * 1000); //10 seconds
  });
  describe("setup example family", () => {
    it("add a lot of images", async () => {

      const titles = ['Summer Vacation', 'Winter Holiday', 'Grandmas Birthday'];
      const desc = ['Summer 2018, Teneriffa',];

      for (let i = 0; i < 15; i++) {
        const t = Math.floor(Math.random() * titles.length);
        const d = Math.floor(Math.random() * desc.length);
        const id = await newMom(titles[t], desc[d], token);
        const n = Math.floor(Math.random() * 36);
        const promises = [];
        for (let j = 0; j < n; j++) {
          const r = Math.floor(Math.random() * 10);
          promises.push(addImage(id, `./test/images/im.${r}.jpg`, "no", token));
        }
        await Promise.all(promises);
      }
    }).timeout(10 * 60 * 1000); // 10 minutes
  });
});

/** @returns {Promise<{momentID: number, momenttitle: string, momentdescription: string, date: string, images: string[], type: string}[]>} */
async function getMom(token, httpStatus = 200) {
  let res = await request
    .get("/moment/all")
    .set("token", token)
    .expect(httpStatus);
  return res.body;
}

/** @returns {Promise<Buffer>} */
async function getImage(id, width, token, httpStatus = 200) {
  let res;
  if (httpStatus === 200) {
    res = await request
      .get("/momentimage/getImage/" + width + "/" + id)
      .expect(httpStatus)
      .query({ token })
      .expect('Content-Type', /jpeg/)
    } else {
      res = await request
      .get("/momentimage/getImage/" + width + "/" + id)
      .query({ token })
      .expect(httpStatus)
  }
  return res.body;
}

/** @returns {Promise<void>} */
async function deleteImage(id, token, httpStatus = 200) {
  await request
    .delete("/momentimage/deleteimage/" + id)
    .set("token", token)
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
async function deleteMom(id, token, httpStatus = 200) {
  await request
    .delete("/moment/delete")
    .send({ momentID: id })
    .set("token", token)
    .expect(httpStatus)
}

/** @returns {Promise<string[]>} */
async function addImage(id, image, desc, token, httpStatus = 201) {
  let res;
  if (image) {
    res = await request
      .post("/momentimage/addimage/" + id)
      .attach('image', image)
      .set("desc", desc)
      .set("token", token)
      .expect(httpStatus)
  } else {
    res = await request
      .post("/momentimage/addimage/" + id)
      .set("desc", desc)
      .set("token", token)
      .expect(httpStatus)
  }
  return res.body.images;
}

/** @returns {Promise<number>} */
async function newMom(title, desc, token, httpStatus = 201) {
  let res = await request
    .post("/moment/new")
    .send({
      title,
      description: desc,
      date: new Date()
    })
    .set("token", token)
    .expect(httpStatus)

  return res.body.momentID;
}

/** @returns {Promise<void>} */
async function editMom(id, title, body, token, httpStatus = 200) {
  await request
    .post("/moment/edit")
    .send({
      momentID: id,
      title: title,
      momentdescription: body
    })
    .set("token", token)
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

/** @returns {Promise<string>} */
async function createFamily(name, httpStatus = 201) {
  let res = await request
    .post("/user/family/new")
    .send({ name })
    .expect(httpStatus);

  return res.body.familyId;
}