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
  Button,
  CheckBox,
  Text,
} from 'react-native-elements';
import PickerSelect from 'react-native-picker-select';
import validate from '../utilities/validateWrapper';
import style from '../constants/StyleSheet';
import colour from "../constants/Colors";

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Booze Buddy Signup',
        headerTintColor: colour.defaultText,
        headerStyle: {
            backgroundColor: colour.dark
        },
    };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      gender: '',
      genderError: '',
      weightKg: '',
      weightKgError: '',
      agreedToEULA: false,
    }
    this.signUp = this.signUp.bind(this);
  }

    async signUp() {
        if (!this.state.agreedToEULA) {
          return alert("Please accept the Terms and Conditions before signing up.");
        }
        if (!await this.isValid()) return;
        const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/signUp', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                email: this.state.email,
                gender: this.state.gender,
                weightKg: this.state.weightKg,
                password: this.state.password,
            })
        });

        if (!rawResponse.ok) return alert("Signup failed.");
        const response = await rawResponse.json();
        await AsyncStorage.setItem('userToken', JSON.stringify(response.user));
        this.props.navigation.navigate('App');
    }

    async isValid() {
        const usernameError = await validate('username', this.state.username);
        const emailError = await validate('email', this.state.email);
        const passwordError = await validate('password', this.state.password);
        const weightKgError = await validate('weightKg', this.state.weightKg);
        const genderError = await validate('gender', this.state.gender);

        this.setState({
            usernameError,
            emailError,
            passwordError,
            weightKgError,
            genderError,
        });

        return new Promise((resolve) => {
            resolve(!usernameError && !emailError && !passwordError && !weightKgError && !genderError);
        });
    }

    render() {
        const iosAccessoryView = <InputAccessoryView nativeID='accessoryView'>
            <RawButton
                title='Done'
                color='white'
                onPress={Keyboard.dismiss}
            />
        </InputAccessoryView>

        return (
            <ScrollView style={style.container}>
                <FormLabel>USERNAME</FormLabel>
                <FormInput
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    autoCapitalize='none'
                    inputStyle={style.input}
                    onBlur={async () => {
                        this.setState({
                            usernameError: await validate('username', this.state.username),
                        })
                    }}
                />
                <FormValidationMessage labelStyle={style.errorMsg}>
                    {this.state.usernameError}
                </FormValidationMessage>

                <FormLabel>EMAIL</FormLabel>
                <FormInput
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    inputStyle={style.input}
                    onBlur={async () => {
                        this.setState({
                            emailError: await validate('email', this.state.email),
                        })
                    }}
                />
                <FormValidationMessage labelStyle={style.errorMsg}>
                    {this.state.emailError}
                </FormValidationMessage>

                <FormLabel>PASSWORD</FormLabel>
                <FormInput
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry
                    autoCapitalize='none'
                    placeholder='••••••••'
                    placeholderTextColor='gray'
                    inputStyle={style.input}
                    onBlur={async () => {
                        this.setState({
                            passwordError: await validate('password', this.state.password),
                        })
                    }}
                />
                <FormValidationMessage labelStyle={style.errorMsg}>
                    {this.state.passwordError}
                </FormValidationMessage>

                <FormLabel>GENDER</FormLabel>
                <PickerSelect
                    items={[
                        { label: 'Male', value: 'Male' },
                        { label: 'Female', value: 'Female' },
                        { label: 'Other', value: 'Other' },
                    ]}
                    placeholder={{ label: 'Select your gender...', value: null }}
                    onValueChange={async (value) => {
                        await this.setState({ gender: value });
                        this.setState({ genderError: await validate('gender', this.state.gender) });
                    }}
                    hideDoneBar
                >
                    <FormInput
                        placeholder='Select your gender...'
                        placeholderTextColor='gray'
                        value={this.state.gender}
                        inputStyle={style.input}
                    />
                </PickerSelect>
                <FormValidationMessage labelStyle={style.errorMsg}>
                    {this.state.genderError}
                </FormValidationMessage>

                <FormLabel>WEIGHT (KG)</FormLabel>
                <FormInput
                    onChangeText={(weightKg) => this.setState({weightKg})}
                    value={this.state.weightKg}
                    keyboardType='decimal-pad'
                    inputAccessoryViewID='accessoryView'
                    inputStyle={style.input}
                    onBlur={async () => {
                        this.setState({
                            weightKgError: await validate('weightKg', this.state.weightKg),
                        })
                    }}
                />
                <FormValidationMessage labelStyle={style.errorMsg}>
                    {this.state.weightKgError}
                </FormValidationMessage>

                {Platform.OS === 'ios' ? iosAccessoryView : null}
                <View style={{flex: 1 , flexDirection:'row', justifyContent:'center'}}>
                  <CheckBox
                    center
                    checkedColor='green'
                    unCheckedColor='gray'
                    containerStyle={style.eulaCheckbox}
                    checked={this.state.agreedToEULA}
                    onPress={() => this.setState({agreedToEULA: !this.state.agreedToEULA})}
                  />
                  <View style={{flexDirection:'column', justifyContent:'space-around'}}>
                    <Text style={style.defaultText}>I agree to the Terms and Conditions.</Text>
                  </View>
                </View>

                <Button
                    onPress={this.signUp}
                    style={style.button}
                    rounded
                    title='Sign Up'
                    backgroundColor={colour.accent}
                />
                <Button
                    onPress={() => this.props.navigation.navigate('Legal')}
                    style={style.button}
                    rounded
                    title='View Terms and Conditions'
                    backgroundColor={colour.secondary}
                />
            </ScrollView>
        );
    }
}
