import React, { Component } from 'react';
import { View, Text, Content, Tabs, Tab } from 'native-base';
import { AsyncStorage } from 'react-native';
import { host } from '../util/Constants';
import { Grid, YAxis, XAxis, BarChart, StackedBarChart, PieChart, ProgressCircle } from 'react-native-svg-charts';
import palette from 'google-palette';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment'

const SCORE_KEY = 'score';
const ACTIVITY_KEY = 'activity';
const PROMPT_KEY = 'prompt';
const SUMMARY_KEY = 'summary';
const DAY_KEY = 'day';
const WEEK_KEY = 'week';
const MONTH_KEY = 'month';
const YEAR_KEY = 'year';
const COUNTS_KEY = 'counts'
const RECORDS_KEY = 'records';
const LABELS_KEY = 'labels';
const LABELS_DATA_MAP_KEY = 'labelsDataMap';

export default class StatisticsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allStats: {
                [SCORE_KEY]: {},
                [ACTIVITY_KEY]: {},
                [PROMPT_KEY]: {},
                [SUMMARY_KEY]: {}
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
                            {this.renderLineGraph(SCORE_KEY, DAY_KEY, 'Today\'s Scores')}
                            {this.renderLineGraph(SCORE_KEY, WEEK_KEY, 'Last 7 Days')}
                            {this.renderLineGraph(SCORE_KEY, MONTH_KEY, 'This Month')}
                            {this.renderLineGraph(SCORE_KEY, YEAR_KEY, 'This Year')}
                        </View>
                    </Tab>
                    <Tab heading="Activities"
                        tabStyle={{ backgroundColor: '#282833' }}
                        activeTabStyle={{ backgroundColor: '#282833' }}
                        textStyle={{ color: 'white' }}
                        activeTextStyle={{ color: '#52e3c2' }}
                    >
                        <View padder style={{ backgroundColor: '#282833' }}>
                            {this.renderStackedBarChat(ACTIVITY_KEY, DAY_KEY, 'Average Scores By Hour')}
                            {this.renderStackedBarChat(ACTIVITY_KEY, WEEK_KEY, 'Last 7 Days')}
                            {this.renderStackedBarChat(ACTIVITY_KEY, MONTH_KEY, 'Last Month')}
                            {this.renderStackedBarChat(ACTIVITY_KEY, YEAR_KEY, 'Last Year')}
                        </View>
                    </Tab>
                    <Tab heading="Prompts"
                        tabStyle={{ backgroundColor: '#282833' }}
                        activeTabStyle={{ backgroundColor: '#282833' }}
                        textStyle={{ color: 'white' }}
                        activeTextStyle={{ color: '#52e3c2' }}
                    >
                        <View padder style={{ backgroundColor: '#282833' }}>
                            {this.renderPromptStats(PROMPT_KEY, DAY_KEY, 'Today\'s Prompt Answers')}
                            {this.renderPromptStats(PROMPT_KEY, WEEK_KEY, 'This Week\'s Prompt Answers')}
                            {this.renderPromptStats(PROMPT_KEY, MONTH_KEY, 'This Month\'s Prompt Answers')}
                            {this.renderPromptStats(PROMPT_KEY, YEAR_KEY, 'This Year\'s Prompt Answers')}
                        </View>
                    </Tab>
                </Tabs>

            </Content>
        );
    }

    renderSummaryStats() {
        if (this.state.allStats[SUMMARY_KEY] 
            && this.state.allStats[SUMMARY_KEY][COUNTS_KEY] 
            && this.state.allStats[SUMMARY_KEY][RECORDS_KEY]) {

            const counts = this.state.allStats[SUMMARY_KEY][COUNTS_KEY][LABELS_DATA_MAP_KEY];
            const records = this.state.allStats[SUMMARY_KEY][RECORDS_KEY][LABELS_DATA_MAP_KEY];

            return (
                <View style={{ justifyContent: 'center' }}>
                    { this.renderProgressCircle(counts.numDaysWithRecords, counts.numDaysTotal, 'ANY')}
                    { this.renderProgressCircle(counts.numDaysWithScore, counts.numDaysTotal, 'SCORE')}
                    { this.renderProgressCircle(counts.numDaysWithActivity, counts.numDaysTotal, 'ACTIVITY')}
                    { this.renderProgressCircle(counts.numPromptsTotal, counts.numDaysTotal, 'PROMPT')}
                    { this.renderScoreRecordsText('HIGHEST', true, 'SCORE', records.highestAvgDayScore, records.highestAvgDayScoreDate) }
                    { this.renderScoreRecordsText('LOWEST', false, 'SCORE', records.lowestAvgDayScore, records.lowestAvgDayScoreDate) }
                    { this.renderMostCommonText('SCORE', records.mostCommonScore, records.mostCommonScoreCount) }
                    { this.renderMostCommonText('ACTIVITY', records.mostCommonActivity, records.mostCommonActivityCount) }
                    { this.renderMostCommonText('PROMPT', records.mostCommonPrompt, records.mostCommonPromptCount) }
                </View>
            );

        }
    }

    renderProgressCircle(value, outOf, dataType) {
        return (
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
                <View style={{ display: 'flex', flex: 1, justifyContent: 'center'}}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#52e3c2', marginBottom: 10}}>
                        Recorded 
                        <Text style={{fontWeight: '600', color: '#d211fe'}}> {dataType} </Text> 
                        data
                        <Text style={{fontWeight: '600', color: '#d211fe'}}> {value} </Text> 
                        out of 
                        <Text style={{fontWeight: '600', color: '#d211fe'}}> {outOf} </Text> 
                         days
                    </Text>
                </View>
                <View style={{ flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
                    <ProgressCircle 
                        style={{ flex: 1, height: 100 }} 
                        progress={ value / outOf } 
                        progressColor={'#d211fe'} 
                        strokeWidth={10} 
                        cornerRadius={0}
                    />
                </View>
            </View>
        );
    }

    renderScoreRecordsText(extremeType, showHighestColor, dataType, value, date) {
        const extremeTypeColor = showHighestColor ? '#0781ff' : '#ff4b12';
        return (
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#52e3c2', marginBottom: 10, marginTop: 10 }}>
                <Text style={{fontWeight: '600', color: extremeTypeColor}}>{extremeType}</Text> average 
                <Text style={{fontWeight: '600', color: '#d211fe'}}> {dataType}</Text> is 
                <Text style={{fontWeight: '600', color: '#d211fe'}}> {value}</Text>. 
                Recorded on {this.formatDate(date)}.
            </Text>
        );
    }

    renderMostCommonText(dataType, value, count) {
        return (
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#52e3c2', marginBottom: 10, marginTop: 10 }}>
                Most common
                <Text style={{fontWeight: '600', color: '#d211fe'}}> {dataType}</Text> is 
                <Text style={{fontWeight: '600', color: '#d211fe'}}> {value}</Text>, with
                <Text style={{fontWeight: '600', color: '#d211fe'}}> {count}</Text> occurrances.
            </Text>
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

    renderPromptStats(statsType, timeRange, chartTitle) {
        const input = this.state.allStats[statsType][timeRange];

        if (input) {
            const allPieData = [];

            input.labels.forEach(q => {
                const pieData = {
                    title: q,
                    data: []
                };

                let colors = palette('mpn65', input.labels.length);
                colors = colors.map(c => `#${c}`)

                pieData.data = input.labelsDataMap[q].labels.map((answerLabel, index) => {
                    return {
                        key: answerLabel,
                        value: input.labelsDataMap[q].labelsDataMap[answerLabel],
                        svg: { fill: colors[index] }
                    }
                });

                allPieData.push(pieData);
            });

            return (
                <View>
                    <Text style={{ fontSize: 18, fontWeight: '500', 
                        color: '#52e3c2', marginBottom: 10 }}>{chartTitle}</Text>
                    {
                        allPieData.map((pieData, index) => {
                            return this.renderPromptPieChart(index, pieData.data, pieData.title);
                        })
                    }
                </View>
            );
        }
    }

    renderPromptPieChart(key, data, chartTitle) {
        return (
            <View key={key} style={{ marginBottom: 20, justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: '#52e3c2', marginBottom: 10 }}>{chartTitle}</Text>
                <PieChart
                    data={data}
                    style={{ height: 200 }}
                />
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

    formatDate(date) {
        return moment(date, "YYYY-MM-DD").format('ddd, MMM Do YYYY');
    }
}