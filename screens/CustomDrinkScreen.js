import React from 'react';
import {
    InputAccessoryView,
    Keyboard,
    AsyncStorage,
    ScrollView,
    Button as RawButton,
    Platform,
    View,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  CheckBox,
  Text,
} from 'react-native-elements';
import { Button } from 'react-native-elements';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import validate from '../utilities/validateWrapper';
import DrinkCard from '../components/DrinkCard.js';


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
      }
      this.createDrink = this.createDrink.bind(this);
    }

    async createDrink() {
        if (!await this.isValid()) return;
        const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/createDrink', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.drinkName,
                volumeInMilliliters: this.state.drinkVolume,
                alcoholContent : this.state.drinkAlcoholContent,
            })
        });

        if (!rawResponse.ok) return alert("createDrink failed.");
        const response = await rawResponse.json();
        console.log(response);
        alert(`Successfully created ${this.state.drinkName}.`);
        this.props.navigation.navigate('App');
    }

    async isValid() {
        const drinkNameError = await validate('drinkName', this.state.drinkName);
        const drinkVolumeError = await validate('drinkVolume', this.state.drinkVolume);
        const drinkAlcoholContentError = await validate('drinkAlcoholContent', this.state.drinkAlcoholContent);

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
        return (
            <View style={style.container}>
                <ScrollView style={style.container} contentContainerStyle={style.secondaryContentContainer}>

                <FormLabel>Drink Name</FormLabel>
                <FormInput
                    onChangeText={(drinkName) => this.setState({drinkName})}
                    value={this.state.drinkName}
                    autoCapitalize='none'
                    inputStyle={style.input}
                    onBlur={async () => {
                        this.setState({
                            drinkNameError: await validate('drinkName', this.state.drinkName),
                        })
                    }}
                />
                <FormValidationMessage labelStyle={style.errorMsg}>
                    {this.state.drinkNameError}
                </FormValidationMessage>

                <FormLabel>Drink Volume (ml)</FormLabel>
                <FormInput
                    onChangeText={(drinkVolume) => this.setState({drinkVolume})}
                    value={this.state.drinkVolume}
                    keyboardType='decimal-pad'
                    inputAccessoryViewID='accessoryView'
                    inputStyle={style.input}
                    onBlur={async () => {
                        this.setState({
                            drinkVolumeError: await validate('drinkVolume', this.state.drinkVolume),
                        })
                    }}
                />
                <FormValidationMessage labelStyle={style.errorMsg}>
                    {this.state.drinkVolumeError}
                </FormValidationMessage>

                <FormLabel>Alcohol Content (%)</FormLabel>
                <FormInput
                    onChangeText={(drinkAlcoholContent) => this.setState({drinkAlcoholContent})}
                    value={this.state.drinkAlcoholContent}
                    keyboardType='decimal-pad'
                    inputAccessoryViewID='accessoryView'
                    inputStyle={style.input}
                    onBlur={async () => {
                        this.setState({
                            drinkAlcoholContentError: await validate('drinkAlcoholContent', this.state.drinkAlcoholContent),
                        })
                    }}
                />
                <FormValidationMessage labelStyle={style.errorMsg}>
                    {this.state.drinkAlcoholContentError}
                </FormValidationMessage>

                <Button
                    onPress={this.createDrink}
                    style={style.button}
                    rounded
                    title='Create'
                    backgroundColor={colors.accent}
                />

                </ScrollView>
            </View>
        );
    }
}
