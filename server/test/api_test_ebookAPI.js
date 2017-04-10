const expect          = require("chai").expect;
const superagent      = require("superagent");

const siteURL         = "http://localhost:3000/";

describe("Test API's for the epub files.", function(){
  before(function(){
    console.log("For the success of the tests, it is required that test.epub and test2.epub are copied in the book directory");
  });

  describe("Get a list of all books", function(){
    it("Returns a list of all booksfiles.", function(done){
      superagent
        .get(`${siteURL}book/`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          done();
        })
    });

    it("Returns a array of all filenames.", function(done){
      superagent
        .get(`${siteURL}book/filenames`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("array");
          done();
        })
    });
  });

  describe("Get the cover from a specific book.", function(){
    it("Returns a coverimage", function(done){
      superagent
        .get(`${siteURL}book/test.epub/cover`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.not.be.null;
          done();
        })
    });

    it("Returns a cover not found error when de cover from a book isn't found.", function(done){
      superagent
        .get(`${siteURL}book/test_no_cover.epub/cover`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(1005);
          expect(res.body.errormessage).to.be.equal("cover not found");
          done();
        })
    });

    it("Returns a book not found error when the epub-file isn't found.", function(done){
      superagent
        .get(`${siteURL}book/test3.epub/cover`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(1001);
          expect(res.body.errormessage).to.be.equal("book not found");
          done();
        })
    });
  });

  describe("Get the toc from a specific book.", function(){
    it("Returns an array with page ID's.", function(done){
      superagent
        .get(`${siteURL}book/test.epub/toc`)
        .withCredentials()
        .end((err,res) => {
          let toc = res.body;
          expect(err).to.be.null;
          expect(toc).to.be.an("array");
          expect(toc).to.have.length.of.at.least(1);
          toc.map(tocItem => {
            expect(tocItem).to.not.be.an("array");
            expect(tocItem).to.not.be.an("object");
          });
          done();
        })
    });

    it("Returns a book not found error when the epub-file isn't found.", function(done){
      superagent
        .get(`${siteURL}book/test3.epub/toc`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(1001);
          expect(res.body.errormessage).to.be.equal("book not found");
          done();
        })
    });
  });

  describe("Get a chapter from a book.", function(){
    it("Returns an object", function(done){
      superagent
        .get(`${siteURL}book/test.epub/chapter/chapter02`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("string");
          done();
        })
    });

    it("Returns a chapter not found error when the chapter isn't found.", function(done){
      superagent
        .get(`${siteURL}book/test.epub/chapter/chapter0000000000`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(1002);
          expect(res.body.errormessage).to.be.equal("chapter not found");
          done();
        })
    });

    it("Returns a book not found error when the epub-file isn't found.", function(done){
      superagent
        .get(`${siteURL}book/test3.epub/chapter/chapter02`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(1001);
          expect(res.body.errormessage).to.be.equal("book not found");
          done();
        })
    });
  });

  describe("Get a image from a book.", function(){
    it("Returns a image", function(done){
      superagent
        .get(`${siteURL}book/test.epub/image/item30`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.not.be.null;
          done();
        })
    });

    it("Returns a image not found error when de image isn't found.", function(done){
      superagent
        .get(`${siteURL}book/test.epub/image/item`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(1003);
          expect(res.body.errormessage).to.be.equal("image not found");
          done();
        })
    });

    it("Returns a book not found error when the epub-file isn't found.", function(done){
      superagent
        .get(`${siteURL}book/test3.epub/image/item30`)
        .withCredentials()
        .end((err,res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be.equal(1001);
          expect(res.body.errormessage).to.be.equal("book not found");
          done();
        })
    });
  });
})
