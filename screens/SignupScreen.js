import React from 'react';
import {
    InputAccessoryView,
    Keyboard,
    AsyncStorage,
    StyleSheet,
    ScrollView,
    Button as RawButton,
    Platform,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
} from 'react-native-elements';
import validate from '../utilities/validateWrapper';
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
      weightKg: '',
      weightKgError: '',
    }
    this.signUp = this.signUp.bind(this)
  }

    async signUp() {
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

        this.setState({
            usernameError,
            emailError,
            passwordError,
            weightKgError,
        });

        return new Promise((resolve) => {
            resolve(!usernameError && !emailError && !passwordError && !weightKgError);
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
            <ScrollView style={styles.container}>
                <FormLabel>USERNAME</FormLabel>
                <FormInput
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    autoCapitalize='none'
                    inputStyle={styles.input}
                    onBlur={async () => {
                        this.setState({
                            usernameError: await validate('username', this.state.username),
                        })
                    }}
                />
                <FormValidationMessage>
                    {this.state.usernameError}
                </FormValidationMessage>

                <FormLabel>EMAIL</FormLabel>
                <FormInput
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    inputStyle={styles.input}
                    onBlur={async () => {
                        this.setState({
                            emailError: await validate('email', this.state.email),
                        })
                    }}
                />
                <FormValidationMessage>
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
                    inputStyle={styles.input}
                    onBlur={async () => {
                        this.setState({
                            passwordError: await validate('password', this.state.password),
                        })
                    }}
                />
                <FormValidationMessage>
                    {this.state.passwordError}
                </FormValidationMessage>

                <FormLabel>GENDER</FormLabel>
                <FormInput
                    onChangeText={(gender) => this.setState({gender})}
                    value={this.state.gender}
                    placeholder='Male, Female, Other'
                    placeholderTextColor='gray'
                    inputStyle={styles.input}
                />

                <FormLabel>WEIGHT (KG)</FormLabel>
                <FormInput
                    onChangeText={(weightKg) => this.setState({weightKg})}
                    value={this.state.weightKg}
                    keyboardType='decimal-pad'
                    inputAccessoryViewID='accessoryView'
                    inputStyle={styles.input}
                    onBlur={async () => {
                        this.setState({
                            weightKgError: await validate('weightKg', this.state.weightKg),
                        })
                    }}
                />
                <FormValidationMessage>
                    {this.state.weightKgError}
                </FormValidationMessage>

                {Platform.OS === 'ios' ? iosAccessoryView : null}

                <Button
                    onPress={this.signUp}
                    style={styles.button}
                    rounded
                    title='Sign Up'
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
    input: {
        color: 'white'
    },
    button: {
        padding: 5
    },
    contentContainer: {
        marginTop: 10,
        marginBottom:20,
        alignItems: 'center',
        backgroundColor:colour.secondary
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
