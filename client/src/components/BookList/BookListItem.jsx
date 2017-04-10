import React            from 'react';
import * as ReactRedux  from 'react-redux';
import * as request from 'superagent';
import ImageLoader from 'react-imageloader';

import {getToc,
        getChapterText,
        getLastReadChapter,
        renderBook,
        saveBookLastRead}     from '../../reducers'

/**
  Displays a single book item for the book list
*/
export class BookListItemUI extends React.Component {

  render() {
    let linkToImage = `http://${window.location.hostname}:3000/book/${this.props.fileName}/cover`;
    linkToImage = linkToImage.replace(/' '/g, '%20'); // replace spaces in file name for a correct link

    // Opens book
    const onClickHandler = () => {
      this.props.getToc(this.props.fileName)
        .then(() => {
          this.props.getLastReadChapter(this.props.username, this.props.fileName, this.props.bookChapters);
          this.props.saveBookLastRead(this.props.username, this.props.fileName);
        })
    }

    // CSS class with user selected theme
    const cssClass = "list-group-item row " + this.props.theme + " " + this.props.fontType;

    return (
      <span href="#" onClick={onClickHandler} className={cssClass}>
        <div className="col-xs-12 col-sm-4 col-md-3">

          <ImageLoader
            src={linkToImage}>
            <div className="imageL">
              <div className="coverImageWrapper">
                <p className="imageTitle">
                    {this.props.meta.title}
                </p>
                <p>
                    {this.props.meta.creator}
                </p>
              </div>
            </div>
          </ImageLoader>
        </div>
        <div id={this.props.meta.title} className="description col-xs-12 col-sm-8 col-md-7 col-md-offset-1" style={{fontSize: this.props.fontSize + "px"}}>
          <p>{this.props.meta.title}</p>
          <p>{this.props.meta.creator}</p>
        </div>
      </span>
    )
  }
}

function mapStateToProps(state) {
  return {
    username:       state.settings.username,
    fontSize:       state.settings.fontSize,
    fontType:       state.settings.fontType,
    theme:          state.settings.theme,
    bookChapters:   state.settings.bookChapters,
    currentChapter: state.settings.currentChapter,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getToc:         (bookName)          => dispatch(getToc(bookName)),
    getChapterText: (bookName, chapter) => dispatch(getChapterText(bookName, chapter)),
    resetBook:      ()                  => dispatch(resetBook()),
    saveBookLastRead: (username,book)                => dispatch(saveBookLastRead(username,book)),
    getLastReadChapter: (username, book, bookChapters)              => dispatch(getLastReadChapter(username, book, bookChapters))
  }
}

export const BookListItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(BookListItemUI);
