import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import colour from '../constants/Colors';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CustomDrinkScreen from '../screens/CustomDrinkScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LegalScreen from '../screens/LegalScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MemoryGameScreen from '../screens/MemoryGameScreen'

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

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

const ProfileStackTabIcon = ({ focused }) => (
  <TabBarIcon
    focused={focused}
    name={Platform.OS === 'ios' ? `ios-person${focused ? '' : '-outline'}` : 'md-person'}
  />
);
ProfileStackTabIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ProfileStackTabIcon,
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

const HistoryStack = createStackNavigator({
    History: HistoryScreen,
});

const HistoryStackTabIcon = ({ focused }) => (
    <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios' ? `ios-clock${focused ? '' : '-outline'}` : 'md-clock'}
    />
);
HistoryStackTabIcon.propTypes = {
    focused: PropTypes.bool.isRequired,
};

HistoryStack.navigationOptions = {
    tabBarLabel: 'History',
    tabBarIcon: HistoryStackTabIcon,
    tabBarOptions: {
        style: {
            backgroundColor: colour.dark,
        },
    },
};

const GameStack = createStackNavigator({
  Memory: MemoryGameScreen,
});

const GameStackTabIcon = ({ focused }) => (
  <TabBarIcon
    focused={focused}
    name={Platform.OS === 'ios' ? `ios-game-controller-b${focused ? '' : '-outline'}` : 'md-game-controller-b'}
  />
);
GameStackTabIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
};

GameStack.navigationOptions = {
  tabBarLabel: 'Games',
  tabBarIcon: GameStackTabIcon,
  tabBarOptions: {
    style: {
      backgroundColor: colour.dark,
    },
  },
};

export default createBottomTabNavigator({
  HomeStack,
    HistoryStack,
  LegalStack,
  ProfileStack,
  GameStack,
});
