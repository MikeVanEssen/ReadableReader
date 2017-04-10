import React from 'react';
import * as ReactRedux from 'react-redux';

import {getLogin, setUsername, passwordScreen,setAppState} from '../reducers'


export class LoginUI extends React.Component {

    render() {

      // Method to submit the username
      const submitHandler = (e) =>{
        e.preventDefault();
          this.props.getLogin(this.props.username);
      };

      // Go to the Registration page
      const registrationHandler = (e) => {
        e.preventDefault();
        this.props.setAppState("Registration_Username");
      }

      const setUsername = (evt) => this.props.setUsername(evt.target.value);

        return (
          <div>
            <form>
              <div className="form-group">
                <input id="usernameField" type="text" className="form-control loginbar text-center" placeholder="Gebruikersnaam" onChange={setUsername}/>
              </div>
              <div>
                <button id="submitUsername" className="btn btn-default submitbutton center-block" onClick={submitHandler}>Login</button>
                <button id="goToRegister" className="btn btn-default submitbutton center-block" onClick={registrationHandler}>Registeren</button>
              </div>
            </form>
          </div>
        )
    }
}

function mapStateToProps(state){
    return{
      username:   state.settings.username
    }
}

function mapDispatchToProps(dispatch){
    return {
      setPasswordScreen:    ()            => dispatch(passwordScreen()),
      setUsername:          (username)    => dispatch(setUsername(username)),
      getLogin:             (username)    => dispatch(getLogin(username)),
      setAppState:          (appState)    => dispatch(setAppState(appState))

    }
}

export const Login = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(LoginUI);
