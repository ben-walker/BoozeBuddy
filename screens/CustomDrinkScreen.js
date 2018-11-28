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
import { forEach } from 'lodash-es';
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
        hasCameraPermission: null,
        customImage: null,
        ingredientInputs: [],
        recipe: {},
        loading: false,
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
          onEndEditing={e => this.updateRecipe(key, 'ingredientName', e.nativeEvent.text)}
        />

        <FormLabel>
          Ingredient #
          {key + 1}
          {' '}
          - Volume (mL)
        </FormLabel>
        <FormInput
          onEndEditing={e => this.updateRecipe(key, 'ingredientVolume', e.nativeEvent.text)}
        />

        <FormLabel>
          Ingredient #
          {key + 1}
          {' '}
          - Alcohol Content (%)
        </FormLabel>
        <FormInput
          onEndEditing={e => this.updateRecipe(key, 'ingredientAlcoholContent', e.nativeEvent.text)}
        />
      </Fragment>
    );

    getIngredientInputs = () => {
      const { ingredientInputs } = this.state;
      return ingredientInputs.map(value => value);
    }

    updateImage = image => this.setState({ customImage: image })

    isRecipeValid = (recipe) => {
      let isValid = true;
      forEach(recipe, (value) => {
        isValid = this.isIngredientValid(value) && isValid;
      });
      return isValid;
    }

    isIngredientValid = (ingredientObj) => {
      const {
        ingredientName,
        ingredientVolume,
        ingredientAlcoholContent,
      } = ingredientObj;

      if (!ingredientName) {
        this.dropdown.alertWithType('error', 'Error', 'One of your ingredient names is blank!');
        return false;
      }
      if (!ingredientVolume) {
        this.dropdown.alertWithType('error', 'Error', 'One of your ingredient volumes is blank!');
        return false;
      }
      if (!(ingredientVolume * 1 === parseInt(ingredientVolume, 10))) {
        this.dropdown.alertWithType('error', 'Error', 'One of your ingredient volumes isn\'t a number!');
        return false;
      }
      if (!ingredientAlcoholContent) {
        this.dropdown.alertWithType('error', 'Error', 'One of your ingredient alcohol contents is blank!');
        return false;
      }
      if (!(ingredientAlcoholContent * 1 === parseInt(ingredientAlcoholContent, 10))) {
        this.dropdown.alertWithType('error', 'Error', 'One of your ingredient alcohol contents isn\'t a number!');
        return false;
      }

      return true;
    }

    tabulateTotalVolume = (recipe) => {
      let totalVolume = 0;
      forEach(recipe, (value) => {
        totalVolume += value.ingredientVolume * 1;
      });
      this.setState({ drinkVolume: totalVolume });
      return totalVolume;
    }

    tabulateTotalPercentage = (recipe) => {
      const { drinkVolume } = this.state;
      let totalAlcoholContent = 0;
      forEach(recipe, (value) => {
        const abv = value.ingredientAlcoholContent / 100;
        totalAlcoholContent += ((value.ingredientVolume * abv) / drinkVolume) * 100;
      });
      return parseFloat(totalAlcoholContent.toFixed(2));
    }

    createDrink = async () => {
      const {
        drinkName,
        customImage,
        recipe,
      } = this.state;
      const { navigation } = this.props;

      if (!await this.isValid() || !this.isRecipeValid(recipe)) return;

      this.setState({ loading: true });
      let rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/createDrink', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: drinkName,
          volumeInMilliliters: this.tabulateTotalVolume(recipe),
          alcoholContent: this.tabulateTotalPercentage(recipe),
          recipe,
        }),
      });
      this.setState({ loading: false });

      if (!rawResponse.ok) {
        this.dropdown.alertWithType('error', 'Error', 'Drink creation failed.');
        return;
      }

      if (customImage) {
        this.setState({ loading: true });
        rawResponse = await this.uploadDrinkImage(drinkName);
        this.setState({ loading: false });
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
      const { drinkName } = this.state;
      const drinkNameError = await validate('drinkName', drinkName);
      this.setState({ drinkNameError });
      return new Promise(resolve => resolve(!drinkNameError));
    }

    render() {
      const {
        drinkName,
        drinkNameError,
        customImage,
        loading,
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
              loading={loading}
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
