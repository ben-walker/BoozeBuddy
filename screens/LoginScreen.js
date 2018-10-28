import React from 'react';
import {
    AsyncStorage,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Button } from 'react-native-elements';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';
import validate from '../utilities/validateWrapper';
import colour from "../constants/Colors";

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Booze Buddy Login',
        headerTintColor: colour.defaultText,
        headerStyle: {
            backgroundColor: colour.dark
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            identifier: '',
            identifierError: '',
            password: '',
            passwordError: '',
        }
        this.logIn = this.logIn.bind(this);
    }

  async logIn() {
    if (!await this.isValid()) return;
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

  async isValid() {
      const identifierError = await validate('identifier', this.state.identifier);
      const passwordError = await validate('loginPassword', this.state.password);

      this.setState({
          identifierError,
          passwordError,
      });

      return new Promise((resolve) => {
        resolve(!identifierError && !passwordError);
      });
  }

  render() {
    return (
        <ScrollView style={styles.container}>
            <FormLabel>IDENTIFIER</FormLabel>
            <FormInput
                placeholder='Username or Email'
                placeholderTextColor='gray'
                onChangeText={(identifier) => this.setState({identifier})}
                value={this.state.identifier}
                textContentType='username'
                autoCapitalize='none'
                inputStyle={styles.input}
                onBlur={async () => {
                    this.setState({
                        identifierError: await validate('identifier', this.state.identifier),
                    })
                }}
            />
            <FormValidationMessage labelStyle={styles.errorMsg}>
                {this.state.identifierError}
            </FormValidationMessage>

            <FormLabel>PASSWORD</FormLabel>
            <FormInput
                placeholder="••••••••"
                placeholderTextColor='gray'
                secureTextEntry
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                textContentType='password'
                autoCapitalize='none'
                inputStyle={styles.input}
                onBlur={async () => {
                    this.setState({
                        passwordError: await validate('loginPassword', this.state.password),
                    })
                }}
            />
            <FormValidationMessage labelStyle={styles.errorMsg}>
                {this.state.passwordError}
            </FormValidationMessage>

            <Button
                onPress={this.logIn}
                style={styles.button}
                rounded
                title='Log In'
                backgroundColor={colour.accent}
            />
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colour.background,
        paddingTop: 22
    },
    contentContainer: {
        marginTop: 10,
        marginBottom:20,
        backgroundColor:colour.secondary
    },
    button: {
        padding: 5
    },
    input: {
        color: 'white'
    },
    errorMsg: {
        color: colour.errorText,
    },
    imageIcon:{
        width:100,
        height:80,
        marginTop:3,
        marginLeft: -10,
        resizeMode: "contain"
    },
    defaultText: {
        fontSize: 17,
        color: colour.defaultText,
        lineHeight: 24,
        textAlign: 'center'
    },

});
