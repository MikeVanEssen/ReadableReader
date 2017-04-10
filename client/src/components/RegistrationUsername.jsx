import React from 'react';
import * as ReactRedux from 'react-redux';

import {setNewUsername, checkUsername} from '../reducers'


export class RegistrationUsernameUI extends React.Component {
  render() {

    const submitHandler = (e) =>{
      e.preventDefault();
      this.props.checkUsername(this.props.username)
    };

    const setNewUsername = (evt) => this.props.setNewUsername(evt.target.value);

    return (
      <div>
        <form>
          <div className="form-group">
            <input type="text" id="usernameField" className="form-control loginbar text-center" placeholder="Gebruikersnaam" onChange={setNewUsername}/>
            <button id="submitUsername" className="btn btn-default submitbutton center-block" onClick={submitHandler}>Volgende</button>
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
      setNewUsername:          (username)    => dispatch(setNewUsername(username)),
      checkUsername:           (username)    => dispatch(checkUsername(username))
    }
}

export const RegistrationUsername = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(RegistrationUsernameUI);
