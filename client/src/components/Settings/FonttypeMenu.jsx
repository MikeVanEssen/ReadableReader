import React            from 'react';
import * as ReactRedux  from 'react-redux';

import {MenuButton} from './MenuButton';

import {setBiggerFontsize,
        setSmallerFontsize,
        setMenuState,
        postFontTypeSetting} from '../../reducers';

class FonttypeMenuUI extends React.Component {
  render() {
    //Go back to menu overview
    const backToMenuOverview = (e) => {
      e.preventDefault();
      this.props.setMenuState('itemList');
    }

    //Post the chosen fonttype
    const fontTypeSelector = (e) => {
      e.preventDefault();
      const font = e.target.id.replace("Button","");
      this.props.postFontTypeSetting(font, this.props.username);
    }

    return (
      <div>
        <MenuButton backgroundcolor="#4B5BFF"
                    textcolor="#FFFFFF"
                    textContent="Terug"
                    compID="fontTypeMenuBackButton"
                    clickAction={backToMenuOverview}/>
        <MenuButton cssClasses={this.props.theme}
                    textContent="Arial"
                    compID="arialButton"
                    wantedFontType="Arial"
                    clickAction={fontTypeSelector}/>
        <MenuButton cssClasses={this.props.theme}
                    textContent="Helvetica"
                    compID="helveticaButton"
                    wantedFontType="Helvetica"
                    clickAction={fontTypeSelector}/>
        <MenuButton cssClasses={this.props.theme}
                    textContent="Verdana"
                    compID="verdanaButton"
                    wantedFontType="Verdana"
                    clickAction={fontTypeSelector}/>
        <MenuButton cssClasses={this.props.theme}
                    textContent="SansSerif"
                    compID="sansSerifButton"
                    wantedFontType="Sans-Serif"
                    clickAction={fontTypeSelector}/>
        <MenuButton cssClasses={this.props.theme}
                    textContent="Monospace"
                    compID="monospaceButton"
                    wantedFontType="Monospace"
                    clickAction={fontTypeSelector}/>
        <MenuButton cssClasses={this.props.theme}
                    textContent="Times New Roman"
                    compID="timesNewRomanButton"
                    wantedFontType="Times New Roman"
                    clickAction={fontTypeSelector}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    theme:     state.settings.theme,
    username:  state.settings.username
  }
}

function mapDispatchToProps(dispatch) {
  return {
    postFontTypeSetting:      (font, username)      => dispatch(postFontTypeSetting(font, username)),
    setMenuState:             (menuState)           => dispatch(setMenuState(menuState))
  }
}

export const FonttypeMenu = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(FonttypeMenuUI);
