import React from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
import {
  Avatar,
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';
import { extend } from 'lodash-es';
import { Permissions } from 'expo';
import DropdownAlert from 'react-native-dropdownalert';
import CameraModal from '../components/CameraModal';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import validate from '../utilities/validateWrapper';
import beerIcon from '../assets/images/DrinkIcons/beer.png';

export default class CustomDrinkScreen extends React.Component {
  static navigationOptions = {
    title: 'Create a drink',
    headerTintColor: colors.defaultText,
    headerStyle: { backgroundColor: colors.dark },
  };

  constructor(props) {
    super(props);
    this.state = {
      drinkName: '',
      drinkNameError: '',
      drinkVolume: '',
      drinkVolumeError: '',
      drinkAlcoholContent: '',
      drinkAlcoholContentError: '',
      hasCameraPermission: null,
      customImage: null,
    };
    this.cameraModalRef = React.createRef();
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  updateImage = image => this.setState({ customImage: image })

  createDrink = async () => {
    const {
      drinkName,
      drinkVolume,
      drinkAlcoholContent,
      customImage,
    } = this.state;
    const { navigation } = this.props;

    if (!await this.isValid()) return;
    let rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/createDrink', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: drinkName,
        volumeInMilliliters: drinkVolume,
        alcoholContent: drinkAlcoholContent,
      }),
    });

    if (!rawResponse.ok) {
      this.dropdown.alertWithType('error', 'Error', 'Drink creation failed.');
      return;
    }

    if (customImage) {
      rawResponse = await this.uploadDrinkImage(drinkName);
      if (!rawResponse.ok) {
        this.dropdown.alertWithType('error', 'Error', 'Drink image not uploaded.');
        return;
      }
    }
    this.dropdown.alertWithType('success', 'Drink Created', `Successfully created ${drinkName}.`);
    navigation.navigate('App');
  }

  uploadDrinkImage = async (drinkName) => {
    const { customImage } = this.state;
    const fileURI = `data:image/jpg;base64,${customImage.base64}`;
    const file = await fetch(fileURI).then(res => res.blob())
      .then(intermediateBlob => extend(intermediateBlob, {
        lastModifiedDate: new Date(),
        name: drinkName,
      }));

    const formData = new FormData();
    formData.append('drinkImage', file);

    return fetch('https://dr-robotnik.herokuapp.com/api/uploadDrinkImage', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  async isValid() {
    const {
      drinkName,
      drinkVolume,
      drinkAlcoholContent,
    } = this.state;
    const drinkNameError = await validate('drinkName', drinkName);
    const drinkVolumeError = await validate('drinkVolume', drinkVolume);
    const drinkAlcoholContentError = await validate('drinkAlcoholContent', drinkAlcoholContent);

    this.setState({
      drinkNameError,
      drinkVolumeError,
      drinkAlcoholContentError,
    });

    return new Promise((resolve) => {
      resolve(!drinkNameError && !drinkVolumeError && !drinkAlcoholContentError);
    });
  }

  render() {
    const {
      drinkName,
      drinkNameError,
      drinkVolume,
      drinkVolumeError,
      drinkAlcoholContent,
      drinkAlcoholContentError,
      customImage,
    } = this.state;

    return (
      <ScrollView style={[style.container]}>
        <CameraModal
          ref={this.cameraModalRef}
          onNewImage={this.updateImage}
        />

        <View style={{ alignItems: 'center' }}>
          <FormLabel>Drink Preview</FormLabel>
          <Avatar
            large
            rounded
            source={customImage
              ? { uri: `data:image/jpg;base64,${customImage.base64}` }
              : beerIcon}
            containerStyle={{ margin: 'auto' }}
          />
          <Button
            title="Add a Picture"
            rounded
            containerViewStyle={style.button}
            raised
            backgroundColor={colors.actionButton}
            onPress={() => {
              const { hasCameraPermission } = this.state;
              return hasCameraPermission
                ? this.cameraModalRef.current.toggleModal()
                : alert('We don\'t have permission to access your camera.');
            }}
          />
        </View>

        <FormLabel>Drink Name</FormLabel>
        <FormInput
          onChangeText={drinkNameInput => this.setState({ drinkName: drinkNameInput })}
          value={drinkName}
          autoCapitalize="none"
          inputStyle={style.input}
          onBlur={async () => {
            this.setState({
              drinkNameError: await validate('drinkName', drinkName),
            });
          }}
        />
        <FormValidationMessage labelStyle={style.errorMsg}>
          {drinkNameError}
        </FormValidationMessage>

        <FormLabel>Drink Volume (ml)</FormLabel>
        <FormInput
          onChangeText={drinkVolumeInput => this.setState({ drinkVolume: drinkVolumeInput })}
          value={drinkVolume}
          keyboardType="decimal-pad"
          inputAccessoryViewID="accessoryView"
          inputStyle={style.input}
          onBlur={async () => {
            this.setState({
              drinkVolumeError: await validate('drinkVolume', drinkVolume),
            });
          }}
        />
        <FormValidationMessage labelStyle={style.errorMsg}>
          {drinkVolumeError}
        </FormValidationMessage>

        <FormLabel>Alcohol Content (%)</FormLabel>
        <FormInput
          onChangeText={
            drinkAlcoholContentInput => this.setState({
              drinkAlcoholContent: drinkAlcoholContentInput,
            })
          }
          value={drinkAlcoholContent}
          keyboardType="decimal-pad"
          inputAccessoryViewID="accessoryView"
          inputStyle={style.input}
          onBlur={async () => {
            this.setState({
              drinkAlcoholContentError: await validate('drinkAlcoholContent', drinkAlcoholContent),
            });
          }}
        />
        <FormValidationMessage labelStyle={style.errorMsg}>
          {drinkAlcoholContentError}
        </FormValidationMessage>

        <Button
          onPress={this.createDrink}
          containerViewStyle={style.button}
          rounded
          raised
          title="Create"
          backgroundColor={colors.accent}
        />
        <DropdownAlert ref={(ref) => { this.dropdown = ref; }} />
      </ScrollView>
    );
  }
}
