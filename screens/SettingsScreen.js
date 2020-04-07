import React, { Component } from 'react';
import { View, Text, Button, Content } from 'native-base';
import { AsyncStorage } from 'react-native';
import { COLORS } from '../util/Constants';

export default class SettingsScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Content padder style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN }}>
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