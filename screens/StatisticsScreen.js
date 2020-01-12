import React, { Component } from 'react';
import { Container, View, Text, Content, Tabs, Tab, Segment, Button } from 'native-base';
import { AsyncStorage } from 'react-native';
import { host } from '../util/Constants';
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundGradientFrom: "#282833",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#282833",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5
  };

export default class StatisticsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allStats: {
                SUMMARY: {},
                SCORE: {},
                ACTIVITY: {},
                PROMPT: {}
            },
        }
    }

    componentDidMount() {
        this.loadStats();
    }

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
                            { this.renderLineGraph('SCORE', 'day', 'Average Scores By Hour') }
                            { this.renderLineGraph('SCORE', 'week', 'Last 7 Days') }
                            { this.renderLineGraph('SCORE', 'month', 'Last Month') }
                            { this.renderLineGraph('SCORE', 'year', 'Last Year') }
                        </View>
                    </Tab>
                    <Tab heading="Activities" 
                        tabStyle={{backgroundColor: '#282833'}} 
                        activeTabStyle={{backgroundColor: '#282833'}}
                        textStyle={{color: 'white'}}
                        activeTextStyle={{color: '#52e3c2'}}
                    >
                        <View style={{backgroundColor: '#282833'}}>
                            { this.renderStackedBarChat('ACTIVITY', 'day', 'Average Scores By Hour') }
                            { this.renderStackedBarChat('ACTIVITY', 'week', 'Last 7 Days') }
                            { this.renderStackedBarChat('ACTIVITY', 'month', 'Last Month') }
                            { this.renderStackedBarChat('ACTIVITY', 'year', 'Last Year') }
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

    renderLineGraph(statsType, timeRange, chartTitle) {
        const input = this.state.allStats[statsType][timeRange];

        if (input) {
            let customLabels = [];
            if (timeRange === 'day') {
                customLabels = input.labels.map((elem, index) => index % 2 ? '' : elem);
            } else {
                customLabels = input.labels;
            }

            const data = {
                labels: customLabels,
                datasets: [
                  {
                    data: input.labels.map((label) => input.labelsDataMap[label]),
                  }
                ],
              };

            return(
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: 18, marginTop: 10, marginBottom: 10, color: '#52e3c2'}}>{chartTitle}</Text>

                </View>
            );
        }
        
    }

    renderStackedBarChat(statsType, timeRange, chartTitle) {
        const input = this.state.allStats[statsType][timeRange];

        if (input) {
            let customLabels = [];
            if (timeRange === 'day') {
                customLabels = input.labels.map((elem, index) => index % 2 ? '' : elem);
            } else {
                customLabels = input.labels;
            }


            const data = {
                labels: customLabels,
                legend: input.legend,
                data: input.labels.map((label) => input.labelsDataMap[label]),
                barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
            }

            return (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: 18, marginTop: 10, marginBottom: 10, color: '#52e3c2'}}>{chartTitle}</Text>
                </View>
            );
        }
    }

    async loadStats() {
        const sessionToken = await AsyncStorage.getItem('sessionToken');

        const endpoint = `${host}/stats`;
        console.log(`[StatisticsScreen] calling ${endpoint}`);

        let requestSuccess = false;

        fetch(endpoint, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Session-Token': sessionToken
            },
        }).then((response) => {
            if (response.ok) {
                console.log(`[StatisticsScreen] successfully retrieved allStats object`);
                requestSuccess = true;
            } else {
                console.log(`[StatisticsScreen] error retrieving allStats object`);
                requestSuccess = false;
            }
            return response.json();
        }).then((json) => {
            console.log(`[StatisticsScreen] json: ${JSON.stringify(json)}`);
            if (requestSuccess) {
                console.log('[StatisticsScreen] updating state.allStats');
                this.setState({ allStats: json });
            } else {
                console.log(`[StatisticsScreen] retrieving allStats object error message: ${json.message}`);
                this.errorMessage = json.message;
                // TODO - show error message on screen
            }
        })
    }
}