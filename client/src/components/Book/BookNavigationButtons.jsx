import React from 'react';
import * as ReactRedux from 'react-redux';

import {MenuButton} from '../Settings/MenuButton';

import {
  getChapterText,
  setNextChapter,
  setPreviousChapter,
  saveBookChapter} from '../../reducers';

/**
  Navigation buttons for the book content
*/
export class BookNavigationButtonsUI extends React.Component {
  render(){
    // Method to get the next chapter and rerender the chapter.
    const nextClickHandler = (e) => {
      e.preventDefault();
      if(this.props.currentChapter < this.props.bookChapters.length){
        this.props.setNextChapter()
          .then(() => {
            this.props.getChapterText(this.props.bookName, this.props.bookChapters[this.props.currentChapter])
            window.scrollTo(0,0);
            this.props.saveBookChapter(this.props.username, this.props.bookName, this.props.bookChapters[this.props.currentChapter]);
          })
      }
    }

    //Method to get previous chapter and rerender the chapter
    const previousClickHandler = (e) => {
      e.preventDefault();
      if (this.props.currentChapter > 0){
        this.props.setPreviousChapter()
          .then(() => {
            this.props.getChapterText(this.props.bookName, this.props.bookChapters[this.props.currentChapter])
            window.scrollTo(0,0);
            this.props.saveBookChapter(this.props.username, this.props.bookName, this.props.bookChapters[this.props.currentChapter]);
          })
      }
    }

    // Enables the 'previous' button only when a previous page/chapter is available
    let previousDisabled = "";
    if(!this.props.currentChapter > 0) {
      previousDisabled = "disabled";
    }

    // Enables the 'next' button only when a next page/chapter is available
    let nextDisabled = "";
    if(!this.props.bookChapters[this.props.currentChapter + 1]) {
      nextDisabled = "disabled";
    }

    let previousButtonColor = "#116611";
    if(this.props.currentChapter == 0){
      previousButtonColor = "#898989"
    }

    return(
      <div className="pageChangeButtonContainer">
        <div id="previousButton" className="pageChangeButton"
             style={{backgroundColor: "#116611"}}
             onClick={previousClickHandler}>
          Vorige pagina
        </div>
        <div id="nextButton" className="pageChangeButton"
             style={{backgroundColor: "#33BB33"}}
             onClick={nextClickHandler}>
          Volgende pagina
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    fontSize:           state.settings.fontSize,
    currentChapter:     state.settings.currentChapter,
    bookName:           state.settings.bookName,
    bookChapters:       state.settings.bookChapters,
    chapterText:        state.settings.chapterText,
    username:           state.settings.username
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getChapterText:             (bookName, chapter) => dispatch(getChapterText(bookName, chapter)),
    setNextChapter:             ()                  => dispatch(setNextChapter()),
    setPreviousChapter:         ()                  => dispatch(setPreviousChapter()),
    saveBookChapter:       (username, book, chapter)  => dispatch(saveBookChapter(username, book, chapter))
  }
}

export const BookNavigationButtons = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(BookNavigationButtonsUI);
