import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { AuthLoadingScreen } from '../auth/AuthLoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../auth/SignInScreen';
import RegisterScreen from '../auth/RegisterScreen';

// import MainTabNavigator from './MainTabNavigator';

// export default createAppContainer(
//   createSwitchNavigator({
//     // You could add another route here for authentication.
//     // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//     Main: MainTabNavigator,
//   })
// );

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Home: HomeScreen,
      SignIn: SignInScreen,
      Register: RegisterScreen
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);