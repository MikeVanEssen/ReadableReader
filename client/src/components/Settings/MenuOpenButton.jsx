import React            from 'react';
import * as ReactRedux  from 'react-redux';

import {toggleMenu,setMenuState} from '../../reducers';

class MenuOpenButtonUI extends React.Component {
  render() {
    return (
      <div id="toggleMenuButton"
           onClick={this.props.openOrCloseMenu}/>
    )
  }
}

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {
    setMenuState:           (menuState)     => dispatch(setMenuState(menuState)),
    openOrCloseMenu:        ()              => dispatch(toggleMenu())
  }
}

export const MenuOpenButton = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(MenuOpenButtonUI);
