import React from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';
import { Permissions } from 'expo';
import DropdownAlert from 'react-native-dropdownalert';
import CameraModal from '../components/CameraModal';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import validate from '../utilities/validateWrapper';


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
    };
    this.cameraModalRef = React.createRef();
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  createDrink = async () => {
    const {
      drinkName,
      drinkVolume,
      drinkAlcoholContent,
    } = this.state;
    const { navigation } = this.props;

    if (!await this.isValid()) return;
    const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/createDrink', {
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
    this.dropdown.alertWithType('success', 'Drink Created', `Successfully created ${drinkName}.`);
    navigation.navigate('App');
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
    } = this.state;

    return (
      <View style={style.container}>
        <ScrollView style={style.container} contentContainerStyle={style.secondaryContentContainer}>

          <CameraModal
            ref={this.cameraModalRef}
          />

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
            title="Add a Picture"
            rounded
            backgroundColor={colors.actionButton}
            onPress={() => this.cameraModalRef.current.toggleModal()}
          />

          <Button
            onPress={this.createDrink}
            style={style.button}
            rounded
            title="Create"
            backgroundColor={colors.accent}
          />

        </ScrollView>
        <DropdownAlert ref={(ref) => { this.dropdown = ref; }} />
      </View>
    );
  }
}
