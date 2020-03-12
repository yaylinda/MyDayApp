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

export default class RegisterScreen extends Component {
  static navigationOptions = {
    title: 'Register',
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordConf: '',
      errorMessage: '',
      loginSuccessful: false,
      isDisabled: true,
    }
  }

  render() {
    return (
      <Container style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN, padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#52e3c2' }}>Register</Text>
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
          <Item floatingLabel>
            <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Confirm Password</Label>
            <Input
              style={{ color: 'white' }}
              secureTextEntry={true}
              autoCapitalize='none'
              onChangeText={passwordConf => this.onPasswordConfInputChange(passwordConf)}
            />
          </Item>
        </Form>
        <Button
          disabled={this.state.isDisabled}
          style={this.state.isDisabled
            ? { backgroundColor: '#52e3c2', justifyContent: 'center', opacity: 0.5 }
            : { backgroundColor: '#52e3c2', justifyContent: 'center' }}
          onPress={() => this.register()}
        >
          <Text> Register </Text>
        </Button>
        <Button
          transparent
          style={{ justifyContent: 'center' }}
          onPress={() => this.goToSignInScreen()}
        >
          <Text style={{ color: '#ff4495' }}> Go To Sign In </Text>
        </Button>
      </Container>
    );
  }

  onUsernameInputChange(username) {
    this.setState({
      username: username,
      isDisabled: username.length === 0 || this.state.password.length === 0 || this.state.passwordConf.length === 0
    });
  }

  onPasswordInputChange(password) {
    this.setState({
      password: password,
      isDisabled: this.state.username.length === 0 || password.length === 0 || this.state.passwordConf.length === 0
    });
  }

  onPasswordConfInputChange(passwordConf) {
    this.setState({
      passwordConf: passwordConf,
      isDisabled: this.state.username.length === 0 || this.state.password.length === 0 || passwordConf.length === 0
    });
  }

  async register() {
    console.log(`[RegisterScreen] registering with username=${this.state.username}, password=${this.state.password}`);

    const endpoint = `${HOST}/users/register`;
    console.log(`[RegisterScreen] calling ${endpoint}`);

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    }).then((response) => {
      if (response.ok) {
        console.log(`[RegisterScreen] successfully registered`);
        this.loginSuccessful = true;
      } else {
        console.log(`[RegisterScreen] error registering`);
        this.loginSuccessful = false;
      }
      return response.json();
    }).then((json) => {
      console.log(`[RegisterScreen] json: ${JSON.stringify(json)}`);
      if (this.loginSuccessful) {
        console.log(`[RegisterScreen] sessionToken: ${json.sessionToken}`);
        AsyncStorage.setItem('sessionToken', json.sessionToken);
        this.state = {
          username: '',
          password: '',
          passwordConf: '',
          errorMessage: '',
          loginSuccessful: false
        }
        this.props.navigation.navigate('App');
      } else {
        console.log(`[RegisterScreen] login error message: ${json.message}`);
        this.errorMessage = json.message;
        Alert.alert('Error', this.errorMessage);
      }
    });
  }

  goToSignInScreen() {
    this.props.navigation.navigate('SignIn');
  }

}