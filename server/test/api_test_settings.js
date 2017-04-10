const expect = require("chai").expect;
const superagent = require("superagent");

const siteURL = "http://localhost:3000";

const testUser = "test";

describe("tests API's for settings.", function() {

  describe("Get the settings from a user", function() {
    it("Returns all settings from the user", function(done) {
      superagent
        .get(`${siteURL}/user/${testUser}/setting`)
        .withCredentials()
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.not.be.null;
          expect(res.body.user.username).to.equal('test');
          done();
        })
    }); // end it get all settings
  }); // end describe get settings

  describe("Succesfully post correct settings", function() {
    it("Sets the font size", function(done) {
      superagent
        .post(`${siteURL}/user/${testUser}/setting/fontsize`)
        .withCredentials()
        .send({
          fontSize: 25
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.fontSize).to.not.be.null;
          done();
        })
    }); // end it post fontsize

    it("Sets the font family", function(done) {
      superagent
        .post(`${siteURL}/user/${testUser}/setting/fonttype`)
        .withCredentials()
        .send({
          fontType: "Verdana"
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.fontType).to.not.be.null;
          done();
        })
    }); // end it post fonttype

    it("Sets the theme", function(done) {
      superagent
        .post(`${siteURL}/user/${testUser}/setting/theme`)
        .withCredentials()
        .send({
          theme: "ThemeColorBlackWhite"
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.theme).to.not.be.null;
          done();
        })
    }); // end it post theme
  }); // end describe post settings

  describe("Fail to post incorrect settings", function() {
    it("Fails to post a string as a font size", function(done) {
      superagent
        .post(`${siteURL}/user/${testUser}/setting/fontsize`)
        .withCredentials()
        .send({
          fontSize: "blablabla"
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(2001);
          expect(res.body.errormessage).to.be.equal("couldn't post data to database");
          done();
        })
    }); // end it post fontSize
    it("Fails to post a number as a font family", function(done) {
      superagent
        .post(`${siteURL}/user/${testUser}/setting/fonttype`)
        .withCredentials()
        .send({
          fontType: 12345
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(2001);
          expect(res.body.errormessage).to.be.equal("couldn't post data to database");
          done();
        })
    }); // end it post font family
    it("Fails to post a number as a theme", function(done) {
      superagent
        .post(`${siteURL}/user/${testUser}/setting/theme`)
        .withCredentials()
        .send({
          theme: 12345
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(2001);
          expect(res.body.errormessage).to.be.equal("couldn't post data to database");
          done();
        })
    }); // end it post font type
  }); // end describe post settings
});
