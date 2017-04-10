import React            from 'react';
import * as ReactRedux  from 'react-redux';

import {MenuButton} from './MenuButton';

import {setMenuState,
        postThemeSetting} from '../../reducers';

class ThemeMenuUI extends React.Component {
  render() {
    //Go back to menu overview
    const backToMenuOverview = (e) => {
      e.preventDefault();
      this.props.setMenuState('itemList');
    }

    //Post the chosen theme
    const themeSelector = (e) => {
      e.preventDefault();
      const theme = e.target.id.replace("setCssButton_","")
      this.props.postThemeSetting(theme, this.props.username);
    }

    return (
      <div>
        <MenuButton backgroundcolor="#4B5BFF"
                    textcolor="#FFFFFF"
                    textContent="Terug"
                    compID="themeMenuBackButton"
                    clickAction={backToMenuOverview}/>
        <MenuButton cssClasses="ThemeColorBlackWhite"
                    textContent="Tekst: zwart Achtergrond: wit"
                    compID="setCssButton_ThemeColorBlackWhite"
                    clickAction={themeSelector}/>
        <MenuButton cssClasses="ThemeColorWhiteBlack"
                    textContent="Tekst: wit Achtergrond: zwart"
                    compID="setCssButton_ThemeColorWhiteBlack"
                    clickAction={themeSelector}/>
        <MenuButton cssClasses="ThemeColorYellowBlack"
                    textContent="Tekst: geel Achtergrond: zwart"
                    compID="setCssButton_ThemeColorYellowBlack"
                    clickAction={themeSelector}/>
        <MenuButton cssClasses="ThemeColorBlueWhite"
                    textContent="Tekst: blauw Achtergrond: wit"
                    compID="setCssButton_ThemeColorBlueWhite"
                    clickAction={themeSelector}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    username:     state.settings.username,
    theme:        state.settings.theme
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setMenuState:           (menuState)         => dispatch(setMenuState(menuState)),
    postThemeSetting:       (theme,username)    => dispatch(postThemeSetting(theme,username))
  }
}

export const ThemeMenu = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ThemeMenuUI);
