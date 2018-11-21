import React from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
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
