import React from 'react';
import {
  KeyboardAvoidingView,
  AsyncStorage,
  Button,
} from 'react-native';
import {
  FormLabel,
  FormInput,
} from 'react-native-elements';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      password: '',
    }
    this.logIn = this.logIn.bind(this);
  }

  async logIn() {
    const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/logIn', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: this.state.identifier,
        password: this.state.password,
      })
    });
    
    if (!rawResponse.ok) return alert("Credentials not recognized.");
    const response = await rawResponse.json();

    await AsyncStorage.setItem('userToken', JSON.stringify(response.user));
    this.props.navigation.navigate('App');
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior='position'
        keyboardVerticalOffset={65}
      >
        <FormLabel>IDENTIFIER</FormLabel>
        <FormInput
          placeholder='Username or Email'
          onChangeText={(identifier) => this.setState({identifier})}
          value={this.state.identifier}
          textContentType='username'
          autoCapitalize='none'
        />

        <FormLabel>PASSWORD</FormLabel>
        <FormInput
          placeholder="••••••••"
          secureTextEntry
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          textContentType='password'
          autoCapitalize='none'
        />

        <Button
          title='Log In'
          onPress={this.logIn}
        />
      </KeyboardAvoidingView>
    );
  }
}
