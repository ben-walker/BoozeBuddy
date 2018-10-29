import React from 'react';
import {
    AsyncStorage,
    ScrollView,
} from 'react-native';
import { Button } from 'react-native-elements';
import {
    FormLabel,
    FormInput,
    FormValidationMessage,
} from 'react-native-elements';
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
        <ScrollView style={style.container}>
            <FormLabel>IDENTIFIER</FormLabel>
            <FormInput
                placeholder='Username or Email'
                placeholderTextColor='gray'
                onChangeText={(identifier) => this.setState({identifier})}
                value={this.state.identifier}
                textContentType='username'
                autoCapitalize='none'
                inputStyle={style.input}
                onBlur={async () => {
                    this.setState({
                        identifierError: await validate('identifier', this.state.identifier),
                    })
                }}
            />
            <FormValidationMessage labelStyle={style.errorMsg}>
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
                inputStyle={style.input}
                onBlur={async () => {
                    this.setState({
                        passwordError: await validate('loginPassword', this.state.password),
                    })
                }}
            />
            <FormValidationMessage labelStyle={style.errorMsg}>
                {this.state.passwordError}
            </FormValidationMessage>

            <Button
                onPress={this.logIn}
                style={style.button}
                rounded
                title='Log In'
                backgroundColor={colors.accent}
            />
        </ScrollView>
    );
  }
}
