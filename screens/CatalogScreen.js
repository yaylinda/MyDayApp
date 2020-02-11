import React, { Component } from 'react';
import {
    Card, CardItem, Button, Text, Form, Item, Label, Input, Accordion, View, Icon, List, ListItem, Content, Tabs, Tab,
} from 'native-base';
import { HOST, COLORS } from '../util/Constants';
import { AsyncStorage } from 'react-native';
import Modal from 'react-native-modal';
import ActionButton from 'react-native-action-button';

const CATALOG_TYPES = ['ACTIVITY', 'PROMPT'];

export default class CatalogScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            catalogData: { 'ACTIVITY': [], 'PROMPT': [] },
            errorMessage: '',
            showAddModal: false,
            newType: '',
            newName: '',
            newDescription: '',
            newColor: '',
            newIcon: '',
            newQuestion: '',
            newAnswers: [''],
            newAllowMultiSelect: false,
            activeTabIndex: 0,
        }
    }

    componentDidMount() {
        this.loadCatalogData();
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN }}>
                <Content padder style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN, }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 24, fontWeight: '900', color: '#52e3c2' }}>Catalog</Text>
                    </View>

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

                    <Modal isVisible={this.state.showAddModal}>
                        <View style={{ backgroundColor: '#40424f', justifyContent: 'center', borderRadius: 5 }}>

                            <View style={{ paddingTop: 30, flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18, fontWeight: '600', color: '#52e3c2' }}>Add to Catalog</Text>
                            </View>

                            <View padder>
                                {this.renderForm()}
                            </View>

                            <View padder style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button onPress={() => this.cancelAdd()} style={{ backgroundColor: '#52e3c2' }}>
                                    <Text>Cancel</Text>
                                </Button>
                                <Button onPress={() => this.persistNew()} style={{ backgroundColor: '#52e3c2' }}>
                                    <Text>Save</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                </Content>
                <ActionButton
                    style={{ bottom: 0 }}
                    buttonColor='#ff4495'
                    renderIcon={() => <Icon name='add' style={{ fontSize: 18, color: 'white' }} />}
                    onPress={() => this.fabPress()}
                />
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
                                <ListItem key={index} style={{borderBottomWidth: 0}}>
                                    <Text style={{ color: 'white' }}>{answer}</Text>
                                </ListItem>
                            );
                        })
                    }
                </List>
            </View>);
    }

    renderForm() {
        if (this.state.newType === 'ACTIVITY') {
            return (
                <Form style={{ marginBottom: 20 }}>
                    <Item floatingLabel>
                        <Label style={{ color: 'white' }}>Name</Label>
                        <Input style={{ color: 'white' }} onChangeText={value => this.setState({ newName: value })} />
                    </Item>
                    <Item floatingLabel>
                        <Label style={{ color: 'white' }}>Description</Label>
                        <Input style={{ color: 'white' }} onChangeText={value => this.setState({ newDescription: value })} />
                    </Item>
                    <Item floatingLabel>
                        <Label style={{ color: 'white' }}>Icon</Label>
                        <Input style={{ color: 'white' }} onChangeText={value => this.setState({ newIcon: value })} />
                    </Item>
                    <Item floatingLabel>
                        <Label style={{ color: 'white' }}>Color</Label>
                        <Input style={{ color: 'white' }} onChangeText={value => this.setState({ newColor: value })} />
                    </Item>
                </Form>
            );
        } else if (this.state.newType === 'PROMPT') {
            return (
                <View>
                    <Form style={{ marginBottom: 20 }}>
                        <Item padder floatingLabel>
                            <Label style={{ color: 'white' }}>Question</Label>
                            <Input style={{ color: 'white' }} onChangeText={value => this.setState({ newQuestion: value })} />
                        </Item>
                        {
                            this.state.newAnswers.map((answer, index) => {
                                return (
                                    <Item floatingLabel key={index}>
                                        <Label style={{ color: 'white' }}>Answer Option #{index + 1}</Label>
                                        <Input style={{ color: 'white' }} onChangeText={value => this.updateAnswers(index, value)} />
                                    </Item>
                                );
                            })
                        }

                    </Form>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Button small rounded onPress={() => this.setState({ newAnswers: this.state.newAnswers.concat('') })} style={{ backgroundColor: '#52e3c2' }}>
                            <Text style={{ color: 'white' }}>Add Answer Option</Text>
                        </Button>
                    </View>
                </View>
            );
        }
    }

    updateActiveTab(ref) {
        console.log(`[CatalogScreen] updateActiveTab, activeTabIndex=${ref.i}`);
        this.setState({ activeTabIndex: ref.i });
    }

    fabPress() {
        console.log(`[CatalogScreen] press add fab`);
        this.setState({ showAddModal: true, newType: CATALOG_TYPES[this.state.activeTabIndex] });
    }

    cancelAdd() {
        console.log(`[CatalogScreen] cancel add new`);
        this.resetState();
    }

    updateAnswers(index, value) {
        const tempAnswers = this.state.newAnswers;
        tempAnswers[index] = value;
        this.setState({ newAnswers: tempAnswers });
    }

    async persistNew() {
        console.log(`[CatalogScreen] persist new`);
        const sessionToken = await AsyncStorage.getItem('sessionToken');
        const endpoint = `${HOST}/catalog/events/${this.state.newType}`;
        const body = {
            dayEventCatalogId: '',
            belongsTo: '',
            type: this.state.newType,
            name: this.state.newName,
            color: this.state.newColor,
            icon: this.state.newIcon,
            description: this.state.newDescription,
            question: this.state.newQuestion,
            answers: this.state.newAnswers,
            allowMultiSelect: this.state.newAllowMultiSelect
        };
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Session-Token': sessionToken
        };

        console.log(`[CatalogScreen] calling ${endpoint}, with ${JSON.stringify(body)}`);

        let requestSuccess = false;

        fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        }).then((response) => {
            if (response.ok) {
                requestSuccess = true;
                console.log(`[CatalogScreen] successfully posted new`);
                AsyncStorage.setItem('doCatalogUpdate', 'doCatalogUpdate');
            } else {
                requestSuccess = false;
                console.log(`[CatalogScreen] error posting new`);
            }
            return response.json();
        }).then((json) => {
            console.log(`[CatalogScreen] json: ${JSON.stringify(json)}`);
            if (requestSuccess) {
                console.log(`[CatalogScreen] updating this.state.catalogData`);
                let tempCatalogData = this.state.catalogData;
                tempCatalogData[this.state.newType] = json;
                this.setState({ catalogData: tempCatalogData });
            } else {
                console.log(`[CatalogScreen] error posting new event with error message: ${json.message}`);
                this.errorMessage = json.message;
            }

            this.resetState();
        });
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
            } else {
                console.log(`[CatalogScreen] retrieving day event catalog data error message: ${json.message}`);
                this.errorMessage = json.message;
                // TODO - show error message on screen
            }
        })
    }

    resetState() {
        this.setState({
            showAddModal: false,
            newType: '',
            newName: '',
            newDescription: '',
            newColor: '',
            newIcon: '',
            newQuestion: '',
            newAnswers: [''],
            newAllowMultiSelect: false
        });
    }

}