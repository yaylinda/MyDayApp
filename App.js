import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { Component } from 'react';
import {
  Content,
  Container,
  Left,
  Right,
  Body,
  Header,
  Title,
  Text,
  Footer
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';

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
        <Container style={{flex: 1, backgroundColor: '#282833'}}>
          <Header style={{backgroundColor: '#282833'}}>
            <Text style={{fontSize: 24, color: 'white'}}>My Day</Text>
          </Header>
          <AppNavigator />
          <Footer style={{backgroundColor: '#282833'}}>
          </Footer>
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

/**
 * --atom-red: #ff4495;
    --atom-green: #52e3c2;
    --atom-blue: #0781ff;
    --atom-purple: #d211fe;
    --atom-bright-orange: #ff4b12;
    --atom-yellow: #ffd900;
    --atom-orange: #ed8a19;
    --atom-light-blue: #40c4ff;
    --atom-gray: #546e7a;
    --atom-brand-0: #1a1a21;
    --atom-brand-1: #282833;
    --atom-brand-2: #32323e;
    --atom-brand-3: #393945;
    --atom-brand-4: #40424f;
    --atom-brand-5: #4d505f;
    --atom-brand-6: #6e7288;
    --atom-brand-7: #8f94ab;
    --atom-brand-8: #b4b8cd;
    --atom-contrast: #fff;
 */
