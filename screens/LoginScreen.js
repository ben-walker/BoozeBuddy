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
} from 'react-native-elements';
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
            />

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
            />

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
