import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { AuthLoadingScreen } from '../auth/AuthLoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../auth/SignInScreen';
import RegisterScreen from '../auth/RegisterScreen';
import { createStackNavigator } from 'react-navigation-stack';
import DayScreen from '../screens/DayScreen';
import CatalogScreen from '../screens/CatalogScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { createBottomTabNavigator } from 'react-navigation-tabs';

const AppStack = createBottomTabNavigator(
  {
    Day: {
      screen: DayScreen
    },
    Catalog: CatalogScreen,
    Stats: StatisticsScreen,
    Settings: SettingsScreen
  },
  {
    initialRouteName: 'Day',
    defaultNavigationOptions: {

    }
  },
  );

const AuthStack = createSwitchNavigator(
  {
    SignIn: SignInScreen,
    Register: RegisterScreen
  },
  {
    initialRouteName: 'SignIn'
  });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: createStackNavigator({ AppStack: AppStack }),
      Auth: AuthStack
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);