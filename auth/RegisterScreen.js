import React, { Component } from 'react';

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
              <Item floatingLabel>
                <Label>Password</Label>
                <Input autoCapitalize='none' onChangeText={password => this.onPasswordInputChange(password)} />
              </Item>
              <Item floatingLabel last>
                <Label>Confirm Password</Label>
                <Input autoCapitalize='none' onChangeText={passwordConf => this.onPasswordConfInputChange(passwordConf)} />
              </Item>
            </Form>
            <Button success onPress={() => this.register()}><Text> Register </Text></Button>
            <Button success onPress={() => this.goToRegisterScreen()}><Text> Go To Sign In </Text></Button>
          </Container>
        );
      }

      onUsernameInputChange(username) {
        this.state.username = username;
      }
    
      onPasswordInputChange(password) {
        this.state.password = password;
      }

      onPasswordConfInputChange(passwordConf) {
        this.state.passwordConf = passwordConf;
      }

      async register() {
        console.log(`[RegisterScreen] registering with username=${this.state.username}, password=${this.state.password}`);
    
        const endpoint = `${host}/users/register`;
        console.log(`[RegisterScreen] calling ${endpoint}`);
    
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
            this.props.navigation.navigate('Home', {
              username: this.state.username
            });
          } else {
            console.log(`[RegisterScreen] login error message: ${json.message}`);
            this.errorMessage = json.message;
            // TODO - show error message on screen
          }
        });
      }

      goToSignInScreen() {
        this.props.navigation.navigate('SignIn');
      }

}