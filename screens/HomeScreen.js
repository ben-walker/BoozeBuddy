import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import * as appIcon from '../assets/images/DrinkIcons/cheers.png';
import concerns from '../constants/HealthCanadaConcerns';

export default class HomeScreen extends React.Component {
    static navigationOptions = { header: null };

    render() {
      const { navigation } = this.props;

      return (
        <View style={style.container}>
          <ScrollView
            style={style.container}
            contentContainerStyle={style.secondaryContentContainer}
          >
            <View style={style.secondaryContentContainer}>
              <Image
                source={appIcon.default}
                style={style.imageIcon}
              />
            </View>

            <Button
              onPress={() => navigation.navigate('Calculator')}
              containerViewStyle={style.button}
              rounded
              raised
              title="Start Drinking"
              backgroundColor={colors.accent}
            />

            <Button
              onPress={() => navigation.navigate('CustomDrinks')}
              containerViewStyle={style.button}
              rounded
              raised
              title="Add Custom Drink"
              backgroundColor={colors.accent}
            />
            <Text style={style.defaultText}>Health Canada Concerns about Alcohol Use</Text>
            <Text style={style.smallText}>{concerns}</Text>
          </ScrollView>
        </View>
      );
    }
}

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
