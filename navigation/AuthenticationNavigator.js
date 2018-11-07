import { createStackNavigator } from 'react-navigation';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import LegalScreen from '../screens/LegalScreen';

export default createStackNavigator({
  Splash: SplashScreen,
  Signup: SignupScreen,
  Legal: LegalScreen,
  Login: LoginScreen,
}, { initialRouteName: 'Splash' });
