import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform, StatusBar, View,
} from 'react-native';
import {
  AppLoading, Asset, Font, Icon,
} from 'expo';
import styles from './constants/StyleSheet';
import AppNavigator from './navigation/AppNavigator';
import * as robotDev from './assets/images/robot-dev.png';
import * as robotProd from './assets/images/robot-prod.png';
import * as spaceMono from './assets/fonts/SpaceMono-Regular.ttf';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  loadResourcesAsync = async () => Promise.all([
    Asset.loadAsync([
      robotDev.default,
      robotProd.default,
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Icon.Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free
      // to remove this if you are not using it in your app
      'space-mono': spaceMono.default,
    }),
  ]);

  handleLoadingError = (/* error */) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    const { isLoadingComplete } = this.state;
    const { skipLoadingScreen } = this.props;
    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }
    return (
      <View style={styles.appContainer}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

App.defaultProps = {
  skipLoadingScreen: null,
};

App.propTypes = {
  skipLoadingScreen: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
