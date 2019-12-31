import React, { Component } from 'react';
import { Container, View, Text, Button } from 'native-base';
import { AsyncStorage } from 'react-native';

export default class SettingsScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#282833' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#52e3c2' }}>Settings</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Button transparent onPress={() => this.signOut()}>
                        <Text>Sign Out</Text>
                    </Button>
                </View>
            </Container>
        );
    }

    async signOut() {
        await AsyncStorage.setItem('sessionToken', '');
    }
}