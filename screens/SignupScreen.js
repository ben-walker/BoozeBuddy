import React from 'react';
import PropTypes from 'prop-types';
import {
  InputAccessoryView,
  Keyboard,
  AsyncStorage,
  ScrollView,
  Button as RawButton,
  Platform,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
  CheckBox,
  Text,
} from 'react-native-elements';
import { Header } from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';
import PickerSelect from 'react-native-picker-select';
import validate from '../utilities/validateWrapper';
import style from '../constants/StyleSheet';
import colors from '../constants/Colors';

export default class SignupScreen extends React.Component {
    static navigationOptions = {
      title: 'Booze Buddy Signup',
      headerTintColor: colors.defaultText,
      headerStyle: { backgroundColor: colors.dark },
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
      };
    }

    signUp = async () => {
      const {
        agreedToEULA,
        username,
        email,
        gender,
        weightKg,
        password,
      } = this.state;
      const { navigation } = this.props;

      if (!agreedToEULA) {
        this.dropdown.alertWithType('warn', 'Conditions May Apply', 'Please accept the Terms and Conditions.');
        return null;
      }
      if (!await this.isValid()) return null;
      const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/signUp', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          gender,
          weightKg,
          password,
        }),
      });

      if (!rawResponse.ok) {
        this.dropdown.alertWithType('error', 'Error', 'Signup failed.');
        return null;
      }
      const response = await rawResponse.json();
      await AsyncStorage.setItem('userToken', JSON.stringify(response.user));
      return navigation.navigate('App');
    }

    async isValid() {
      const {
        username,
        email,
        password,
        weightKg,
        gender,
      } = this.state;
      const usernameError = await validate('username', username);
      const emailError = await validate('email', email);
      const passwordError = await validate('password', password);
      const weightKgError = await validate('weightKg', weightKg);
      const genderError = await validate('gender', gender);

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
      const {
        agreedToEULA,
        username,
        usernameError,
        email,
        emailError,
        password,
        passwordError,
        gender,
        genderError,
        weightKg,
        weightKgError,
      } = this.state;

      const { navigation } = this.props;

      const iosAccessoryView = (
        <InputAccessoryView nativeID="accessoryView">
          <RawButton
            title="Done"
            color="white"
            onPress={Keyboard.dismiss}
          />
        </InputAccessoryView>
      );

      return (
        <KeyboardAvoidingView
          style={style.container}
          keyboardVerticalOffset={Header.HEIGHT + 20}
          behavior="padding"
        >
          <ScrollView style={style.container}>
            <FormLabel>USERNAME</FormLabel>
            <FormInput
              onChangeText={usernameInput => this.setState({ username: usernameInput })}
              value={username}
              autoCapitalize="none"
              inputStyle={style.input}
              onBlur={async () => {
                this.setState({
                  usernameError: await validate('username', username),
                });
              }}
            />
            <FormValidationMessage labelStyle={style.errorMsg}>
              {usernameError}
            </FormValidationMessage>

            <FormLabel>EMAIL</FormLabel>
            <FormInput
              onChangeText={emailInput => this.setState({ email: emailInput })}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              inputStyle={style.input}
              onBlur={async () => {
                this.setState({
                  emailError: await validate('email', email),
                });
              }}
            />
            <FormValidationMessage labelStyle={style.errorMsg}>
              {emailError}
            </FormValidationMessage>

            <FormLabel>PASSWORD</FormLabel>
            <FormInput
              onChangeText={passwordInput => this.setState({ password: passwordInput })}
              value={password}
              secureTextEntry
              autoCapitalize="none"
              placeholder="••••••••"
              placeholderTextColor="gray"
              inputStyle={style.input}
              onBlur={async () => {
                this.setState({
                  passwordError: await validate('password', password),
                });
              }}
            />
            <FormValidationMessage labelStyle={style.errorMsg}>
              {passwordError}
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
                this.setState({ genderError: await validate('gender', value) });
              }}
              hideDoneBar
            >
              <FormInput
                placeholder="Select your gender..."
                placeholderTextColor="gray"
                value={gender}
                inputStyle={style.input}
              />
            </PickerSelect>
            <FormValidationMessage labelStyle={style.errorMsg}>
              {genderError}
            </FormValidationMessage>

            <FormLabel>WEIGHT (KG)</FormLabel>
            <FormInput
              onChangeText={weightKgInput => this.setState({ weightKg: weightKgInput })}
              value={weightKg}
              keyboardType="decimal-pad"
              inputAccessoryViewID="accessoryView"
              inputStyle={style.input}
              onBlur={async () => {
                this.setState({
                  weightKgError: await validate('weightKg', weightKg),
                });
              }}
            />
            <FormValidationMessage labelStyle={style.errorMsg}>
              {weightKgError}
            </FormValidationMessage>

            {Platform.OS === 'ios' ? iosAccessoryView : null}
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
              <CheckBox
                center
                checkedColor="green"
                unCheckedColor="gray"
                containerStyle={style.eulaCheckbox}
                checked={agreedToEULA}
                onPress={() => this.setState({ agreedToEULA: !agreedToEULA })}
              />
              <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                <Text style={style.defaultText}>I agree to the Terms and Conditions.</Text>
              </View>
            </View>

            <Button
              onPress={this.signUp}
              containerViewStyle={style.button}
              rounded
              raised
              title="Sign Up"
              backgroundColor={colors.accent}
            />
            <Button
              onPress={() => navigation.navigate('Legal')}
              containerViewStyle={style.button}
              rounded
              raised
              title="View Terms and Conditions"
              backgroundColor={colors.secondary}
            />
            <DropdownAlert ref={(ref) => {
              this.dropdown = ref;
            }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }
}

SignupScreen.propTypes = {
  navigation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
