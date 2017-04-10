var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: [true, 'Username must be unique'],
    required: [true, 'Username required']
  },
  password: {
    type: String,
    required: [true, 'Password required']
  },
  lastReadBook: {
    type: String,
    default:  "null"
  },
  access_token: {
    type: String,
    required: false
  },
  settings: {
    fontSize: {
      type: Number,
      required: false,
      default: 18
    },
    fontType: {
      type: String,
      required: false,
      default:  "Arial"
    },
    theme: {
      type: String,
      required: false,
      default: "ThemeColorBlackWhite"
    }
  },
  books: [{
    book: {
      type: String,
      required: false
    },
    lastReadChapter: {
      type: String,
      required: false
    }
  }]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
