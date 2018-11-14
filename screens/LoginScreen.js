import React from 'react';
import {
  AsyncStorage,
  ScrollView,
} from 'react-native';
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';
import DropdownAlert from 'react-native-dropdownalert';
import validate from '../utilities/validateWrapper';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';

export default class LoginScreen extends React.Component {
    static navigationOptions = {
      title: 'Booze Buddy Login',
      headerTintColor: colors.defaultText,
      headerStyle: { backgroundColor: colors.dark },
    };

    constructor(props) {
      super(props);
      this.state = {
        identifier: '',
        identifierError: '',
        password: '',
        passwordError: '',
      };
    }

    logIn = async () => {
      const {
        identifier,
        password,
      } = this.state;
      const { navigation } = this.props;
      if (!await this.isValid()) return;
      const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/logIn', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      if (!rawResponse.ok) {
        this.dropdown.alertWithType('error', 'Error', 'Credentials not recognized.');
        return;
      }
      const response = await rawResponse.json();

      await AsyncStorage.setItem('userToken', JSON.stringify(response.user));
      navigation.navigate('App');
    }

    async isValid() {
      const {
        identifier,
        password,
      } = this.state;
      const identifierError = await validate('identifier', identifier);
      const passwordError = await validate('loginPassword', password);

      this.setState({
        identifierError,
        passwordError,
      });

      return new Promise((resolve) => {
        resolve(!identifierError && !passwordError);
      });
    }

    render() {
      const {
        identifier,
        identifierError,
        password,
        passwordError,
      } = this.state;
      return (
        <ScrollView style={style.container}>
          <FormLabel>IDENTIFIER</FormLabel>
          <FormInput
            placeholder="Username or Email"
            placeholderTextColor="gray"
            onChangeText={identifierInput => this.setState({ identifier: identifierInput })}
            value={identifier}
            textContentType="username"
            autoCapitalize="none"
            inputStyle={style.input}
            onBlur={async () => {
              this.setState({
                identifierError: await validate('identifier', identifier),
              });
            }}
          />
          <FormValidationMessage labelStyle={style.errorMsg}>
            {identifierError}
          </FormValidationMessage>

          <FormLabel>PASSWORD</FormLabel>
          <FormInput
            placeholder="••••••••"
            placeholderTextColor="gray"
            secureTextEntry
            onChangeText={passwordInput => this.setState({ password: passwordInput })}
            value={password}
            textContentType="password"
            autoCapitalize="none"
            inputStyle={style.input}
            onBlur={async () => {
              this.setState({
                passwordError: await validate('loginPassword', password),
              });
            }}
          />
          <FormValidationMessage labelStyle={style.errorMsg}>
            {passwordError}
          </FormValidationMessage>

          <Button
            onPress={this.logIn}
            containerViewStyle={style.button}
            rounded
            raised
            title="Log In"
            backgroundColor={colors.accent}
          />
          <DropdownAlert ref={(ref) => { this.dropdown = ref; }} />
        </ScrollView>
      );
    }
}
