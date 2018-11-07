import React from 'react';
import {
  AsyncStorage,
  ScrollView,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }

    static navigationOptions = {
      title: 'Settings',
      headerTintColor: colors.defaultText,
      headerStyle: { backgroundColor: colors.dark },
    };

    async logOut() {
      await fetch('https://dr-robotnik.herokuapp.com/api/logOut', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      await AsyncStorage.removeItem('userToken');
      this.props.navigation.navigate('Auth');
    }

    render() {
      return (
        <View style={style.container}>
          <ScrollView style={style.container}>

            <Button
              onPress={this.logOut}
              style={style.button}
              rounded
              title="Log Out"
              backgroundColor={colors.errorBackground}
            />
          </ScrollView>
        </View>

      );
    }
}
