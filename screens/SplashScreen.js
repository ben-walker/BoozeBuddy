import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import {
  Button,
  Text,
} from 'react-native-elements';
import style from '../constants/StyleSheet';
import colors from '../constants/Colors';

export default class SplashScreen extends React.Component {
    static navigationOptions = { header: null };

    render() {
      const { navigation } = this.props;
      return (
        <View style={style.container}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={style.titleText}> Booze Buddy </Text>
            </View>
            <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'space-around' }}>
              <Button
                containerViewStyle={style.button}
                rounded
                raised
                title="Sign Up"
                backgroundColor={colors.actionButton}
                onPress={() => navigation.navigate('Signup')}
              />

              <Button
                style={style.button}
                containerViewStyle={style.button}
                rounded
                raised
                title="Log In"
                backgroundColor={colors.actionButton}
                onPress={() => navigation.navigate('Login')}
              />
            </View>
            <View style={{ flex: 1 }} />
          </View>
        </View>
      );
    }
}

SplashScreen.propTypes = {
  navigation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
