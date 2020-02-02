import React, { Component } from 'react';
import {
  AsyncStorage
} from 'react-native';
import {
  Container,
  Form,
  Label,
  Item,
  Input,
  Text,
  Button,
  View
} from 'native-base';
import { HOST, COLORS } from '../util/Constants';

export default class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign In',
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
      loginSuccessful: false
    }
  }

  render() {
    return (
      <Container style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN, padding: 20 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30}}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#52e3c2' }}>Sign In</Text>
        </View>

        <Form style={{ marginBottom: 20 }}>
          <Item floatingLabel>
            <Label style={{ color: 'white' }}>Username</Label>
            <Input style={{ color: 'white' }} autoCapitalize='none' onChangeText={username => this.onUsernameInputChange(username)} />
          </Item>
          <Item floatingLabel>
            <Label style={{ color: 'white' }}>Password</Label>
            <Input style={{ color: 'white' }} autoCapitalize='none' onChangeText={password => this.onPasswordInputChange(password)} />
          </Item>
        </Form>
        <Button style={{ backgroundColor: '#52e3c2', justifyContent: 'center' }} onPress={() => this.signIn()}><Text> Sign In </Text></Button>
        <Button transparent style={{ justifyContent: 'center' }} onPress={() => this.goToRegisterScreen()}><Text style={{color: '#ff4495'}}> Go To Register </Text></Button>
      </Container>
    );
  }

  onUsernameInputChange(username) {
    this.state.username = username;
  }

  onPasswordInputChange(password) {
    this.state.password = password;
  }

  async signIn() {
    console.log(`[SignInScreen] signing in with username=${this.state.username}, password=${this.state.password}`);

    const endpoint = `${HOST}/users/login`;
    console.log(`[SignInScreen] calling ${endpoint}`);

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    }).then((response) => {
      if (response.ok) {
        console.log(`[SignInScreen] successfully logged in`);
        this.loginSuccessful = true;
      } else {
        console.log(`[SignInScreen] error logging in`);
        this.loginSuccessful = false;
      }
      return response.json();
    }).then((json) => {
      console.log(`[SignInScreen] json: ${JSON.stringify(json)}`);
      if (this.loginSuccessful) {
        console.log(`[SignInScreen] sessionToken: ${json.sessionToken}`);
        AsyncStorage.setItem('sessionToken', json.sessionToken);
        this.props.navigation.navigate('App');
      } else {
        console.log(`[SignInScreen] login error message: ${json.message}`);
        this.errorMessage = json.message;
        // TODO - show error message on screen
      }
    });
  }

  goToRegisterScreen() {
    this.props.navigation.navigate('Register');
  }
}