import React, { Fragment } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Button as TextButton,
} from 'react-native';
import {
  Avatar,
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';
import { Permissions } from 'expo';
import DropdownAlert from 'react-native-dropdownalert';
import { Header } from 'react-navigation';
import CameraModal from '../components/CameraModal';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import validate from '../utilities/validateWrapper';
import beerIcon from '../assets/images/DrinkIcons/beer.png';

export default class CustomDrinkScreen extends React.Component {
    static navigationOptions = {
      title: 'Create a Drink',
      headerTintColor: colors.defaultText,
      headerStyle: { backgroundColor: colors.dark },
    };

    constructor(props) {
      super(props);
      this.state = {
        drinkName: '',
        drinkNameError: '',
        drinkVolume: '',
        drinkAlcoholContent: '',
        hasCameraPermission: null,
        customImage: null,
        ingredientInputs: [],
        recipe: {},
      };
      this.cameraModalRef = React.createRef();
    }

    async componentDidMount() {
      this.addIngredientInput(0);
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
    }

    addIngredientInput = (key) => {
      this.setState(prev => ({
        ingredientInputs: [...prev.ingredientInputs, this.getIngredientInput(key)],
      }));
    }

    updateRecipe = (key, parameter, value) => {
      const { recipe } = this.state;
      const recipeCopy = recipe;
      if (!recipeCopy[key]) recipeCopy[key] = {};
      recipeCopy[key][parameter] = value;
      this.setState({ recipe: recipeCopy });
    }

    getIngredientInput = key => (
      <Fragment key={key}>
        <FormLabel>
          Ingredient #
          {key + 1}
          {' '}
          - Name
        </FormLabel>
        <FormInput
          onBlur={e => this.updateRecipe(key, 'ingredientName', e.nativeEvent.text)}
        />

        <FormLabel>
          Ingredient #
          {key + 1}
          {' '}
          - Volume (mL)
        </FormLabel>
        <FormInput
          onBlur={e => this.updateRecipe(key, 'ingredientVolume', e.nativeEvent.text)}
        />

        <FormLabel>
          Ingredient #
          {key + 1}
          {' '}
          - Alcohol Content (%)
        </FormLabel>
        <FormInput
          onBlur={e => this.updateRecipe(key, 'ingredientAlcoholContent', e.nativeEvent.text)}
        />
      </Fragment>
    );

    getIngredientInputs = () => {
      const { ingredientInputs } = this.state;
      return ingredientInputs.map(value => value);
    }

    updateImage = image => this.setState({ customImage: image })

    createDrink = async () => {
      const {
        drinkName,
        drinkVolume,
        drinkAlcoholContent,
        customImage,
        recipe,
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
      const formData = new FormData();
      formData.append('drinkImage', { uri: customImage.uri, type: 'image/jpeg', name: drinkName });

      return fetch('https://dr-robotnik.herokuapp.com/api/uploadDrinkImage', {
        method: 'POST',
        credentials: 'include',
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

      this.setState({ drinkNameError });

      return new Promise((resolve) => {
        resolve(!drinkNameError && !drinkVolumeError && !drinkAlcoholContentError);
      });
    }

    render() {
      const {
        drinkName,
        drinkNameError,
        customImage,
      } = this.state;

      return (
        <KeyboardAvoidingView
          style={style.container}
          keyboardVerticalOffset={Header.HEIGHT + 20}
          behavior="padding"
        >
          <ScrollView style={[style.main]}>
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
                  if (hasCameraPermission) this.cameraModalRef.current.toggleModal();
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

            {this.getIngredientInputs()}
            <TextButton
              title="Add an Ingredient"
              onPress={() => {
                const { ingredientInputs } = this.state;
                this.addIngredientInput(ingredientInputs.length);
              }}
            />

            <Button
              onPress={this.createDrink}
              containerViewStyle={style.button}
              rounded
              raised
              title="Create"
              backgroundColor={colors.accent}
            />
          </ScrollView>
          <DropdownAlert ref={(ref) => {
            this.dropdown = ref;
          }}
          />
        </KeyboardAvoidingView>
      );
    }
}
