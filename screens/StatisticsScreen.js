import React, { Component } from 'react';
import { View, Text, Content, Tabs, Tab } from 'native-base';
import { AsyncStorage } from 'react-native';
import { HOST, COLORS, formatDecimal } from '../util/Constants';
import { NavigationEvents } from 'react-navigation';
import CalendarMonthTiles from '../components/CalendarMonthTiles';
import { Dropdown } from 'react-native-material-dropdown';

export default class StatisticsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stats: { tiles: null, summary: null },
            selectedStatKey: 'Scores', // default for dropdown
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
                        <Tab heading="Tiles"
                            tabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                            activeTabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                            textStyle={{ color: 'white' }}
                            activeTextStyle={{ color: COLORS.TEXT_MAIN }}
                            style={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                        >
                            {this.renderTrendsTabContent()}
                        </Tab>
                        <Tab heading="Summary"
                            tabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                            activeTabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                            textStyle={{ color: 'white' }}
                            activeTextStyle={{ color: COLORS.TEXT_MAIN }}
                            style={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                        >
                            {this.renderSummaryTabContent()}
                        </Tab>
                    </Tabs>
                </Content>
            </View>
        );
    }

    renderTrendsTabContent() {
        if (this.state.stats.tiles && this.state.stats.tiles[this.state.selectedStatKey]) {
            const options = Object.keys(this.state.stats.tiles).map(k => { return { value: k } });
            return (
                <View>
                    <View padder style={{ backgroundColor: COLORS.BACKGROUND_LIGHT, borderRadius: 10, marginTop: 10 }}>
                        <Dropdown
                            baseColor={COLORS.TEXT_ACCENT}
                            textColor='white'
                            itemColor='white'
                            label="Select Data"
                            pickerStyle={{ backgroundColor: COLORS.BACKGORUND_ACCENT }}
                            data={options}
                            value={this.state.selectedStatKey}
                            onChangeText={(value) => this.setState({ selectedStatKey: value })}
                        />
                    </View>

                    <View style={{ backgroundColor: COLORS.BACKGROUND_LIGHT, borderRadius: 10, marginTop: 10 }}>
                        <CalendarMonthTiles
                            title={this.state.selectedStatKey}
                            data={this.state.stats.tiles[this.state.selectedStatKey]}
                        />
                    </View>
                </View>
            );
        }
    }

    renderSummaryTabContent() {
        if (this.state.stats.summary) {
            return (
                <View>
                    <View padder style={{ backgroundColor: COLORS.BACKGROUND_LIGHT, borderRadius: 10, marginTop: 10 }}>
                        <Text style={{ color: COLORS.TEXT_ACCENT, fontSize: 20, marginBottom: 10 }}>Days</Text>
                        {this.renderSummaryDataBox(this.state.stats.summary.totalNumDays, 'Total Days')}
                    </View>
                    <View padder style={{ backgroundColor: COLORS.BACKGROUND_LIGHT, borderRadius: 10, marginTop: 10 }}>
                        <Text style={{ color: COLORS.TEXT_ACCENT, fontSize: 20, marginBottom: 10 }}>Scores</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            {this.renderSummaryDataBox(formatDecimal(this.state.stats.summary.averageScore), 'Average Daily Score')}
                            {this.renderSummaryDataBox(this.state.stats.summary.totalNumScores, 'Total Score')}
                        </View>
                    </View>
                    <View padder style={{ backgroundColor: COLORS.BACKGROUND_LIGHT, borderRadius: 10, marginTop: 10 }}>
                        <Text style={{ color: COLORS.TEXT_ACCENT, fontSize: 20, marginBottom: 10 }}>Activities</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            {this.renderSummaryDataBox(this.state.stats.summary.numUniqueActivities, 'Number of Unique Activities')}
                            {this.renderSummaryDataBox(this.state.stats.summary.totalNumActivities, 'Total Activities')}
                        </View>
                    </View>
                    <View padder style={{ backgroundColor: COLORS.BACKGROUND_LIGHT, borderRadius: 10, marginTop: 10 }}>
                        <Text style={{ color: COLORS.TEXT_ACCENT, fontSize: 20, marginBottom: 10 }}>Prompts</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            {this.renderSummaryDataBox(this.state.stats.summary.numUniquePrompts, 'Number of Unique Prompts Answered')}
                            {this.renderSummaryDataBox(this.state.stats.summary.totalNumPrompts, 'Total Prompts Answered')}
                        </View>
                    </View>
                </View>
            );
        }
    }

    renderSummaryDataBox(value, subtitle) {
        return (
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <View padder style={{ backgroundColor: COLORS.BACKGROUND_MAIN, borderRadius: 10, display: 'flex', width: 120, height: 120 }}>
                    <Text style={{ textAlign: 'center', fontSize: 50, color: 'white', marginBottom: 10 }}>{value}</Text>
                    <Text style={{ textAlign: 'center', fontSize: 10, color: COLORS.TEXT_MAIN }}>{subtitle}</Text>
                </View>
            </View>
        );
    }

    async loadStats() {
        const sessionToken = await AsyncStorage.getItem('sessionToken');

        const endpoint = `${HOST}/stats`;
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