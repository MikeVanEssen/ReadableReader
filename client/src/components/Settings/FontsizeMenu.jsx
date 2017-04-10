import React            from 'react';
import * as ReactRedux  from 'react-redux';

import {MenuButton} from './MenuButton';

import {setBiggerFontsize,
        setSmallerFontsize,
        setMenuState,
        postFontSizeSetting} from '../../reducers';

class FontsizeMenuUI extends React.Component {
  keepReadingPosition() {
    let pos = document.getElementById('watching');
    if(pos) {
      pos.scrollIntoView();
    }
  }

  render() {
    //Go back to menu overview
    const backToMenuOverview = (e) => {
      e.preventDefault();
      this.props.setMenuState('itemList');
    }

    const SmallerClickHandler = (e) => {
      e.preventDefault();
      if (this.props.fontSize > 10) {
        this.props.makeFontSmaller()
        .then(() => {
          this.props.postFontSize(this.props.fontSize, this.props.username)
          this.keepReadingPosition();
        })
      } else {
        alert("Lettergrootte kan niet kleiner dan 10.");
      }
    }

    //Make fontsize bigger and post the size
    const BiggerClickHandler = (e) => {
      e.preventDefault();
      var lineHeight = 1.4;
      if(this.props.fontSize < window.innerHeight/(lineHeight*2)){
        this.props.makeFontBigger()
        .then(() => {
          this.props.postFontSize(this.props.fontSize, this.props.username)
          this.keepReadingPosition();
        })
      }else{
        alert("Lettergrootte kan niet groter")
      }
    }

    return (
      <div>
        <MenuButton backgroundcolor="#4B5BFF"
                    textcolor="#FFFFFF"
                    textContent="Terug"
                    compID="fontSizeMenuBackButton"
                    clickAction={backToMenuOverview}/>
        <MenuButton backgroundcolor="#116611"
                    textcolor="#FFFFFF"
                    textContent="+"
                    compID="fontSizePlusButton"
                    clickAction={BiggerClickHandler}/>
        <MenuButton cssClasses={this.props.theme}
                    textContent={this.props.fontSize}
                    compID="currentFontSize"/>
        <MenuButton backgroundcolor="#B2111B"
                    textcolor="#FFFFFF"
                    textContent="-"
                    compID="fontSizeMinButton"
                    clickAction={SmallerClickHandler}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    fontSize:     state.settings.fontSize,
    username:     state.settings.username,
    theme:        state.settings.theme
  }
}

function mapDispatchToProps(dispatch) {
  return {
    makeFontBigger:         ()                  => dispatch(setBiggerFontsize()),
    makeFontSmaller:        ()                  => dispatch(setSmallerFontsize()),
    setMenuState:           (menuState)         => dispatch(setMenuState(menuState)),
    postFontSize:           (size, username)    => dispatch(postFontSizeSetting(size, username)),
  }
}

export const FontsizeMenu = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(FontsizeMenuUI);
