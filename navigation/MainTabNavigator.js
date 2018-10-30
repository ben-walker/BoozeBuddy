import React from 'react';
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

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  ),
    tabBarOptions: {
        style: {
            backgroundColor: colour.dark,
        }
    }
};



const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
    tabBarOptions: {
        style: {
            backgroundColor: colour.dark,
        }
    }
};

const LegalStack = createStackNavigator({
  Legal: LegalScreen,
});

LegalStack.navigationOptions = {
  tabBarLabel: 'Legal',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
    tabBarOptions: {
        style: {
            backgroundColor: colour.dark,
        }
    }
};

export default createBottomTabNavigator({
  HomeStack,
  LegalStack,
  SettingsStack,
});
