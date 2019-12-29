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
  Button
} from 'native-base';
import { host } from '../util/Constants';

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
      <Container>
        <Form>
          <Item floatingLabel>
            <Label>Username</Label>
            <Input autoCapitalize='none' onChangeText={username => this.onUsernameInputChange(username)} />
          </Item>
          <Item floatingLabel last>
            <Label>Password</Label>
            <Input autoCapitalize='none' onChangeText={password => this.onPasswordInputChange(password)} />
          </Item>
        </Form>
        <Button success onPress={() => this.signIn()}><Text> Sign In </Text></Button>
        <Button success onPress={() => this.goToRegisterScreen()}><Text> Go To Register </Text></Button>
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

    const endpoint = `${host}/users/login`;
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
        this.props.navigation.navigate('Home', {
          username: this.state.username
        });
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