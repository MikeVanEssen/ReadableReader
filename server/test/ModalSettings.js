var expect = require('chai').expect;
var mongoose = require('mongoose');
var User = require('../modals/users.js');

// mongoose connection
const dbName = 'Readable_Reader';
mongoose.connect('mongodb://localhost/' + dbName);

describe("MODALS", function() {
  describe('User', function() {
    it('should create a unique user', function(done) {
      let testUser = `testUser${Math.floor((Math.random() * 100) + 1)}`;
      let user = new User({
        username: testUser,
        password: '1234'
      });

      user.save((err) => {
        expect(err).to.be.null;
        User.findOne({username: testUser}, (err, user) => {
          expect(user.username).to.exist;
          expect(user.username).to.equal(testUser);
          done();
        });
      });
    });

    it('should not be able to create an user without a username', function(done) {
      let user = new User({
        password: '1234'
      });

      let error = user.validateSync();
      expect(error.errors['username'].message).to.equal('Username required');
      done();
    });

    it('should not be able to create an user without a password', function(done) {
      let user = new User({
        username: 'test'
      });

      let error = user.validateSync();
      expect(error.errors['password'].message).to.equal('Password required');
      done();
    });
});

  afterEach(function(done) {
    mongoose.disconnect(function() {
      done();
    });
  });
});
