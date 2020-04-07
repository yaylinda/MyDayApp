import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { AuthLoadingScreen } from '../auth/AuthLoadingScreen';
import SignInScreen from '../auth/SignInScreen';
import RegisterScreen from '../auth/RegisterScreen';
import DayScreen from '../screens/DayScreen';
import CatalogScreen from '../screens/CatalogScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../util/Constants';
import { createStackNavigator } from 'react-navigation-stack';
import CatalogFormScreen from '../screens/CatalogFormScreen';

const DayStack = createStackNavigator(
  {
    DayList: {
      screen: DayScreen,
      navigationOptions: {
        headerStyle: {
          backgroundColor: COLORS.BACKGROUND_MAIN,
          borderBottomWidth: 0,
          height: 0
        },
      }
    },
    CatalogForm: {
      screen: CatalogFormScreen,
      navigationOptions: {
        title: 'Add to Catalog',
        headerStyle: {
          backgroundColor: COLORS.BACKGROUND_MAIN,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '900',
          color: COLORS.TEXT_MAIN,
        },
      }
    }
  },
  {
    initialRouteName: "DayList",
  }
);

const CatalogStack = createStackNavigator(
  {
    CatalogList: {
      screen: CatalogScreen,
      navigationOptions: {
        title: 'Catalog',
        headerStyle: {
          backgroundColor: COLORS.BACKGROUND_MAIN,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '900',
          color: COLORS.TEXT_MAIN,
        },
      }
    },
    CatalogForm: {
      screen: CatalogFormScreen,
      navigationOptions: {
        title: 'Add to Catalog',
        headerStyle: {
          backgroundColor: COLORS.BACKGROUND_MAIN,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '900',
          color: COLORS.TEXT_MAIN,
        },
      }
    }
  },
  {
    initialRouteName: "CatalogList",
  }
);

const StatisticsStack = createStackNavigator(
  {
    StatisticsPage: {
      screen: StatisticsScreen,
      navigationOptions: {
        title: 'Tiles & Stats',
        headerStyle: {
          backgroundColor: COLORS.BACKGROUND_MAIN,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '900',
          color: COLORS.TEXT_MAIN,
        },
      }
    }
  },
  {
    initialRouteName: "StatisticsPage",
  }
);

const SettingsStack = createStackNavigator(
  {
    SettingsPage: {
      screen: SettingsScreen,
      navigationOptions: {
        title: 'Settings',
        headerStyle: {
          backgroundColor: COLORS.BACKGROUND_MAIN,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '900',
          color: COLORS.TEXT_MAIN,
        },
      }
    }
  }
);

const AppStack = createBottomTabNavigator(
  {
    Day: {
      screen: DayStack,
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
      screen: CatalogStack,
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
      screen: StatisticsStack,
      navigationOptions: {
        tabBarLabel: 'Tiles & Stats',
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
      screen: SettingsStack,
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
        backgroundColor: COLORS.BACKGROUND_MAIN,
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