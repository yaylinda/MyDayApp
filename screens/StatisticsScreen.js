import React, { Component } from 'react';
import { Container, View, Text, Content } from 'native-base';

export default class StatisticsScreen extends Component {
    
    render() {
        return (
            <Content style={{ flex: 1, backgroundColor: '#282833' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#52e3c2' }}>Statistics</Text>
                </View>
            </Content>
        );
    }
}