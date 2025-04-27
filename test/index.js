process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

const testData = require("./testData.json");
const { handleResponse, chaiCallback } = require("./common");
require("./hook");

chai.should();
chai.use(chaiHttp);

let token = "";
let contactId = "";

describe("Auth & Contact API Tests", () => {
  // =================== AUTH TESTS ===================
  describe("Auth Routes", () => {
    it("should register a new user", (done) => {
      chai
        .request(app)
        .post("/register")
        .send(testData.validUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property("success").eql(true);
          done();
        });
    });

    it("should not register with existing email", (done) => {
      chai
        .request(app)
        .post("/register")
        .send(testData.validUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("success").eql(false);
          done();
        });
    });

    it("should login successfully", (done) => {
      chai
        .request(app)
        .post("/login")
        .send({
          email: testData.validUser.email,
          password: testData.validUser.password
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("token");
          token = res.body.token;
          done();
        });
    });

    it("should not login with incorrect password", (done) => {
      chai
        .request(app)
        .post("/login")
        .send(testData.invalidUser)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("error");
          done();
        });
    });

    it("should fetch current logged-in user", (done) => {
      chai
        .request(app)
        .get("/me")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          chaiCallback(err, res, done);
        });
    });

    it("should not fetch user without token", (done) => {
      chai
        .request(app)
        .get("/me")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("error");
          done();
        });
    });
  });

  // =================== CONTACT TESTS ===================
  describe("Contact Routes", () => {
    it("should create a new contact", (done) => {
      chai
        .request(app)
        .post("/")
        .set("Authorization", `Bearer ${token}`)
        .send(testData.contact)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property("data");
          contactId = res.body.data._id;
          done();
        });
    });

    it("should fetch all contacts", (done) => {
      chai
        .request(app)
        .get("/")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("data").that.is.an("array");
          done();
        });
    });

    it("should fetch a contact by ID", (done) => {
      chai
        .request(app)
        .get(`/${contactId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.have.property("_id").eql(contactId);
          done();
        });
    });

    it("should update a contact by ID", (done) => {
      chai
        .request(app)
        .put(`/${contactId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(testData.updatedContact)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.name.should.eql("Jane Doe");
          done();
        });
    });

    it("should delete a contact by ID", (done) => {
      chai
        .request(app)
        .delete(`/${contactId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Contact deleted successfully");
          done();
        });
    });

    it("should return 404 for non-existent contact", (done) => {
      chai
        .request(app)
        .get(`/605c5c5c5c5c5c5c5c5c5c5c`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("error").eql(true);
          done();
        });
    });
  });
});
