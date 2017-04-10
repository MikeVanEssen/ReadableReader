import React from 'react';
import * as ReactRedux from 'react-redux';

import {
  getChapterText,
  setBookChapter,
  showImagePopup} from '../../reducers'

export class ChapterSelectUI extends React.Component {
    constructor() {
      super();
      this.chapterDiv = null;
    }

    // Scrolls to the current reading position so that the users focus won't get lost
    keepReadingPosition() {
      let pos = document.getElementById('watching');
      pos.scrollIntoView();
    }

    // Sets a span tag at the current top left position of the client viewpoint
    handleScroll(e) {
      let range;

      // Get the range from the client viewpoint
      range = document.caretRangeFromPoint(e.clientX, e.clientY);

      // Remove span element if one already exists
      if(document.getElementById('watching')) {
        document.getElementById('watching').remove();
      }

      // Create a new span element and add it at the range start position
      if(range) {
        let newSpan = document.createElement('span');
        newSpan.setAttribute('id', 'watching');
        range.insertNode(newSpan);
      }
    }

    componentDidMount() {
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('orientationchange', this.keepReadingPosition);
    }


    //Method to go to the chapter that is selected
    goToLinkAdress(id) {
      var a = this.props.bookChapters.indexOf(id);
      this.props.setChapter(a);
      this.props.getChapterText(this.props.bookName,id)
    }

    render() {
        return (
          <div id="chapterText" ref={(chapterDiv) => {this.chapterDiv = chapterDiv;}}
               dangerouslySetInnerHTML={{__html: this.props.chapterText}}></div>
        )
    }

    componentDidUpdate() {
       const allLinksInChapter = this.chapterDiv.querySelectorAll("[data-clickId]");
       for(let index=0; index < allLinksInChapter.length; index++) {
         let theElement = allLinksInChapter[index];
         theElement.className = 'internalLink' + index;
         const theChapterId = theElement.getAttribute("data-clickId");
         theElement.addEventListener("click", (evt) => {
            this.goToLinkAdress(theChapterId);
         })
       }
       const allImgInChapter = this.chapterDiv.querySelectorAll("img");
       for(let index=0; index< allImgInChapter.length; index++){
         let imageElement = allImgInChapter[index];
         const imageURL = imageElement.getAttribute("src");

         const goodURL = imageURL.replace('localhost', window.location.hostname);

         imageElement.src = goodURL;
         imageElement.addEventListener("click", (evt) => {
           this.props.openImgPopup(goodURL);
         })
       }
    }

}

function mapStateToProps(state){
  return{
    chapterText :    state.settings.chapterText,
    bookName :       state.settings.bookName,
    bookChapters :   state.settings.bookChapters
  }
}

function mapDispatchToProps(dispatch){
  return {
    getChapterText:     (bookName, chapter)   => dispatch(getChapterText(bookName, chapter)),
    setChapter:         (id)                  => dispatch(setBookChapter(id)),
    openImgPopup:       (imageURL)            => dispatch(showImagePopup(imageURL))
  }
}


export const ChapterSelect = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(ChapterSelectUI);
