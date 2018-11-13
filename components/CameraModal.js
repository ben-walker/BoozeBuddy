import React, { Component } from 'react';
import { Camera } from 'expo';
import Modal from 'react-native-modal';
import style from '../constants/StyleSheet';

class CameraModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      cameraType: Camera.Constants.Type.back,
    };
  }

  toggleModal = () => this.setState(prevState => ({ isVisible: !prevState.isVisible }))

  render() {
    const {
      isVisible,
      cameraType,
    } = this.state;

    return (
      <Modal
        isVisible={isVisible}
        onSwipe={this.toggleModal}
        swipeDirection="down"
        style={style.drinkModal}
      >
        <Camera
          style={{ flex: 1 }}
          type={cameraType}
        />
      </Modal>
    );
  }
}

export default CameraModal;
