import React                from 'react';
import * as ReactRedux      from 'react-redux';

import {Login} from './Login';
import {Password} from './Password'
import {RegistrationUsername} from './RegistrationUsername'
import {RegistrationPassword} from './RegistrationPassword'


import {BookContent}  from './Book/BookContent';
import {BookList}     from './BookList/BookList';
import {PopupImage} from './Book/PopupImage';

import {MenuOpenButton} from './Settings/MenuOpenButton';
import {Menu} from './Settings/Menu';

import {getSettings, setSettingState,getSession, getCookie, setAppState} from '../reducers';

/**
  App container for the Readable Reader App
*/
class ReadableReaderUI extends React.Component {

  componentWillMount() {
    this.props.getSession();
    this.props.getCookie();
  }
  render() {
    let content;

    if (this.props.loginscreen) {
      content = <Login/>
    } else if(this.props.passwordscreen){
      content = <Password/>
    } else if(this.props.bookScreen){
      this.props.getSettings(this.props.username);
      if(this.props.bookName) {
        content = <BookContent/>
      } else {
        content = <BookList/>
      }
    } else if (this.props.appState == "Registration_Username") {
      content = <RegistrationUsername/>
    } else if (this.props.registrationPasswordscreen) {
      content = <RegistrationPassword/>
    }

    const displayMenuButton = () => {
      if(this.props.bookScreen){
        return <MenuOpenButton/>
      }
    }

    const displayImagePopup = () => {
      if(this.props.imageURL !== null){
        return <PopupImage/>;
      }
    }

    const displayMenu = () => {
      if(this.props.menuState == true){
        return <Menu/>;
      }
    }

    return (
        <div>
          {displayMenuButton()}
          {displayMenu()}
          {displayImagePopup()}
          <div>
            {content}
          </div>
        </div>
      )
    }
  }

function mapStateToProps(state) {
  return {
    appState:       state.settings.appState,
    username:       state.settings.username,
    bookName:       state.settings.bookName,
    settingState:   state.settings.settingState,
    imageURL:       state.settings.imgPopupURL,
    loginscreen:    state.settings.loginscreen,
    passwordscreen: state.settings.passwordscreen,
    bookScreen:     state.settings.bookScreen,
    menuState:      state.menu.menuOpen,
    registrationPasswordscreen : state.settings.registrationPasswordscreen
  }
}

function mapDispatchToProps(dispatch) {
    return {
        getSettings:            (username)          => dispatch(getSettings(username)),
        getSession:             ()                  => dispatch(getSession()),
        getCookie:              ()                  => dispatch(getCookie()),
        setSettingState:        (settingState)      => dispatch(setSettingState(settingState)),
        setAppState:            (appState)          => dispatch(setAppState(appState))
    }
}

export const App = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ReadableReaderUI);
