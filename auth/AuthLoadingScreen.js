import React, { Component }  from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { getUserFromSessionToken } from '../api/APIService';

export class AuthLoadingScreen extends Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    let username;

    if (sessionToken) {
      console.log(`[AuthLoadingScreen] sessionToken=${sessionToken}, getting user...`);
      let user = await getUserFromSessionToken(sessionToken).then((user) => {
        username = user.username;
        console.log(`[AuthLoadingScreen] got user, username=${username}`);
      }).catch((error) => {
        console.log(`[AuthLoadingScreen]`, error.message);
      });
    } else {
      console.log(`[AuthLoadingScreen] sessionToken does not exist... going to login screen...`);
    }

    console.log('[AuthLoadingScreen]... here...');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (username) {
      this.props.navigation.navigate('App', {
        username: username
      });
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}