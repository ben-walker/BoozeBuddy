import React from 'react';
import {
  InputAccessoryView,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  AsyncStorage,
} from 'react-native';
import {
  FormLabel,
  FormInput,
} from 'react-native-elements';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      gender: '',
      weightKg: '',
    }
    this.signUp = this.signUp.bind(this)
  }

  async signUp() {
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

  render() {
    return (
      <KeyboardAvoidingView
        behavior='position'
        keyboardVerticalOffset={65}
      >
        <FormLabel>USERNAME</FormLabel>
        <FormInput
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          autoCapitalize='none'
        />

        <FormLabel>EMAIL</FormLabel>
        <FormInput
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <FormLabel>PASSWORD</FormLabel>
        <FormInput
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          secureTextEntry
          autoCapitalize='none'
          placeholder='••••••••'
        />

        <FormLabel>GENDER</FormLabel>
        <FormInput
          onChangeText={(gender) => this.setState({gender})}
          value={this.state.gender}
          placeholder='Male, Female, Other'
        />

        <FormLabel>WEIGHT (KG)</FormLabel>
        <FormInput
          onChangeText={(weightKg) => this.setState({weightKg})}
          value={this.state.weightKg}
          keyboardType='decimal-pad'
          inputAccessoryViewID='accessoryView'
        />

        <InputAccessoryView nativeID='accessoryView'>
          <Button
            title='Done'
            onPress={Keyboard.dismiss}
          />
        </InputAccessoryView>

        <Button
          title='Sign Up'
          onPress={this.signUp}
        />
      </KeyboardAvoidingView>
    );
  }
}
