import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { Component } from 'react';
import {
  Container} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { HOST, COLORS } from './util/Constants';
import AppNavigator from './navigation/AppNavigator';

console.disableYellowBox = true;

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  render() {
    if (!this.state.isReady && !this.props.skipLoadingScreen) {
      return <AppLoading />;
    } else {
      return (
        <Container style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN }}>
          <AppNavigator />
        </Container>
      );
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }
}
