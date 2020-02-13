import React, { Component } from 'react';
import {
  AsyncStorage, Alert
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
      loginSuccessful: false,
      isDisabled: true,
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
            <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Username</Label>
            <Input 
              style={{ color: 'white' }} 
              autoCapitalize='none' 
              onChangeText={username => this.onUsernameInputChange(username)} 
            />
          </Item>
          <Item floatingLabel>
            <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Password</Label>
            <Input 
              style={{ color: 'white' }} 
              secureTextEntry={true} 
              autoCapitalize='none' 
              onChangeText={password => this.onPasswordInputChange(password)} 
            />
          </Item>
        </Form>
        <Button 
          disabled={ this.state.isDisabled } 
          style={ this.state.isDisabled 
            ? { backgroundColor: '#52e3c2', justifyContent: 'center', opacity: 0.5 } 
            : { backgroundColor: '#52e3c2', justifyContent: 'center' }} 
          onPress={() => this.signIn()}
        >
          <Text> Sign In </Text>
        </Button>
        <Button 
          transparent 
          style={{ justifyContent: 'center' }} 
          onPress={() => this.goToRegisterScreen()}
        >
          <Text style={{color: '#ff4495'}}> Go To Register </Text>
        </Button>
      </Container>
    );
  }

  onUsernameInputChange(username) {
    this.setState({ 
      username: username,
      isDisabled: username.length === 0 || this.state.password.length === 0
     });
  }

  onPasswordInputChange(password) {
    this.setState({ 
      password: password,
      isDisabled: this.state.username.length === 0 || password.length === 0
     });
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
        this.state = {
          username: '',
          password: '',
          errorMessage: '',
          loginSuccessful: false
        }
        this.props.navigation.navigate('App');
      } else {
        console.log(`[SignInScreen] login error message: ${json.message}`);
        this.errorMessage = json.message;
        Alert.alert('Error', this.errorMessage);
      }
    });

  }

  goToRegisterScreen() {
    this.props.navigation.navigate('Register');
  }
}