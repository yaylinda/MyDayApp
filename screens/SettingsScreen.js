import React, { Component } from 'react';
import { Container, View, Text, Button, Content } from 'native-base';
import { AsyncStorage } from 'react-native';
import { NavigationEvents } from 'react-navigation';

export default class SettingsScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Content padder style={{ flex: 1, backgroundColor: '#282833' }}>
                <NavigationEvents
                    onWillFocus={payload => console.log('will focus - SettingsScreen')}
                    onDidFocus={payload => console.log('did focus - SettingsScreen')}
                    onWillBlur={payload => console.log('will blur - SettingsScreen')}
                    onDidBlur={payload => console.log('did blur - SettingsScreen')}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#52e3c2' }}>Settings</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Button transparent onPress={() => this.signOut()}>
                        <Text>Sign Out</Text>
                    </Button>
                </View>
            </Content>
        );
    }

    async signOut() {
        await AsyncStorage.setItem('sessionToken', '');
        this.props.navigation.navigate('Auth');
    }
}