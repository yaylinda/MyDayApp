import React, { Component } from 'react';
import { View, Text, Content, Tabs, Tab } from 'native-base';
import { AsyncStorage } from 'react-native';
import { host } from '../util/Constants';
import { Grid, YAxis, XAxis, BarChart, StackedBarChart } from 'react-native-svg-charts';
import palette from 'google-palette';
import { NavigationEvents } from 'react-navigation';

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
                <NavigationEvents onWillFocus={() => this.checkForUpdates()} />

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#52e3c2' }}>Statistics</Text>
                </View>

                <Tabs tabBarUnderlineStyle={{ backgroundColor: '#52e3c2' }}>
                    <Tab heading="Summary"
                        tabStyle={{ backgroundColor: '#282833' }}
                        activeTabStyle={{ backgroundColor: '#282833' }}
                        textStyle={{ color: 'white' }}
                        activeTextStyle={{ color: '#52e3c2' }}
                    >
                        <View padder style={{ backgroundColor: '#282833' }}>
                            {this.renderSummaryStats()}
                        </View>
                    </Tab>
                    <Tab heading="Scores"
                        tabStyle={{ backgroundColor: '#282833' }}
                        activeTabStyle={{ backgroundColor: '#282833' }}
                        textStyle={{ color: 'white' }}
                        activeTextStyle={{ color: '#52e3c2' }}
                    >
                        <View padder style={{ backgroundColor: '#282833' }}>
                            {this.renderLineGraph('SCORE', 'day', 'Today\'s Scores')}
                            {this.renderLineGraph('SCORE', 'week', 'Last 7 Days')}
                            {this.renderLineGraph('SCORE', 'month', 'This Month')}
                            {this.renderLineGraph('SCORE', 'year', 'This Year')}
                        </View>
                    </Tab>
                    <Tab heading="Activities"
                        tabStyle={{ backgroundColor: '#282833' }}
                        activeTabStyle={{ backgroundColor: '#282833' }}
                        textStyle={{ color: 'white' }}
                        activeTextStyle={{ color: '#52e3c2' }}
                    >
                        <View padder style={{ backgroundColor: '#282833' }}>
                            {this.renderStackedBarChat('ACTIVITY', 'day', 'Average Scores By Hour')}
                            {this.renderStackedBarChat('ACTIVITY', 'week', 'Last 7 Days')}
                            {this.renderStackedBarChat('ACTIVITY', 'month', 'Last Month')}
                            {this.renderStackedBarChat('ACTIVITY', 'year', 'Last Year')}
                        </View>
                    </Tab>
                    <Tab heading="Prompts"
                        tabStyle={{ backgroundColor: '#282833' }}
                        activeTabStyle={{ backgroundColor: '#282833' }}
                        textStyle={{ color: 'white' }}
                        activeTextStyle={{ color: '#52e3c2' }}
                    >
                        <View padder style={{ backgroundColor: '#282833' }}>
                            {this.renderPromptStats()}
                        </View>
                    </Tab>
                </Tabs>

            </Content>
        );
    }

    renderSummaryStats() {
        return (
            <View>
                {/* TODO - implement */}
            </View>
        );
    }

    renderLineGraph(statsType, timeRange, chartTitle) {
        const input = this.state.allStats[statsType][timeRange];

        if (input) {
            let customLabels = [];
            if (timeRange === 'day') {
                customLabels = input.labels.map((elem, index) => index % 3 ? '' : elem);
            } else {
                customLabels = input.labels;
            }

            const values = input.labels.map((label) => input.labelsDataMap[label]);

            const data = [];
            for (let i = 0; i < customLabels.length; i++) {
                data.push({
                    x: customLabels[i],
                    y: values[i]
                });
            }

            return (
                <View style={{ marginBottom: 20, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: '#52e3c2', marginBottom: 10 }}>{chartTitle}</Text>
                    <View style={{ flexDirection: 'row', display: "flex" }}>
                        <YAxis
                            contentInset={{ top: 10, bottom: 10 }}
                            data={data}
                            yAccessor={({ item }) => item.y}
                            formatLabel={value => value}
                            numberOfTicks={6}
                            min={0}
                            max={5}
                            style={{ flex: 0.1, marginBottom: 15, marginLeft: -15 }}
                            svg={{ fill: 'gray', fontSize: 10 }}
                        />
                        <View style={{ flex: 0.9, marginLeft: -10 }}>
                            <BarChart
                                style={{ height: 150 }}
                                data={data}
                                yAccessor={({ item }) => item.y}
                                svg={{ fill: 'rgb(26, 255, 146)' }}
                                contentInset={{ top: 10, bottom: 10 }}
                                yMin={0}
                                yMax={5}
                            >
                                <Grid />
                            </BarChart>
                            <XAxis
                                data={data}
                                formatLabel={(_, index) => data[index].x}
                                contentInset={{ left: 20, right: 20 }}
                                svg={{ fill: 'gray', fontSize: 10 }}
                            />
                        </View>
                    </View>
                </View>
            );
        }

    }

    renderStackedBarChat(statsType, timeRange, chartTitle) {
        const input = this.state.allStats[statsType][timeRange];

        if (input) {
            let customLabels = [];
            if (timeRange === 'day') {
                customLabels = input.labels.map((elem, index) => index % 3 ? '' : elem);
            } else {
                customLabels = input.labels;
            }

            const data = [];
            input.labels.forEach(labelKey => {
                const datum = {};
                datum['x'] = labelKey;
                for (let i = 0; i < input.legend.length; i++) {
                    datum[input.legend[i]] = input.labelsDataMap[labelKey][i];
                }
                data.push(datum);
            });

            let y = data.map(datum => {
                let sum = 0;
                input.legend.forEach(label => {
                    sum += datum[label];
                })
                return sum;
            });

            let colors = palette('mpn65', input.legend.length);
            colors = colors.map(c => `#${c}`)

            return (
                <View style={{ marginBottom: 20, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: '#52e3c2', marginBottom: 10 }}>{chartTitle}</Text>
                    <View style={{ flexDirection: 'row', display: "flex" }}>
                        <YAxis
                            data={y}
                            contentInset={{ top: 10, bottom: 10 }}
                            formatLabel={(value, index) => index % 2 ? '' : value}
                            style={{ flex: 0.1, marginBottom: 15, marginLeft: -15 }}
                            svg={{ fill: 'gray', fontSize: 10 }}
                            numberOfTicks={Math.max(...y)}
                        />
                        <View style={{ flex: 0.9, marginLeft: -10 }}>
                            <StackedBarChart
                                style={{ height: 150 }}
                                data={data}
                                keys={input.legend}
                                colors={colors}
                                contentInset={{ top: 10, bottom: 10 }}
                            >
                                <Grid />
                            </StackedBarChart>
                            <XAxis
                                data={data}
                                formatLabel={(_, index) => customLabels[index]}
                                contentInset={{ left: 20, right: 20 }}
                                svg={{ fill: 'gray', fontSize: 10 }}
                            />
                        </View>
                    </View>
                </View>
            );
        }
    }

    renderPromptStats() {
        return (
            <View>
                {/* TODO - implement */}
            </View>
        );
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
                AsyncStorage.setItem('doStatsUpdate', '');
            } else {
                console.log(`[StatisticsScreen] retrieving allStats object error message: ${json.message}`);
                this.errorMessage = json.message;
                // TODO - show error message on screen
            }
        })
    }

    async checkForUpdates() {
        console.log('[StatisticsScreen] [onWillFocus] - checkForUpdates');
        const doStatsUpdate = await AsyncStorage.getItem('doStatsUpdate');
        if (doStatsUpdate) {
            console.log('[StatisticsScreen] [onWillFocus] - checkForUpdates: doStatsUpdate=true');
            this.loadStats();
        }
    }
}