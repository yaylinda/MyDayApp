import React, { Component } from 'react';
import { View, Text, Content, Tabs, Tab } from 'native-base';
import { AsyncStorage } from 'react-native';
import { HOST, COLORS } from '../util/Constants';
import { Grid, YAxis, XAxis, BarChart, StackedBarChart, PieChart, ProgressCircle } from 'react-native-svg-charts';
import palette from 'google-palette';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment'
import CalendarMonthTiles from '../components/CalendarMonthTiles';
import { Dropdown } from 'react-native-material-dropdown';

const SCORE_KEY = 'score';
const ACTIVITY_KEY = 'activity';
const PROMPT_KEY = 'prompt';
const SUMMARY_KEY = 'summary';

export default class StatisticsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stats: {},
            selectedStatKey: 'EMOTION',
        }
    }

    componentDidMount() {
        this.loadStats();
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN }}>
                <Content padder style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN }}>
                    <NavigationEvents onWillFocus={() => this.checkForUpdates()} />
                    <Tabs tabBarUnderlineStyle={{ backgroundColor: COLORS.TEXT_MAIN }}>
                        <Tab heading="Score & Activity Tiles"
                            tabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                            activeTabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                            textStyle={{ color: 'white' }}
                            activeTextStyle={{ color: COLORS.TEXT_MAIN }}
                            style={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                        >
                            {this.renderTrendsTabContent()}
                        </Tab>
                        <Tab heading="Prompts Diary"
                            tabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                            activeTabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                            textStyle={{ color: 'white' }}
                            activeTextStyle={{ color: COLORS.TEXT_MAIN }}
                            style={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                        >
                            <View padder style={{ backgroundColor: COLORS.BACKGROUND_MAIN }}>

                            </View>
                        </Tab>

                    </Tabs>
                </Content>
            </View>
        );
    }

    renderTrendsTabContent() {
        if (this.state.stats && this.state.stats[this.state.selectedStatKey]) {
            const options = Object.keys(this.state.stats).map(k => { return {value: k} });
            return (
                <View>
                    <View padder style={{ backgroundColor: COLORS.BACKGROUND_LIGHT, borderRadius: 10, marginTop: 10 }}>
                        <Dropdown
                            baseColor={COLORS.TEXT_ACCENT}
                            textColor='white'
                            itemColor='white'
                            label="Select Data"
                            pickerStyle={{backgroundColor: COLORS.BACKGORUND_ACCENT}}
                            data={options}
                            value={this.state.selectedStatKey}
                            onChangeText={(value) => this.setState({selectedStatKey: value})}
                        />
                    </View>

                    <View style={{ backgroundColor: COLORS.BACKGROUND_LIGHT, borderRadius: 10, marginTop: 10 }}>
                        <CalendarMonthTiles 
                            title={this.state.selectedStatKey} 
                            data={this.state.stats[this.state.selectedStatKey]} 
                        />
                    </View>
                </View>
            );
        }
    }

    async loadStats() {
        const sessionToken = await AsyncStorage.getItem('sessionToken');

        const endpoint = `${HOST}/stats/tiles`;
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
            // console.log(`[StatisticsScreen] json: ${JSON.stringify(json)}`);
            if (requestSuccess) {
                console.log('[StatisticsScreen] updating state.allStats');
                this.setState({ stats: json });
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