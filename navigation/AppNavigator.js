import { createSwitchNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import AuthenticationNavigator from './AuthenticationNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

export default createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Auth: AuthenticationNavigator,
  App: MainTabNavigator,
}, { initialRouteName: 'AuthLoading' });
