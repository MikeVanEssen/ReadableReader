import React from 'react';
import * as ReactRedux from 'react-redux';

import {hideImagePopup} from '../../reducers';

export class PopupImageUI extends React.Component {
    render() {
      return (
        <div id="popupDiv"
             onClick={this.props.closeImgPopup}>
          <img src={this.props.imageURL} ref="imageInPopup"/>
        </div>
      )
    }

    componentDidMount(){
      const image = this.refs.imageInPopup;

      let height = 0;
      let width = 0;

      // Safari somehow doesn't have an image width or height.
      // So an Image object is created with the image as it's source.
      // Then we can get the needen with and height from the Image object
      let newImg = new Image();

      newImg.onload = function() {
        height = newImg.height;
        width = newImg.width;
        const widthResizer  = window.innerWidth/width;
        const heightResizer = window.innerHeight/height;
        let   imageResizer  = 1;

        if(widthResizer <= heightResizer) {
          imageResizer = widthResizer
        } else if(widthResizer > heightResizer) {
          imageResizer = heightResizer;
        }

        image.width   = image.width * imageResizer;
      }

      newImg.src = this.props.imageURL; // this must be done AFTER setting onload

    }
}

function mapStateToProps(state) {
    return {
      imageURL: state.settings.imgPopupURL
    }
}

function mapDispatchToProps(dispatch) {
    return {
      closeImgPopup:              ()    => dispatch(hideImagePopup())
    }
}

export const PopupImage = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PopupImageUI);
