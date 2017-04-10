import React from 'react';
import * as ReactRedux from 'react-redux';

import {getLogin, setUsername, setPassword, getPassword, resetPassword, setCookie,
        rememberMe, stopRememberMe, setButtonColor} from '../reducers'

export class PasswordUI extends React.Component {
    render() {

      //Method to submit the password and set a cookie if remember me is pressed
      const submitHandler = (e) =>{
        e.preventDefault();
          this.props.getPassword(this.props.username,this.props.password)
          .then(() => {
            if(this.props.remember == true){
              this.props.setCookie(this.props.username);
            }
        })
      };

      //Method to set the password
      const buttonHandler = (e) => {
        e.preventDefault()
        let word = this.props.password;
         word += e.target.value;
        this.props.setPassword(word)
      }
      // Method to reset the password
      const resetButton = (e) =>{
        e.preventDefault()
        this.props.resetPassword()
      }

      //Method to remember your login / set a cookie
      const rememberHandler = (e) =>{

        e.preventDefault()
        if (this.props.remember == true){
          this.props.stopRememberMe()
          this.props.setButtonColorAction()
        } else {
          this.props.setRememberMe()
            this.props.setButtonColorAction()
        }
      }

        return (
            <div>
              <form>
                  <div className="form-group">
                      <input id="passwordField" type="password" className="form-control text-center" placeholder="Pincode" onChange={buttonHandler} value={this.props.password} disabled/>
                  </div>
                  <div id="numberPad">
                    <div className="row">
                      <button id="keypad1" className="col-md-offset-4 col-md-2 text-center passwordbutton" value="1" onClick={buttonHandler}>1</button>
                      <button id="keypad2" className="col-md-2 text-center passwordbutton" value="2" onClick={buttonHandler}>2</button>
                      <button id="keypad3" className="col-md-2 text-center passwordbutton" value="3" onClick={buttonHandler}>3</button>
                    </div>
                    <div className="row">
                      <button id="keypad4" className="col-md-offset-4 col-md-2 text-center passwordbutton" value="4" onClick={buttonHandler}>4</button>
                      <button id="keypad5" className="col-md-2 text-center passwordbutton" value="5" onClick={buttonHandler}>5</button>
                      <button id="keypad6" className="col-md-2 text-center passwordbutton" value="6" onClick={buttonHandler}>6</button>
                    </div>
                    <div className="row">
                      <button id="keypad7" className="col-md-offset-4 col-md-2 text-center passwordbutton" value="7" onClick={buttonHandler}>7</button>
                      <button id="keypad8" className="col-md-2 text-center passwordbutton" value="8" onClick={buttonHandler}>8</button>
                      <button id="keypad9" className="col-md-2 text-center passwordbutton" value="9" onClick={buttonHandler}>9</button>
                    </div>
                    <div className="row">
                      <button id="keypad0" className="col-md-offset-4 col-md-2 text-center passwordbutton" value="0" onClick={buttonHandler}>0</button>
                      <button id="keypadReset" className="col-md-2 text-center resetbutton" onClick={resetButton}>Reset</button>
                  </div>
                  </div>
                  <div className="row">
                      <button id="submitPasswordButton" className="btn btn-default col-md-offset-1 submitbutton" value="" onClick={submitHandler}>Login</button>
                      <button id="rememberMeButton" className={this.props.checked} onClick={rememberHandler}>Blijf ingelogd</button>
                  </div>
              </form>
            </div>

        )
    }
}

function mapStateToProps(state){
    return{
      username:       state.settings.username,
      remember:       state.settings.remember,
      password:       state.settings.password,
      checked:        state.settings.checked
    }
}

function mapDispatchToProps(dispatch){
    return {
      setPassword:          (password)              =>  dispatch(setPassword(password)),
      setUsername:          (username)              =>  dispatch(setUsername(username)),
      resetPassword:        ()                      =>  dispatch(resetPassword()),
      getPassword:          (username,password)     =>  dispatch(getPassword(username,password)),
      setRememberMe:        ()                      =>  dispatch(rememberMe()),
      setCookie:            (username)              =>  dispatch(setCookie(username)),
      stopRememberMe:       ()                      =>  dispatch(stopRememberMe()),
      setButtonColorAction: ()                      =>  dispatch(setButtonColor())
    }
}

export const Password = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(PasswordUI);
