import React            from 'react';
import * as ReactRedux  from 'react-redux';


class MenuButtonUI extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    let css = `menuBlockItem`

    if(this.props.cssClasses){
      css = css + " " + this.props.cssClasses;
    }

    return (
      <div id={this.props.compID}
           className={css}
           onClick={this.props.clickAction}
           style={{
             backgroundColor: this.props.backgroundcolor,
             color: this.props.textcolor,
             fontSize: this.props.fontSize + "px",
             fontFamily: this.props.wantedFontType,
             border: '3pt solid #FFFFFF'
           }}>
        {this.props.textContent}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    fontType:     state.settings.fontType,
    fontSize:     state.settings.fontSize,
    theme:        state.settings.theme
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export const MenuButton = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(MenuButtonUI);
