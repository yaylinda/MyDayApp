import React, { Component } from 'react';
import { Container, View, Text, Content, Tabs, Tab, Segment, Button } from 'native-base';

export default class StatisticsScreen extends Component {

    render() {
        return (
            <Content padder style={{ flex: 1, backgroundColor: '#282833' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#52e3c2' }}>Statistics</Text>
                </View>

                <Tabs tabBarUnderlineStyle={{backgroundColor: '#52e3c2'}}>
                    <Tab heading="Summary" 
                        tabStyle={{backgroundColor: '#282833'}} 
                        activeTabStyle={{backgroundColor: '#282833'}}
                        textStyle={{color: 'white'}}
                        activeTextStyle={{color: '#52e3c2'}}
                    >
                        <View style={{backgroundColor: '#282833'}}>
                            <Text>Summary</Text>
                        </View>
                    </Tab>
                    <Tab heading="Scores" 
                        tabStyle={{backgroundColor: '#282833'}} 
                        activeTabStyle={{backgroundColor: '#282833'}}
                        textStyle={{color: 'white'}}
                        activeTextStyle={{color: '#52e3c2'}}
                    >
                        <View style={{backgroundColor: '#282833'}}>
                            <Text>Scores</Text>
                        </View>
                    </Tab>
                    <Tab heading="Activities" 
                        tabStyle={{backgroundColor: '#282833'}} 
                        activeTabStyle={{backgroundColor: '#282833'}}
                        textStyle={{color: 'white'}}
                        activeTextStyle={{color: '#52e3c2'}}
                    >
                        <View style={{backgroundColor: '#282833'}}>
                            <Text>Activities</Text>
                        </View>
                    </Tab>
                    <Tab heading="Prompts" 
                        tabStyle={{backgroundColor: '#282833'}} 
                        activeTabStyle={{backgroundColor: '#282833'}}
                        textStyle={{color: 'white'}}
                        activeTextStyle={{color: '#52e3c2'}}
                    >
                        <View style={{backgroundColor: '#282833'}}>
                            <Text>Prompts</Text>
                        </View>
                    </Tab>
                </Tabs>

            </Content>
        );
    }
}