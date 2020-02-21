import React, { Component } from 'react';
import {
    Card, CardItem, Button, Text, Form, Item, Label, Input, Accordion, View, Icon, List, ListItem, Content, Tabs, Tab,
} from 'native-base';
import { HOST, COLORS } from '../util/Constants';
import { AsyncStorage } from 'react-native';
import Modal from 'react-native-modal';
import ActionButton from 'react-native-action-button';
import { NavigationEvents } from 'react-navigation';

const CATALOG_TYPES = ['ACTIVITY', 'PROMPT'];

export default class CatalogScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            catalogData: { 'ACTIVITY': [], 'PROMPT': [] },
            errorMessage: '',
            activeTabIndex: 0,
        }
    }

    componentDidMount() {
        this.loadCatalogData();
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN }}>
                <NavigationEvents onWillFocus={() => this.checkForUpdates()} />
                
                <Content padder style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN, }}>
                    <Tabs
                        tabBarUnderlineStyle={{ backgroundColor: COLORS.TEXT_MAIN }}
                        style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN }}
                        onChangeTab={(ref) => this.updateActiveTab(ref)}
                    >
                        <Tab heading='Activities'
                            tabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                            activeTabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN, }}
                            textStyle={{ color: 'white' }}
                            activeTextStyle={{ color: COLORS.TEXT_MAIN }}
                            style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN, }}
                        >
                            <View padder>
                                {this.renderCatalogData('ACTIVITY')}
                            </View>
                        </Tab>
                        <Tab heading='Prompts'
                            tabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                            activeTabStyle={{ backgroundColor: COLORS.BACKGROUND_MAIN }}
                            textStyle={{ color: 'white' }}
                            activeTextStyle={{ color: COLORS.TEXT_MAIN }}
                            style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN, }}
                        >
                            <View padder>
                                {this.renderCatalogData('PROMPT')}
                            </View>
                        </Tab>
                    </Tabs>
                </Content>

                <ActionButton
                    style={{ bottom: 0 }}
                    buttonColor='#ff4495'
                    renderIcon={() => <Icon name='add' style={{ fontSize: 18, color: 'white' }} />}>
                        {
                            this.state.activeTabIndex === 0 ? 
                            <ActionButton.Item
                                size={40}
                                title={'Activity'}
                                onPress={() => this.props.navigation.navigate('CatalogForm', { formType: 'ACTIVITY' })}
                                style={{ backgroundColor: '#ff4495' }}>
                                <Icon name="apps" style={{ fontSize: 18, color: 'white' }} />
                            </ActionButton.Item> : <ActionButton.Item
                                size={40}
                                title={'Prompt'}
                                onPress={() => this.props.navigation.navigate('CatalogForm', { formType: 'PROMPT' })}
                                style={{ backgroundColor: '#ff4495' }}>
                                <Icon name="help" style={{ fontSize: 18, color: 'white' }} />
                            </ActionButton.Item>
                        }
                </ActionButton>
            </View>
        );
    }

    renderCatalogData(type) {
        if (this.state.catalogData[type] && this.state.catalogData[type].length) {
            if (type === 'ACTIVITY') {
                return (
                    <Accordion
                        dataArray={this.state.catalogData[type]}
                        animation={true}
                        expanded={false}
                        renderHeader={this.renderActivityCatalogDataHeader}
                        renderContent={this.renderActivityCatalogDataContent}
                        style={{ borderWidth: 0 }}>
                    </Accordion>
                );
            } else if (type === 'PROMPT') {
                return (
                    <Accordion
                        dataArray={this.state.catalogData[type]}
                        animation={true}
                        expanded={false}
                        renderHeader={this.renderPromptCatalogDataHeader}
                        renderContent={this.renderPromptCatalogDataContent}
                        style={{ borderWidth: 0 }}>
                    </Accordion>
                );
            }
        } else {
            return (<Text style={{ color: 'white', fontStyle: 'italic' }}>No catalog data yet</Text>);
        }
    }

    renderActivityCatalogDataHeader(item, expanded) {
        return (
            <View padder style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: COLORS.BACKGORUND_ACCENT,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: expanded ? 0 : 10,
                borderBottomRightRadius: expanded ? 0 : 10,
                marginBottom: expanded ? 0 : 10,
            }}>
                <Text style={{ fontWeight: '500', color: 'white' }}>{item.name}</Text>
                {expanded
                    ? <Icon style={{ fontSize: 18, color: 'white' }} name='arrow-up' />
                    : <Icon style={{ fontSize: 18, color: 'white' }} name='arrow-down' />}
            </View>);
    }

    renderPromptCatalogDataHeader(item, expanded) {
        return (
            <View padder style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: COLORS.BACKGORUND_ACCENT,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: expanded ? 0 : 10,
                borderBottomRightRadius: expanded ? 0 : 10,
                marginBottom: expanded ? 0 : 10,
            }}>
                <Text style={{ fontWeight: '500', color: 'white' }}>{item.question}</Text>
                {expanded
                    ? <Icon style={{ fontSize: 18, color: 'white' }} name='arrow-up' />
                    : <Icon style={{ fontSize: 18, color: 'white' }} name='arrow-down' />}
            </View>);
    }

    renderActivityCatalogDataContent(item) {
        return (
            <View padder style={{
                backgroundColor: COLORS.BACKGROUND_LIGHT,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                marginBottom: 10,
            }}>
                {item.description
                    ? <Text style={{ color: 'white' }}>{item.description}</Text>
                    : <Text style={{ color: 'white', fontStyle: 'italic' }}>No description available</Text>
                }
            </View>);
    }

    renderPromptCatalogDataContent(item) {
        return (
            <View style={{
                backgroundColor: COLORS.BACKGROUND_LIGHT,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                marginBottom: 10,
            }}>
                <List>
                    {
                        item.answers.map((answer, index) => {
                            return (
                                <ListItem key={index} style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ color: 'white' }}>{answer}</Text>
                                </ListItem>
                            );
                        })
                    }
                </List>
            </View>);
    }

    updateActiveTab(ref) {
        console.log(`[CatalogScreen] updateActiveTab, activeTabIndex=${ref.i}`);
        this.setState({ activeTabIndex: ref.i });
    }

    async loadCatalogData() {
        const sessionToken = await AsyncStorage.getItem('sessionToken');

        const endpoint = `${HOST}/catalog/events`;
        console.log(`[CatalogScreen] calling ${endpoint}`);

        let requestSuccess = false;

        fetch(endpoint, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Session-Token': sessionToken
            },
        }).then((response) => {
            if (response.ok) {
                console.log(`[CatalogScreen] successfully retrieved day event catalog data`);
                requestSuccess = true;
            } else {
                console.log(`[CatalogScreen] error retrieving day event catalog data`);
                requestSuccess = false;
            }
            return response.json();
        }).then((json) => {
            console.log(`[CatalogScreen] json: ${JSON.stringify(json)}`);
            if (requestSuccess) {
                console.log('[CatalogScreen] updating state.catalogData');
                this.setState({ catalogData: json });
                AsyncStorage.setItem('doCatalogUpdate_CatalogScreen', '');
            } else {
                console.log(`[CatalogScreen] retrieving day event catalog data error message: ${json.message}`);
                this.errorMessage = json.message;
                // TODO - show error message on screen
            }
        })
    }

    async checkForUpdates() {
        console.log('[CatalogScreen] [onWillFocus] - checkForUpdates');
        const doCatalogUpdate = await AsyncStorage.getItem('doCatalogUpdate_CatalogScreen');
        if (doCatalogUpdate) {
            console.log('[DayScreen] [onWillFocus] - checkForUpdates: doCatalogUpdate_CatalogScreen=true');
            this.loadCatalogData();
        }
    }
}