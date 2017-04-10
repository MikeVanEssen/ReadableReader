const actions = {
  // Action Creators
  setThemeAction(fontColor, backgroundColor) {
      return { type: "setThemeAction",
               fontColor,
               backgroundColor
      }
  },
  postThemeAction(theme) {
      return { type: "postThemeAction",
               theme
      }
  },
  postFontSizeAction(size) {
      return { type: "postFontSizeAction",
               size
      }
  },
  setSmallerFontsizeAction() {
    return (dispatch, getState) => {
      let fontSize = getState().settings.fontSize - 1;
      return new Promise((resolve, reject) => {
        dispatch({type: "setSmallerFontsizeAction", fontSize});
        resolve(true)
      })
    }
  },
  setBiggerFontsizeAction() {
    return (dispatch, getState) => {
      let fontSize = getState().settings.fontSize + 1;
      return new Promise((resolve, reject) => {
        dispatch({type: "setBiggerFontsizeAction", fontSize});
        resolve(true)
      })
    }
  },
  getChapterTextAction(text){
    return { type:"getChapterTextAction",
             text
    }
  },
  setChapterTextAction(text){
    return { type:"getChapterTextAction",
             text
    }
  },
  setNextChapterAction(){
      return(dispatch,getState) => {
          let chapter = getState().settings.currentChapter + 1;
          return new Promise((resolve, reject) => {
          //getChapterText(getState().settings.bookName, getState().settings.bookChapters[chapter])
          dispatch({type:"setNextChapterAction", chapter});
          resolve(true)
        })
      }
  },
  setPreviousChapterAction(){
      return(dispatch,getState) => {
          let chapter = getState().settings.currentChapter - 1;
          return new Promise((resolve, reject) => {
          //getChapterText(getState().settings.bookName, getState().settings.bookChapters[chapter])
          dispatch({type:"setPreviousChapterAction",chapter});
          resolve(true)
          })
      }
  },
  resetBookAction(){
    return{ type:"resetBookAction"}
  },
  resetPasswordAction(){
    return{ type:'resetPasswordAction'}
  },
  getTocAction(bookChapters){
    return { type:"getTocAction",
             bookChapters
    }
  },
  setBookNameAction(bookname){
      return { type:"setBookNameAction",
               bookname
      }
  },
  postFontTypeAction(ftype) {
    return { type: "postFontTypeAction",
             ftype
    }
  },
  // Books
  getBooksAction(books) {
      return { type: 'getBooksAction',
               books
      }
  },
  getBookListAction(bookList) {
    return {
      type: "getBookListAction",
      bookList
    }
  },
  setBookAction(book) {
      return { type: "setBookAction",
               book
      }
  },
  getSettingsForUserAction(size, ftype, theme, access_token) {
      return { type: "getSettingsForUserAction",
               size,
               ftype,
               theme
      }
  },
  setBookChapterAction(id){
    return { type:"setBookChapterAction",
             id
      }
  },
  setUsernameAction(username){
    return { type:"setUsernameAction",
             username
           }
  },
  setPasswordAction(password){
    return {type: "setPasswordAction",
            password
            }
  },
  setAccesTokenAction(access_token){
    return { type:"setAccesTokenAction",
             access_token
           }
  },
  passwordScreenAction(){
    return {type: 'passwordScreenAction'}
  },
  bookScreenAction(){
    return {type: 'bookScreenAction'}
  },
  sessionAction(){
    return {type: 'sessionAction'}
  },
  logoutAction(){
    return {type: 'logoutAction'}
  },
  setSettingStateAction(settingState) {
    return { type: "setSettingStateAction", settingState }
  },
  showImagePopupAction(imageURL){
    return {type:"openImagePopup", imageURL}
  },
  hideImagePopupAction(){
    return {type:"closeImagePopup"}
  },
  setButtonColorAction(){
    return (dispatch,getState) => {
      let color;
      if(getState().settings.remember == true){
        color = "onthoud onthoudbutton col-md-2 checked"
      } else {
        color = "onthoud onthoudbutton col-md-2 unchecked"
      }
      dispatch({type : "setButtonColorAction", color})
    }
  },
  rememberMeAction(){
    return {type:"rememberMeAction"}
  },
  stopRememberMeAction(){
    return {type: "stopRememberMeAction"}
  },
  setAppStateAction(appState){
    return { type: "setAppStateAction", appState }
  },
  setNewUsernameAction(username){
    return { type: "setNewUsernameAction", username }
  },
  newPasswordScreenAction(){
    return { type: "newPasswordScreenAction"}
  },
  toggleMenuAction(currentState){
    if(currentState == false){
      return {type: "openMenu"}
    }else{
      return {type: "closeMenu"}
    }
  },
  setMenuStateAction(state){
    return {type: "setMenuState", state}
  },
  saveAccesskey(access_token){
    return {type: "setAccesTokenAction", access_token}
  }
}

export default actions;
