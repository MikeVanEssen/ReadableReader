const expect = require("chai").expect;
const superagent = require("superagent");

const siteURL = "http://localhost:3000/";

const newUser = "NieuweGebruiker01";


describe("tests API's for Register.", function() {

  it("saves an new user", function(done){
    superagent
      .post(`${siteURL}user/${newUser}`)
      .withCredentials()
      .send({
        username: 'jeroen',
        password: 1234
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.username, res.password).to.not.be.null;
        done();
      })
  })

  it("saves an new user without username", function(done){
    superagent
      .post(`${siteURL}user/${newUser}`)
      .withCredentials()
      .send({
        password: 1234
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an("object");
        expect(res.body.error).to.be.equal(2002);
        done();
      })
  })
})
