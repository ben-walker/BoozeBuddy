import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  Button,
} from 'react-native-elements';
import colors from '../constants/Colors';

export default class LoginScreen extends React.Component {
  render() {
    return (
      <View>
        <FormLabel>IDENTIFIER</FormLabel>
        <FormInput
          placeholder='Username or Email'
        />

        <FormLabel>PASSWORD</FormLabel>
        <FormInput
          placeholder="••••••••"
          secureTextEntry={true}
        />

        <Button
          style={styles.button}
          rounded
          title='Log In'
          backgroundColor={colors.actionButton}
          // Authentication logic should live below.
          onPress={() => this.props.navigation.navigate('App')}
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
