const expect = require("chai").expect;
const superagent = require("superagent");

const siteURL = "http://localhost:3000/";


describe("tests API's for login.", function() {

    describe("Username is availible", function(){
      it("returns the user bam", function(done) {
        superagent
          .get(`${siteURL}user/bam`)
          .withCredentials()
          .end((err,res) => {
            expect(err).to.be.null;
            expect(res.body.status).to.be.equal("ok");
            expect(res.body.username).to.be.equal("bam");
            done();
          })
      })
    })

    describe("Username is unavailible",function(){
      it("returns an error because name is not availible", function(done){
        superagent
        .get(`${siteURL}user/WrongUser`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(2002);
          expect(res.body.errormessage).to.be.equal("couldn't get user from database");
          done();
        })
      })
    })

    describe("Login successfull",function(){
      it("login bam successful",function(done){
        superagent
        .post(`${siteURL}user/bam/password/1337`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body.status).to.be.equal("ok")
          done();
        })
      })

      it("session should be set",function(done){
        superagent
        .get(`${siteURL}user`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null
          expect(res.body.session).to.be.equal("not set")
          done();
        })
      })

    })

    describe("Login failed",function(){
      it("login bam failed",function(done){
        superagent
        .post(`${siteURL}user/bam/password/wrongpassword`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(2002);
          expect(res.body.errormessage).to.be.equal("couldn't get user from database");
          done();
        })
      })
    })



})
