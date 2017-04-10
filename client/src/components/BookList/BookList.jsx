import React            from 'react';
import * as ReactRedux  from 'react-redux';
import Dropbox          from 'dropbox';

import {BookListItem}   from './BookListItem';


import {getBookList,getLastBookRead,getToc,getDropboxBooks,setAccessToken,getLogin}    from '../../reducers.js';

/**
  Displays a list of book items
*/
export class BookListUI extends React.Component {
  componentWillMount() {
    if(this.props.access_token != 0){
      this.props.getBookList();
      this.props.loadBooksFromDropbox();
      this.props.getLastBookRead(this.props.username);
    }
  }

  render() {
    let bookListContent = <div>
                            <h1>Er staat geen boeken in de lijst</h1>
                            <p>Dit komt waarschijnlijk omdat uw Dropbox map leeg is. Voer de volgende uit om deze te vullen</p>
                            <ol>
                              <li>Log in op de <a href="https://www.dropbox.com">Dropbox website</a></li>
                              <li>Navigeer naar de <b>Apps</b> map in uw Dropbox hoofdmap</li>
                              <li>Plaats uw epub bestanden in de map <b>Readable Reader</b></li>
                              <li><a onClick={this.props.loadBooksFromDropbox}>Klik op deze link om uw boeken op te halen</a></li>
                            </ol>
                          </div>
    if(this.props.access_token != 0){
      this.props.getBookList();
    }

    if(this.props.access_token == null){
      const authUrl = new Dropbox({ clientId: "vf0htj9tqyvxufd"}).getAuthenticationUrl('http://localhost:8080/');
      bookListContent = (
        <div>
          <p>Uw account is niet gelinkt met Dropbox, druk op de knop hieronder om Dropbox te linken met de applicatie.</p>
          <a href={authUrl} className="btn btn-primary center">Link Dropbox</a>
        </div>
      )
      if(window.location.href.indexOf("access_token" ) > -1){
        var access_token = window.location.hash.split('access_token=')[1].split('&')[0]
        this.props.setAccessToken(access_token, this.props.username);
        bookListContent = <div>
                            <h1>Er staat geen boeken in de lijst</h1>
                            <p>Dit komt waarschijnlijk omdat uw Dropbox map leeg is. Voer de volgende uit om deze te vullen</p>
                            <ol>
                              <li>Log in op <a href="https://www.dropbox.com">Dropbox website</a></li>
                              <li>Navigeer naar de volgende map in uw Dropbox hoofdmap: <b>Apps</b></li>
                              <li>Plaats uw epub bestanden in de map <b>Readable Reader</b></li>
                            </ol>
                          </div>
      }
    }else if(Object.keys(this.props.bookList).length > 0) {
      // Object.values gives an array of properties the bookList object
      bookListContent = Object.keys(this.props.bookList).map((fileName, key) => {
        const book = this.props.bookList[fileName];
        return (
          <BookListItem
            key={key}
            meta={book.metadata}
            fileName={book._fileName}
          />
        )
      });
    }

    const cssClass = "list-group " + this.props.theme + " " + this.props.fontType;

    return (
      <div className={cssClass} style={{fontSize: this.props.fontSize + "px"}}>
        <p id="booklist-title">BOEKENLIJST</p>
        <div id="booklist">
          {bookListContent}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    bookList:           state.settings.bookList,
    theme:              state.settings.theme,
    fontType:           state.settings.fontType,
    fontSize:           state.settings.fontSize,
    access_token:       state.settings.access_token,
    username:           state.settings.username
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getBookList:            ()                            => dispatch(getBookList()),
    getLastBookRead:        (username)                    => dispatch(getLastBookRead(username)),
    setAccessToken:         (access_token,username)       => dispatch(setAccessToken(access_token,username)),
    loadBooksFromDropbox:   ()                            => dispatch(getDropboxBooks())
  }
}

export const BookList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(BookListUI);
