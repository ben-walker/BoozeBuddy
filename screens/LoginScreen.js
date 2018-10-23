import React from 'react';
import {
  View,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  Button,
} from 'react-native-elements';
import colors from '../constants/Colors';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      password: '',
    }
    this.login = this.login.bind(this);
  }

  async login() {
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

    await AsyncStorage.setItem('userData', JSON.stringify(response.user));
    this.props.navigation.navigate('App');
  }

  render() {
    return (
      <View>
        <FormLabel>IDENTIFIER</FormLabel>
        <FormInput
          placeholder='Username or Email'
          onChangeText={(identifier) => this.setState({identifier})}
          value={this.state.identifier}
        />

        <FormLabel>PASSWORD</FormLabel>
        <FormInput
          placeholder="••••••••"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />

        <Button
          style={styles.button}
          rounded
          title='Log In'
          backgroundColor={colors.actionButton}
          onPress={this.login}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: '50%',
    padding: 15,
  },
});
