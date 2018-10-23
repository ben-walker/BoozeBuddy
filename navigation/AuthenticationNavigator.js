import { createStackNavigator } from 'react-navigation';
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

export default LoginStack;
