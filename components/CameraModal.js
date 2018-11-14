import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Camera } from 'expo';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
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

  recordPicture = async () => {
    const { onNewImage } = this.props;
    if (this.camera) {
      const photo = await this.camera.takePictureAsync({ base64: true });
      onNewImage(photo);
      this.toggleModal();
    }
  }

  renderTakePhoto = () => (
    <View style={style.takePictureIcon}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={this.recordPicture} // take pic
        >
          <Icon
            name="radio-button-checked"
            size={70}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  )

  renderCancel = () => (
    <View style={style.closeCameraIcon}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={this.toggleModal} // close camera
        >
          <Icon
            name="close"
            size={40}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  )

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
          ref={(ref) => { this.camera = ref; }}
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}
          type={cameraType}
        >
          {this.renderCancel()}
          {this.renderTakePhoto()}
        </Camera>
      </Modal>
    );
  }
}

CameraModal.propTypes = {
  onNewImage: PropTypes.func.isRequired,
};

export default CameraModal;
