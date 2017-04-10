import * as Redux   from 'redux';
import update       from 'immutability-helper';
import * as request from 'superagent';
import actions      from './actions.js'

var host = window.location.hostname;

// Sets the cookie for a user
export const setCookie = (username) => (dispatch) =>{
  let d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie= "username = "+ username +";" +expires;
}

// delete cookie
export const deleteCookie = (username) => (dispatch) =>{
  document.cookie = "username="+username+";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}


// checks if there is a cookie, if they have they will login automaticly
export const getCookie = () => (dispatch) => {
  if(document.cookie.indexOf("username") >= 0){
    let cookieUsername = document.cookie.split('=');
    //alert("hello again " + cookieUsername[1]);
    dispatch(actions.setUsernameAction(cookieUsername[1]));

    request.post(`http://${host}:3000/user/session/${cookieUsername[1]}`)
    .withCredentials()
    .set('application/json')
    .end(function(err,response){
      if(response.body.session == 'set'){
        dispatch(actions.sessionAction());
      }
    })
  }
}
// Save book to user
export const saveBookLastRead = (username, book) => (dispatch) => {
  request
  .post(`http://${host}:3000/user/${username}/book/lastread/${book}`)
  .withCredentials()
  .set('application/json')
  .send({username: username, lastReadBook: book})
  .end(function(err,response){
    if(response.body.book == "ok"){
    } else if (response.body.book == 'empty'){
      dispatch(actions.setBookNameAction(''));
    }
  })
}


// Gets a session if there is one
export const getSession = () => (dispatch) => {
  request
    .get(`http://${host}:3000/user`)
    .withCredentials()
    .set('application/json')
    .end(function(err,response){
      if (response.body.session == 'set'){
        dispatch(actions.setUsernameAction(response.body.username));
        dispatch(actions.sessionAction());
        if(response.body.dropboxToken){
          dispatch(actions.saveAccesskey(response.body.dropboxToken))
        }
      }
    })
}
//delete session
export const deleteSession = (username) => (dispatch) => {
  request
    .delete(`http://${host}:3000/user/session/${username}`)
    .withCredentials()
    .set('application/json')
    .end(function(err,response){
      if(response.body.session == "Closed"){
        dispatch(actions.logoutAction())
      }
    })
}




// Checks if the user exists and goes to the password page
export const getLogin = (username) => (dispatch) => {
  request
    .get(`http://${host}:3000/user/${username}`)
    .withCredentials()
    .set("application/json")
    .end(function(err,response){
      if (err) throw err;
      if(username === "" || response.body.error) {
        showErrorMessage(response.body.errormessage);
      }
      else if (response.body.status == "ok"){
        dispatch(actions.setUsernameAction(response.body.username));
        dispatch(actions.passwordScreenAction());
      }
    })
}

export const setAccessToken = (access_token,username) => (dispatch) => {
  request
    .post(`http://${host}:3000/user/${username}/access_token`)
    .withCredentials()
    .set("application/json")
    .send({access_token: access_token})
    .end(function(err,response){
      if (err) throw err;
      else if(access_token === "" || response.body.error) {
        showErrorMessage(response.body.errormessage);
      }
      else if (response.body.access_token){
        dispatch(actions.setAccesTokenAction(response.body.access_token));
        dispatch(getDropboxBooks());
      }
    })
}

// Set the username in the state
export const setUsername = (username) => (dispatch) => {
  dispatch(actions.setUsernameAction(username));
}

// export const setAccesToken = (access_token) => (dispatch) => {
//   dispatch(actions.setAccesTokenAction(access_token));
// }

// Show the password screen
export const passwordScreen = () => (dispatch) => {
  dispatch(actions.passwordScreenAction());
}

// Set the password in the state
export const setPassword = (password) => (dispatch) => {
  dispatch(actions.setPasswordAction(password));
}

// Empty the password field
export const resetPassword = () => (dispatch) => {
  dispatch(actions.resetPasswordAction());
}

// Get the password
export const getPassword = (username,password) => (dispatch) => {
  return new Promise((resolve, reject) => {
    request.post(`http://${host}:3000/user/${username}/password/${password}`)
    .withCredentials()
    .set("application/json")
    .end((err,response) => {
      if (err) throw err;
      if(response.body.error) {
        showErrorMessage(response.body.errormessage);
        reject(response.body.error);
      }
      else if (response.body.status == "ok"){
        dispatch(actions.bookScreenAction())
        dispatch(getSession());
        resolve(true);
      }
    })
  })
}

// Get filenames of all books
export const getBooks = () => (dispatch) => {
  request
    .get(`http://${host}:3000/book/filenames`)
    .withCredentials()
    .set("Accept","application/json")
    .end((err, response) => {
      if(err) throw err;
      dispatch(actions.getBooksAction(response.body));
    });
}

// Gets the book the user read last
export const getLastBookRead = (username) => (dispatch,getState) => {
  request
  .get(`http://${host}:3000/user/${username}/book/lastread/`)
  .withCredentials()
  .set("application/json")
  .end((err,response) => {
    if (err) throw err;
    if (response.body.book != 'null'){
        dispatch(actions.setBookNameAction(response.body.book));
        dispatch(getToc(response.body.book))
            .then(() =>{
                dispatch(getLastReadChapter(username, response.body.book, getState().settings.bookChapters));
            })
    }
  })
}

// Set the current book name in the state
export const setBookName = (book) => (dispatch) => {
  dispatch(actions.setBookNameAction(book));
}

// Reset the book name in the state
export const resetBook = () => (dispatch) => {
  dispatch(actions.resetBookAction());
}

// Close the book and remember where the user left for the next opening
export const saveBookChapter = (username, book, chapter) => (dispatch) => {
  request
    .post(`http://${host}:3000/user/${username}/book/chapter`)
    .withCredentials()
    .set("Accept","application/json")
    .send({username: username, book: book, chapter: chapter})
    .end((err, response) => {
      if(response.body.error) {
        showErrorMessage(response.body.errormessage);
      }
    });
}

// Gets the last read chapter of the given book and displays that chapter
export const getLastReadChapter = (username, book, bookChapters) => (dispatch) => {
  request
    .get(`http://${host}:3000/user/${username}/book/${book}/chapter`)
    .withCredentials()
    .set("Accept","application/json")
    .end((err, response) => {
      if(response.body.error) {
        showErrorMessage(response.body.errormessage);
      }
      else {
        if(response.body.chapter) {
          let chapterIndex = bookChapters.indexOf(response.body.chapter);
          dispatch(actions.setBookChapterAction(chapterIndex));
          dispatch(getChapterText(book, bookChapters[chapterIndex]))
          // this.props.getChapterText(this.props.fileName, this.props.bookChapters[this.props.currentChapter])
        } else {
          dispatch(actions.resetBookAction());
        }
      }
    });
}

// Get all books with their meta data for the book list
export const getBookList = () => (dispatch,getState) => {
  if(getState().settings.access_token != null){
    request
      .get(`http://${host}:3000/book`)
      .withCredentials()
      .set("Accept","application/json")
      .end((err, response) => {
        if(err) throw err;
        if(response.body.error) {
          showErrorMessage(response.body.errormessage);
        }
        else {
          dispatch(actions.getBookListAction(response.body));
        }
      });
  }
}

// Getter for the toc file
export const getToc = (bookName) => (dispatch) => {
  return new Promise((resolve, reject) => {
    request.get(`http://${host}:3000/book/`+bookName+`/toc`)
      .type('application/json')
      .withCredentials()
      .end(function(err,response){
        if(err) return reject(err);
        if(response.body.error) {
          showErrorMessage(response.body.errormessage);
          reject(response.body.error);
        } else {
          let tocIds =[]
          let ids = JSON.parse(response.text)
          ids.forEach(function (id){
            tocIds.push(id);
          })
          dispatch(actions.getTocAction(tocIds));
          dispatch(actions.setBookNameAction(bookName));
          resolve(true);
        }
      });
  });
}

// Getter for chapter of a book
export const getChapterText = (bookName,chapter) => (dispatch) => {
  request.get(`http://${host}:3000/book/`+bookName+`/chapter/`+chapter)
    .type('application/json')
    .withCredentials()
    .end(function(err, response){
      if(err) return err;
      if(response.body.error) {
       //showErrorMessage(response.body.errormessage);
      } else {
        dispatch(actions.getChapterTextAction(response.body));
      }
    })
}

// Getter for books from dropbox
export const getDropboxBooks = () => (dispatch) => {
  request.get(`http://${host}:3000/book/dropbox`)
  .withCredentials()
  .end(function(err,res){
    if(err){}
    if(res.text == 'done'){
      dispatch(getBooks());
      dispatch(getBookList());
    }
  })
}

export const setChapterText = (text) => (dispatch) => {
  dispatch(actions.setChapterTextAction(text));
}

// Set the next chapter
export const setNextChapter = () => (dispatch) => {
  return dispatch(actions.setNextChapterAction());
}

// Set the previous chapter
export const setPreviousChapter = () => (dispatch) => {
  return dispatch(actions.setPreviousChapterAction());
}

// Show an popup of the image
export const showImagePopup = (imageURL) => (dispatch) => {
  return dispatch(actions.showImagePopupAction(imageURL));
}

// Hide the popup of the image
export const hideImagePopup = () => (dispatch) => {
  return dispatch(actions.hideImagePopupAction());
}

// Set the chapter of a book
export const setBookChapter = (id) => (dispatch) => {
  dispatch(actions.setBookChapterAction(id));
}

// Post books to server
export const uploadBooks = (formData) => (dispatch) => {
  request.post(`http://${host}:3000/upload`)
  .send(formData)
  .end(function(err, response) {
    if(err) throw err;
    if(response.body.Upload) {
      alert('Bestand is geupload!');
    }
  });
}

// Set the settings to the state
export const setSettingState = (settingState) => (dispatch) => {
  dispatch(actions.setSettingStateAction(settingState));
}

//Post fontsize
export  const  postFontSizeSetting  =   (size, username)  =>  (dispatch)  =>  {     
  request         
    .post(`http://${host}:3000/user/${username}/setting/fontsize`)    
    .set("Accept", "application/json")        
    .withCredentials()         
    .send({
      fontSize: size,
    })         
    .end(function(err,  response)  {             
      if  (err)  throw err;          
      if(response.body.error) {
        showErrorMessage(response.body.errormessage);
      } else {
        dispatch(actions.postFontSizeAction(response.body.fontSize));       
      }   
    });
} 

// Set the fontsize bigger
export const setBiggerFontsize = () => (dispatch) => {
  return dispatch(actions.setBiggerFontsizeAction());
}

// Set the fontsize smaller
export const setSmallerFontsize = () => (dispatch) => {
  return dispatch(actions.setSmallerFontsizeAction());
}

//Post fonttype
export  const  postFontTypeSetting  =   (type,username)  =>  (dispatch)  =>  {     
  request         
    .post(`http://${host}:3000/user/${username}/setting/fonttype`)    
    .set("Accept", "application/json")        
    .withCredentials()         
    .send({
      fontType: type,
    })         
    .end(function(err,  response)  {             
      if (err)  throw err;
      if(response.body.error) {
        showErrorMessage(response.body.errormessage);
      } else {
        dispatch(actions.postFontTypeAction(type));
      }   
    });
} 

//Post theme
export  const  postThemeSetting  =   (theme, username)  =>  (dispatch)  =>  {     
  request         
    .post(`http://${host}:3000/user/${username}/setting/theme`)    
    .set("Accept", "application/json")        
    .withCredentials()         
    .send({
      theme: theme,
      username: username
    })         
    .end(function(err, response)  {             
      if (err)  throw err;
      if(response.body.error) {
        showErrorMessage(response.body.errormessage);
      } else {
        dispatch(actions.postThemeAction(response.body.theme));
      }   
    });
} 
// Getter for Settings
export const getSettings = (username) => (dispatch) => {
  request
    .get(`http://${host}:3000/user/${username}/setting`)
    .set("Accept", "application/json")
    .end(function(err, response) {
      if (err) throw err;
      if(response.body.error) {
        showErrorMessage(response.body.errormessage);
      } else {
        let user = response.body.user;
        dispatch(actions.getSettingsForUserAction(user.settings.fontSize, user.settings.fontType, user.settings.theme));
      }   
    });
}

// Displays the error message
const showErrorMessage = (message) => {
    // TODO Maybe use a nice and friendly modal for this instead of an alert?
    alert(message);
}
// Sets the color of the button for remember me
export const setButtonColor = () => (dispatch) => {
  return dispatch(actions.setButtonColorAction());
}
// Sets remember me to true
export const rememberMe = () => (dispatch) => {
  return dispatch(actions.rememberMeAction());
}
// Sets remember me to false
export const stopRememberMe = () => (dispatch) => {
  return dispatch(actions.stopRememberMeAction());
}

export const setAppState = (appState) => (dispatch) => {
  return dispatch(actions.setAppStateAction(appState));
}

// Set the new username in the state
export const setNewUsername = (username) => (dispatch) => {
  dispatch(actions.setNewUsernameAction(username));
}

// Set the new password in the state
export const setNewPassword = (password) => (dispatch) => {
  dispatch(actions.setNewPasswordAction(password));
}

// Checks if the user don't exists
export const checkUsername = (username) => (dispatch) => {
  return new Promise((resolve, reject) => {
  request
    .get(`http://${host}:3000/user/${username}`)
    .withCredentials()
    .set("application/json")
    .end(function(err,response){
      if (err) throw err;
      if (response.body.status == "noUser"){
        dispatch(actions.setNewUsernameAction(response.body.username));
        dispatch(actions.newPasswordScreenAction());
        resolve(true);
      } else if(username === "" || response.body.error) {
          showErrorMessage(response.body.errormessage);
      } else if(response.body.status === "ok") {
        showErrorMessage(response.body.errormessage);
      }
    })
  })
}

//Post username and password
export const postNewUser = (username, password) => (dispatch) => {
  return new Promise((resolve, reject) => {
    request
      .post(`http://${host}:3000/user/${username}`)
      .withCredentials()
      .set("Accept","application/json")
      .send({
        username: username,
        password: password
      })
      .end(function(err, response)  {  
        if (err) throw err;
        if(password == "") {
          showErrorMessage(response.body.errormessage);
        } else {
          dispatch(getPassword(username, password));
          resolve(true);
        } 
      });
    })
  }

const initialSettingItems = {
    theme:              "",
    backgroundColor:    "white",
    fontColor:          "black",
    fontSize:           18,
    fontType:           "Arial",
    books:              [],
    bookList:           [],
    bookName:           "",
    bookChapters:       [],
    currentChapter:     0,
    chapterText:        "",
    username:           "",
    password:           "",
    loginscreen:        true,
    passwordscreen:     false,
    bookScreen:         false,
    registrationPasswordscreen: false,
    appState:           "",
    settingState:       "Header",
    imgPopupURL:        null,
    remember:           false,
    checked:            "onthoud onthoudbutton col-md-2 unchecked",
    access_token:       null
}

function settingsReducer(state = initialSettingItems, action) {
    switch (action.type) {
      case "setButtonColorAction": {
        return update(state, {checked: {$set : action.color}})
      }
      case "rememberMeAction": {
        return update(state, {remember: {$set: true}})
      }
      case "stopRememberMeAction": {
        return update(state, {remember: {$set: false}})
      }
      case 'setBackgroundColorAction': {
          return update(state, {backgroundColor: {$set: action.color}})
      }
      case 'passwordScreenAction' : {
        return update(state, {loginscreen : {$set : false}, passwordscreen : {$set: true}})
      }
      case 'bookScreenAction' : {
        return update(state, {passwordscreen : {$set: false}, bookScreen: {$set:true}})
      }
      case 'sessionAction' : {
        return update(state, {loginscreen: {$set: false}, bookScreen: {$set:true}})
      }
      case 'logoutAction': {
        return update(state, {$set: initialSettingItems})
      }
      case 'setUsernameAction' : {
        return update(state, {username: {$set: action.username}})
      }
      case 'setPasswordAction' : {
        return update(state, {password: {$set: action.password}})
      }
      case 'setFontSizeAction' : {
        return update(state, {fontSize: {$set: action.size }})
      }
      case 'setAccesTokenAction' : {
        return update(state, {access_token: {$set: action.access_token }})
      }
      case 'getChapterTextAction' : {
        return update(state, {chapterText: {$set: action.text}})
      }
      case 'setChapterTextAction' : {
        return update(state, {chapterText: {$set: action.text}})
      }
      case 'getTocAction' : {
        return update(state, {bookChapters: {$set: action.bookChapters}})
      }
      case 'setBookNameAction' : {
        return update(state, {bookName: {$set: action.bookname}})
      }
      case 'setNextChapterAction' : {
        return update(state, {currentChapter: {$set: action.chapter}})
      }
      case 'setPreviousChapterAction' : {
        return update(state, {currentChapter: {$set: action.chapter}})
      }
      case 'setThemeAction': {
        return update(state, {
          fontColor:        {$set: action.fontColor},
          backgroundColor:  {$set: action.backgroundColor}
        })
      }
      case 'postThemeAction': {
        return update(state, {theme: {$set: action.theme}})
      }
      case 'postFontSizeAction': {
        return update(state, {fontSize: {$set: action.size}})
      }
      case 'postFontTypeAction': {
        return update(state, {fontType: {$set: action.ftype}})
      }
      case 'getSettingsForUserAction': {
        return update(state, {
          fontSize: {$set: action.size},
          fontType: {$set: action.ftype},
          theme:    {$set: action.theme}
        })
      }
      case 'getBooksAction': {
        return update(state, {books: {$set: action.books}})
      }
      case 'getBookListAction': {
        return update(state, {bookList: {$set: action.bookList}})
      }
      case 'setBookAction': {
        return update(state, {book: {$set: action.book}})
      }
      case 'resetPasswordAction': {
        return update(state, {password: {$set:""}})
      }
      case 'resetBookAction': {
        return update(state, {currentChapter: {$set: 0}})
      }
      case 'setBookChapterAction': {
        return update(state, {currentChapter: {$set: action.id}})
      }
      case 'setSettingStateAction': {
        return update(state, {settingState: {$set: action.settingState}})
      }
      case 'setBiggerFontsizeAction': {
        return update(state, {fontSize: {$set: action.fontSize}})
      }
      case 'setSmallerFontsizeAction': {
        return update(state, {fontSize: {$set: action.fontSize}})
      }
      case 'openImagePopup': {
        return update(state, {imgPopupURL: {$set: action.imageURL}})
      }
      case 'closeImagePopup': {
        return update(state, {imgPopupURL: {$set: null}})
      }
      case 'setAppStateAction': {
        return update(state, {loginscreen : {$set : false}, appState: {$set: action.appState}})
      }
      case 'setNewUsernameAction' : {
        return update(state, {username: {$set: action.username}})
      }
      case 'setNewPasswordAction' : {
        return update(state, {username: {$set: action.password}})
      }
      case 'newPasswordScreenAction' : {
        return update(state, {loginscreen : {$set : false}, registrationPasswordscreen : {$set: true}, appState: {$set: ""}})
      }
      default:
        return state;
  }
}

export const toggleMenu = () => (dispatch,getState) => {
  return dispatch(actions.toggleMenuAction(getState().menu.menuOpen))
}

export const setMenuState = (toSetState) => (dispatch) => {
  return dispatch(actions.setMenuStateAction(toSetState))
}

const initialMenuState = {
  menuOpen: false,
  menuState: 'itemList'
}

function menuReducer(state = initialMenuState, action){
  switch (action.type) {
    case "openMenu":{
      return update(state, {menuOpen: {$set: true}});
    }
    case "closeMenu":{
      return update(state, {menuOpen: {$set: false}, menuState: {$set: 'itemList'}});
    }
    case "setMenuState":{
      return update(state, {menuState: {$set: action.state}});
    }
    case 'logoutAction': {
      return update(state, {$set: initialMenuState})
    }
    default:
      return state;
  }
}

export const mainReducer = Redux.combineReducers({
  settings: settingsReducer,
  menu: menuReducer
});
