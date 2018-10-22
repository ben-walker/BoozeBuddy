import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  Button,
  Text
} from 'react-native-elements';
import colors from '../constants/Colors';

export default class LoginScreen extends React.Component {
  render() {
    return (
      <View>
        <Text> This sign-up page will be implemented for the Alpha. </Text>
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
