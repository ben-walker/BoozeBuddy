import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const LoginStack = createStackNavigator({
    Splash: SplashScreen,
    Signup: SignupScreen,
    Login: LoginScreen,
  },
  {
    initialRouteName: 'Splash',
  }
);

export default createSwitchNavigator({
  LoginStack,
});
