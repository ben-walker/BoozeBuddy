import React from 'react';
import {
  AsyncStorage,
  ScrollView,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';

export default class HistoryScreen extends React.Component {
  static navigationOptions = {
    title: 'History',
    headerTintColor: colors.defaultText,
    headerStyle: { backgroundColor: colors.dark },
  };

  render() {
    return (
      <View style={style.container}>
        <ScrollView style={style.container} />
      </View>
    );
  }
}
