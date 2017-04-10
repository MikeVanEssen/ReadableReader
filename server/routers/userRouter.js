const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');
const assert = require('assert');

const userRouter      = express.Router();

// MODAL
//Settings (fontType, fontSize, theme)
const User = require('../modals/users.js');

// mongoose connection
const dbName = 'Readable_Reader';
mongoose.connect('mongodb://localhost/' + dbName);


//check if there is a session
userRouter.get('/', (req,res) => {

  if(req.session.uniqueID){
    if(req.session.accessKey){
      res.json({session : 'set', username: req.session.uniqueID, dropboxToken: req.session.accessKey});
    }else{
      res.json({session : 'set', username: req.session.uniqueID});
    }
  } else {
    res.json({session: 'not set'})
  }
})

//set session with cookie
userRouter.post('/session/:username', (req,res) =>{

    req.session.uniqueID = req.params.username;
    req.session.accessKey = 'gennep is geweldig';


if(req.session.uniqueID){
  res.json({session: "set"})
}

})
// delete session
userRouter.delete('/session/:username', (req,res) =>{
  if(req.session.uniqueID){
    req.session.destroy(function(err) {
      if(err){
        res.json({session : "No session"})
      }else {
        res.json({session : "Closed"})
      }

    });
  }
;})


//SETTING API 1: Get all settings from a user
userRouter.get('/:username/setting', (req,res) => {
  User.findOne({username: req.params.username}, (err, user) => {
    if(err) {
      res.json({
        error: 2002,
        errormessage: "couldn't get user from database"
      });
    } else {
      res.json({user:user});
    }
  })
})

//Checks if there is a user
userRouter.get('/:username', (req,res) => {
  if(req.params.username == ""){
    res.json({
      error: 2002,
      errormessage: "couldn't get user from database"
    });
  }
  User.count({username: req.params.username}, (err,count) => {
    if(err || count == 0){
      res.json({
        error: 2002,
        errormessage: "couldn't get user from database",
        status: "noUser", username: req.params.username
      });
    }
    else if(count !== 0){
    res.json({status: "ok", username: req.params.username});
  }
  });
});

userRouter.post('/:username', (req,res) => {

  if(req.body.username) {
    User.count({username: req.body.username}, function(err,count) {
      if(err) throw err;
      if(count == 0) {

        var newUser = User({
          username: req.body.username,
          password: req.body.password,
        });

        newUser.save(function(err,req) {
          if (err) {
            res.json({error: err})
          }else{
            res.json({ok: 'ok'})
          }
        })
      }
    })
  } else {
    res.json({
      error: 2002,
      errormessage: "couldn't get user from database"
    });
  }
})

// Checks username and password
userRouter.post('/:username/password/:password', (req,res) => {

  if (req.params.password == ""){
    res.json({
      error: 2002,
      errormessage: "couldn't get user from database",
      status: "noPassword"
    });
  }
  User.find({username: req.params.username, password: req.params.password}, (err,users) => {
    let count = users.length;
    if(err || count == 0 || req.params.password === ""){
      res.json({
        error: 2002,
        errormessage: "couldn't get user from database"
      });
    }
    else if(count !== 0 && req.params.password !== ""){
      req.session.uniqueID = req.params.username;
      if(users[0].access_token){
        req.session.accessKey = users[0].access_token;
      }
      res.json({status: "ok"});
    }
  })
})

//Saves access token
userRouter.post('/:username/access_token',(req, res) => {
  User.findOneAndUpdate({username: req.params.username},
                          {"access_token": req.body.access_token},
                          {new: true},
                          (err, user) => {
                            if(err){
                              res.json({
                                error: 2001,
                                errormessage: "couldn't post data to database"
                              });
                            }else{
                              req.session.accessKey = req.body.access_token;
                              res.json({
                              access_token: user.access_token
                              });
                            }
                          }
    );
})

//SETTING API 2: Safe the fontsize setting
userRouter.post('/:username/setting/fontsize', (req,res) => {

    User.findOneAndUpdate({username: req.params.username},
                          {"settings.fontSize": req.body.fontSize},
                          {new: true},
                          (err, user) => {
                            if(err){
                              res.json({
                                error: 2001,
                                errormessage: "couldn't post data to database"
                              });
                            }else{
                              res.json({
                                fontSize: user.settings.fontSize
                              });
                            }
                          }
    );
});

//SETTING API 3: Safe the fonttype setting
userRouter.post('/:username/setting/fonttype', (req,res) => {
  if(isNaN(req.body.fontType)) {
    User.findOneAndUpdate({username: req.params.username},
                          {"settings.fontType": req.body.fontType},
                          {new: true},
                          (err, user) => {
                            if(err){
                              res.json({
                                error: 2001,
                                errormessage: "couldn't post data to database"
                              });
                            } else {
                              res.json({
                                fontType: user.settings.fontType
                              });
                            }
                          }
    );
  } else {
    res.json({
      error: 2001,
      errormessage: "couldn't post data to database"
    });
  }
});

//SETTING API 4: Safe the theme setting
userRouter.post('/:username/setting/theme', (req,res) => {
  if(isNaN(req.body.theme)) {
    User.findOneAndUpdate({username: req.params.username},
                          {"settings.theme": req.body.theme},
                          {new: true},
                          (err, user) => {
                            if(err){
                              res.json({
                                error: 2001,
                                errormessage: "couldn't post data to database"
                              });
                            } else {
                              res.json({
                                theme: user.settings.theme
                              });
                            }
                          }
    );
  } else {
    res.json({
      error: 2001,
      errormessage: "couldn't post data to database"
    });
  }
});

// SETTING API 5: Safe chapter of the book I was reading
userRouter.post('/:username/book/chapter', (req,res) => {

  User.count({username: req.params.username, 'books.book': req.body.book}, (err, count) => {
    if(count > 0) {
      User.findOneAndUpdate({username: req.params.username ,'books.book': req.body.book},
                            {$set: {'books.$.lastReadChapter': req.body.chapter}},
                            {new: true},
                            (err, user) => {
                              if(err) {
                                res.json({
                                  error: 2001,
                                  errormessage: "couldn't post data to database"
                                });
                              }
                              else {
                                res.json({user});
                              }
                            }
      );
    } else {
      User.findOneAndUpdate({username: req.params.username},
                            {$push: {books: {
                              book: req.body.book,
                              lastReadChapter: req.body.chapter
                            }}},
                            {new: true},
                            (err, user) => {
                              if(err) {
                                res.json({
                                  error: 2001,
                                  errormessage: "couldn't post data to database"
                                });
                              } else {
                                res.json({user});
                              }
                            }
      );
    }
  });
});

// Returns a chapter if the user has started reading the book before
userRouter.get('/:username/book/:book/chapter', (req,res) => {
  User.findOne({username: req.params.username, 'books.book': req.params.book}, (err, user) => {
    if(err) throw err;
    else {
      if(user) {
        book = _.find(user.books, (obj) => { return obj.book == req.params.book })
        res.json({chapter: book.lastReadChapter});
      } else {
        res.json({chapter: null});
      }
    }
  });
});

//sets last read book
userRouter.post('/:username/book/lastread/:book',(req,res) =>{

  User.findOneAndUpdate({username: req.params.username}, {lastReadBook: req.params.book}, (err,user) =>{
    if (err) throw err;
    if (req.params.book == "null"){
    res.json({book: 'empty'})
    }else {
      res.json({book: 'ok'})
    }
  })
})

// get last read book

userRouter.get('/:username/book/lastread/',(req,res)=>{
  User.findOne({username: req.params.username},(err,user) =>{
    if (err) throw err;

    res.json({book: user.lastReadBook})
  })
})

// Make a settingcollection for the first time
function fillSettingCollection() {
    User.find({}, function(err, result) {
        if (err) throw err;
        if (result.length == 0) {
            var user = new User({
              username:"test",
              password:"0000",
              lastReadBook:"null",
              settings:{
                fontSize:18,
                fontType:"Arial",
                theme:"ThemeColorBlackWhite"
              },
              access_token: "WG5Vz0IXd1AAAAAAAAAAyJ_UvF4ZxA5dIMQLgB1yqOodTFaOOp6V5nQgesgrCWFb"
            });
            user.save(function(err) {
                if (err) console.log(err);
                else console.log('Saved test user');
            });
        }
    });
}

fillSettingCollection();
module.exports = userRouter;
