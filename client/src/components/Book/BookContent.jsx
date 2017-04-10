import React from 'react';
import * as ReactRedux from 'react-redux';

import {ChapterSelect} from './Chapter';
import {BookNavigationButtons} from './BookNavigationButtons';

import {getChapterText,
        getToc,
        setNextChapter,
        setPreviousChapter} from '../../reducers'



/**
  Will display the content of a book
*/
export class BookContentUI extends React.Component {
  render() {
    // Get the content of the new chapter and scroll to the top
    const openChapter = () => {
      this.props.getChapterText(this.props.bookName, this.props.bookChapters[this.props.currentChapter])
      window.scrollTo(0,0);
    }

    //Font: Size, Color, Type
    const cssClass = "container-fluid " + this.props.theme + " " + this.props.fontType;



    let tapStartX;
    let tapCurrentX;

    // Safe the position where the user touches the screen
    const touchStartHandler = (e) => {
      tapStartX = e.touches[0].pageX;
      tapCurrentX = e.touches[0].pageX;
    }

    // Safe position where the user moved finger to
    const touchMoveHandler = (e) => {
      tapCurrentX = e.touches[0].pageX;
    }

    // Check if user made a swipe to go to the next chapter
    const touchEndHandler = (e) => {
      let change = tapCurrentX-tapStartX;
      if(change >= 200){
        if (this.props.currentChapter > 0){
          this.props.setPreviousChapter()
            .then(() => {
              openChapter();
            })
        }else{
          alert('Het begin van het boek is bereikt.');
        }
      }else if(change <= -200){
        if(this.props.bookChapters[this.props.currentChapter + 1]){
          this.props.setNextChapter()
            .then(() => {
              openChapter();
            })
        }else{
          alert('Het einde van het boek is bereikt.');
        }
      }
    }

    let bookContent;
    if(!this.props.bookName) {
      bookContent = <h1 className="text-center">Geen boek geselecteerd</h1>
    } else {
      bookContent = (
        <div id="book-content"
             className={cssClass}
             style={{fontSize: this.props.fontSize + "px"}}
             onTouchStart={touchStartHandler}
             onTouchEnd={touchEndHandler}
             onTouchMove={touchMoveHandler}
          >
          <BookNavigationButtons />
          <ChapterSelect />
          <BookNavigationButtons/>

        </div>
      )
    }

    return (bookContent)
  }
}

function mapStateToProps(state) {
  return {
    currentChapter:     state.settings.currentChapter,
    bookName:           state.settings.bookName,
    bookChapters:       state.settings.bookChapters,
    chapterText:        state.settings.chapterText,
    theme:              state.settings.theme,
    fontSize:           state.settings.fontSize,
    fontType:           state.settings.fontType
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getToc:                     (bookName)          => dispatch(getToc(bookName)),
    getChapterText:             (bookName, chapter) => dispatch(getChapterText(bookName, chapter)),
    setNextChapter:             ()                  => dispatch(setNextChapter()),
    setPreviousChapter:         ()                  => dispatch(setPreviousChapter())
  }
}

export const BookContent = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(BookContentUI);
