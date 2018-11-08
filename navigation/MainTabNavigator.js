import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import colour from '../constants/Colors';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CustomDrinkScreen from '../screens/CustomDrinkScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LegalScreen from '../screens/LegalScreen';
import CalculatorScreen from '../screens/CalculatorScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Calculator: CalculatorScreen,
  CustomDrinks: CustomDrinkScreen,
},
{
  initialRouteName: 'Home',
});

const HomeStackTabIcon = ({ focused }) => (
  <TabBarIcon
    focused={focused}
    name={
      Platform.OS === 'ios'
        ? `ios-home${focused ? '' : '-outline'}`
        : 'md-home'
    }
  />
);
HomeStackTabIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: HomeStackTabIcon,
  tabBarOptions: {
    style: {
      backgroundColor: colour.dark,
    },
  },
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

const SettingsStackTabIcon = ({ focused }) => (
  <TabBarIcon
    focused={focused}
    name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
  />
);
SettingsStackTabIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: SettingsStackTabIcon,
  tabBarOptions: {
    style: {
      backgroundColor: colour.dark,
    },
  },
};

const LegalStack = createStackNavigator({
  Legal: LegalScreen,
});

const LegalStackTabIcon = ({ focused }) => (
  <TabBarIcon
    focused={focused}
    name={
      Platform.OS === 'ios'
        ? `ios-information-circle${focused ? '' : '-outline'}`
        : 'md-information-circle'
    }
  />
);
LegalStackTabIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};

LegalStack.navigationOptions = {
  tabBarLabel: 'Legal',
  tabBarIcon: LegalStackTabIcon,
  tabBarOptions: {
    style: {
      backgroundColor: colour.dark,
    },
  },
};

export default createBottomTabNavigator({
  HomeStack,
  LegalStack,
  SettingsStack,
});
