import React            from 'react';
import * as ReactRedux  from 'react-redux';

import {
  getChapterText,
  setNextChapter,
  setPreviousChapter,
  saveBookChapter,
  setBookName,
  setChapterText,
  toggleMenu,
  setMenuState,
  deleteSession,
  deleteCookie,
  saveBookLastRead} from '../../reducers';

import {MenuButton} from './MenuButton';
import {FontsizeMenu} from './FontsizeMenu';
import {FonttypeMenu} from './FonttypeMenu';
import {ThemeMenu} from './ThemeMenu';

class MenuUI extends React.Component {
  render() {
    const logout = (e) => {
      e.preventDefault();
      this.props.deleteSession(this.props.username);
      this.props.deleteCookie(this.props.username);
    }

    // Method to open the list of books.
    const backToBooksList = (e) => {
      e.preventDefault();
      this.props.setChapterText('');
      if(this.props.bookName) {
        this.props.saveBookLastRead(this.props.username,null);
        this.props.openOrCloseMenu();
      }
    }

    // Method to get the next chapter and rerender the chapter.
    const nextChapterClickHandler = (e) => {
      e.preventDefault();
      if(this.props.currentChapter < this.props.bookChapters.length){
        this.props.setNextChapter()
          .then(() => {
            this.props.getChapterText(this.props.bookName, this.props.bookChapters[this.props.currentChapter])
            window.scrollTo(0,0);
          })
      }
    }

    //Method to get previous chapter and rerender the chapter
    const previousChapterClickHandler = (e) => {
      e.preventDefault();
      if (this.props.currentChapter > 0){
        this.props.setPreviousChapter()
          .then(() => {
            this.props.getChapterText(this.props.bookName, this.props.bookChapters[this.props.currentChapter])
            window.scrollTo(0,0);
          })
      }
    }

    //Method to open the menu for changing the fontsize
    const openFontsizeSettings = (e) => {
      e.preventDefault();
      this.props.setMenuState('fontSizeMenu');
    }

    //Method to open the menu for changing the fonttype
    const openFonttypeSettings = (e) => {
      e.preventDefault();
      this.props.setMenuState('fontTypeMenu');
    }

    //Method to open the menu for changing the theme
    const openThemeSettings = (e) => {
      e.preventDefault();
      this.props.setMenuState('themeMenu');
    }

    let previousButtonColor = "#116611";
    if(this.props.currentChapter == 0){
      previousButtonColor = "#898989"
    }

    //Method that shows the 'Boekenplank', 'Vorigepagina' and 'Volgendepagina' only when a book is opend
    const buttonsOnlyForInBook = () => {
      if(this.props.bookName){
        return(
          <div>
            <MenuButton backgroundcolor="#0003B2"
                        textcolor="#FFFFFF"
                        textContent="Boekenlijst"
                        compID="booklistButton"
                        clickAction={backToBooksList}/>
            <MenuButton backgroundcolor="#33BB33"
                        textcolor="#FFFFFF"
                        textContent="Volgende pagina"
                        compID="nextPageButton"
                        clickAction={nextChapterClickHandler}/>
            <MenuButton backgroundcolor={previousButtonColor}
                        textcolor="#FFFFFF"
                        textContent="Vorige pagina"
                        compID="previousPageButton"
                        clickAction={previousChapterClickHandler}/>
          </div>
        )
      }
    }

    //Method that shows a list of all menuitems
    const optionsList = () => {
      return(
        <div>
          <MenuButton backgroundcolor="#000000"
                      textcolor="#FFFFFF"
                      textContent="Uitloggen"
                      compID="logOutButton"
                      clickAction={logout}/>
          {buttonsOnlyForInBook()}
          <MenuButton backgroundcolor="#FFA500"
                      textcolor="#FFFFFF"
                      textContent="Lettergrootte"
                      compID="fontSizeButton"
                      clickAction={openFontsizeSettings}/>
          <MenuButton backgroundcolor="#B016B2"
                      textcolor="#FFFFFF"
                      textContent="Lettertype"
                      compID="fontTypeButton"
                      clickAction={openFonttypeSettings}/>
          <MenuButton backgroundcolor="#B2111B"
                      textcolor="#FFFFFF"
                      textContent="Thema"
                      compID="themButton"
                      clickAction={openThemeSettings}/>
        </div>
      )
    }

    //Show the correct menu
    const returnCorrectMenuItem = () => {
      switch (this.props.menuState) {
        case 'fontSizeMenu':{
          return <FontsizeMenu/>
        }
        case 'fontTypeMenu':{
          return <FonttypeMenu/>
        }
        case 'themeMenu':{
          return <ThemeMenu/>
        }
        default:
          return optionsList();
      }
    }

    return (
      <div id="menuSection">
        {returnCorrectMenuItem()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    menuState:                  state.menu.menuState,
    currentChapter:             state.settings.currentChapter,
    bookName:                   state.settings.bookName,
    bookChapters:               state.settings.bookChapters,
    username:                   state.settings.username
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getChapterText:           (bookName, chapter)             => dispatch(getChapterText(bookName, chapter)),
    setNextChapter:           ()                              => dispatch(setNextChapter()),
    setPreviousChapter:       ()                              => dispatch(setPreviousChapter()),
    saveBookChapter:          (username, book, chapter)       => dispatch(saveBookChapter(username, book, chapter)),
    setBookName:              (bookName)                      => dispatch(setBookName(bookName)),
    setChapterText:           (text)                          => dispatch(setChapterText(text)),
    openOrCloseMenu:          ()                              => dispatch(toggleMenu()),
    setMenuState:             (menuState)                     => dispatch(setMenuState(menuState)),
    deleteSession:            (username)                      => dispatch(deleteSession(username)),
    deleteCookie:             (username)                      => dispatch(deleteCookie(username)),
    saveBookLastRead:         (username,book)                 => dispatch(saveBookLastRead(username,book))
  }
}

export const Menu = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(MenuUI);
