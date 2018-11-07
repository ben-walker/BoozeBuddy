import React from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import terms from '../constants/TermsAndConditions';

export default class LegalScreen extends React.Component {
    static navigationOptions = {
      title: 'Terms and Conditions',
      headerTintColor: colors.defaultText,
      headerStyle: { backgroundColor: colors.dark },
    };

    render() {
      return (
        <View style={style.container}>
          <ScrollView style={style.contentContainer}>
            <Text style={style.defaultText}>
              {terms}
            </Text>
          </ScrollView>
        </View>
      );
    }
}
