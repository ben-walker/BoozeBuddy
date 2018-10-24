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

export default class SplashScreen extends React.Component {
    static navigationOptions = {
        header:null
    };

    render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1 , flexDirection:'column'}}>
          <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.titleText}> Booze Buddy </Text>
          </View>
          <View style={{flex: 2, flexDirection:'column', justifyContent: "space-around"}}>
            <View>
              <Button
                style={styles.button}
                rounded
                title='Sign Up'
                backgroundColor={colors.actionButton}
                onPress={() => this.props.navigation.navigate('Signup')}
                />
            </View>
            <View>
              <Button
                style={styles.button}
                rounded
                title='Log In'
                backgroundColor={colors.actionButton}
                onPress={() => this.props.navigation.navigate('Login')}
                />
            </View>
          </View>
          <View style={{flex: 1}}>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: '50%',
    padding: 15,
  },
  container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 22
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.defaultText,
  },
});
