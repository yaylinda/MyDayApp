import React from 'react';
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
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const AppStack = createBottomTabNavigator(
  {
    Day: {
      screen: DayScreen,
      navigationOptions: {
        tabBarLabel: 'Day',
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={
              Platform.OS === 'ios'
                ? `ios-sunny`
                : 'md-sunny'
            }
            size={26}
            style={{ marginBottom: -3 }}
            color={focused ? '#52e3c2' : 'white'}
          />
        ),
      }
    },
    Catalog: {
      screen: CatalogScreen,
      navigationOptions: {
        tabBarLabel: 'Catalog',
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={
              Platform.OS === 'ios'
                ? `ios-list`
                : 'md-list'
            }
            size={26}
            style={{ marginBottom: -3 }}
            color={focused ? '#52e3c2' : 'white'}
          />
        ),
      }
    },
    Stats: {
      screen: StatisticsScreen,
      navigationOptions: {
        tabBarLabel: 'Statistics',
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={
              Platform.OS === 'ios'
                ? `ios-stats`
                : 'md-stats'
            }
            size={26}
            style={{ marginBottom: -3 }}
            color={focused ? '#52e3c2' : 'white'}
          />
        ),
      }
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={
              Platform.OS === 'ios'
                ? `ios-settings`
                : 'md-settings'
            }
            size={26}
            style={{ marginBottom: -3 }}
            color={focused ? '#52e3c2' : 'white'}
          />
        ),
      }
    }
  },
  {
    initialRouteName: 'Day',
    tabBarOptions: {
      activeTintColor: '#52e3c2',
      inactiveTintColor: 'white',
      style: {
        backgroundColor: '#282833',
        borderTopColor: '#6e7288',
        borderTopWidth: 1
      },
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
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);