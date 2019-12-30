import React, { Component } from 'react';
import {
    Container, Card, CardItem, Button, Text, Left, Right, Form, Picker, Item, Label, Input, Accordion, View, Icon, Body, Header,
} from 'native-base';
import { host } from '../util/Constants';
import { AsyncStorage } from 'react-native';
import Modal from "react-native-modal";

export default class CatalogScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            catalogData: { 'ACTIVITY': [], 'EMOTION': [] },
            errorMessage: '',

            showAddActivityModal: false,
            showAddEmotionModal: false,

            newActivityName: '',
            newActivityDescription: '',
            newActivityColor: '',
            newActivityIcon: ''
        }
    }

    componentDidMount() {
        this.loadCatalogData();
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#282833' }}>
                <Card>
                    <CardItem header bordered>
                        <Text>Activities Catalog</Text>
                    </CardItem>
                    <CardItem bordered>
                        {
                            this.renderCatalogData('ACTIVITY')
                        }
                    </CardItem>
                    <CardItem>
                        <Button onPress={() => this.setState({ showAddActivityModal: true })}>
                            <Text>Add Activity to Catalog</Text>
                        </Button>
                    </CardItem>
                </Card>
                
                <Card>
                    <CardItem header bordered>
                        <Text>Emotions Catalog</Text>
                    </CardItem>
                    <CardItem>
                        <Button onPress={() => this.setState({ showAddEmotionModal: true })}>
                            <Text>Add Emotion to Catalog</Text>
                        </Button>
                    </CardItem>
                </Card>

                <Modal isVisible={this.state.showAddActivityModal}>
                    <View style={{ backgroundColor: 'white', justifyContent: 'center', borderRadius: 5 }}>

                        <Form>
                            <Item floatingLabel>
                                <Label>Activity Name</Label>
                                <Input onChangeText={value => this.setState({ newActivityName: value })} />
                            </Item>
                            <Item floatingLabel>
                                <Label>Activity Description</Label>
                                <Input onChangeText={value => this.setState({ newActivityDescription: value })} />
                            </Item>
                        </Form>
                        <View padder style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Button onPress={() => this.cancelAddActivity()}><Text>Cancel</Text></Button>
                            <Button onPress={() => this.persistNewActivity()}><Text>Save</Text></Button>
                        </View>
                    </View>
                </Modal>

            </Container>
        );
    }

    renderCatalogData(type) {
        if (this.state.catalogData[type] && this.state.catalogData[type].length) {
            return (
                <Accordion
                    dataArray={this.state.catalogData[type]}
                    animation={true}
                    expanded={false}
                    renderHeader={this.renderCatalogDataHeader}
                    renderContent={this.renderCatalogDataContent}>
                </Accordion>
            );
        } else {
            return (<Text>No Activities in Catalog. Add one!</Text>);
        }
    }

    renderCatalogDataHeader(item, expanded) {
        return (
            <View padder style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#A9DAD6"
            }}>
                <Text style={{ fontWeight: "600" }}>{item.name}</Text>
                {expanded
                    ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
                    : <Icon style={{ fontSize: 18 }} name="add-circle" />}
            </View>);
    }

    renderCatalogDataContent(item) {
        return (
            <View padder>
                <Text>{item.description}</Text>
            </View>);
    }

    cancelAddActivity() {
        console.log(`[CatalogScreen] cancel add activity`);
        this.setState({
            showAddActivityModal: false,
            newActivityName: '',
            newActivityDescription: '',
            newActivityColor: '',
            newActivityIcon: ''
        });
    }

    async persistNewActivity() {
        console.log(`[CatalogScreen] persist new activity`);
        const sessionToken = await AsyncStorage.getItem('sessionToken');
        const endpoint = `${host}/catalog/events/ACTIVITY`;
        const body = {
            dayEventCatalogId: '',
            belongsTo: '',
            type: 'ACTIVITY',
            name: this.state.newActivityName,
            color: this.state.newActivityColor,
            icon: this.state.newActivityIcon,
            description: this.state.newActivityDescription
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
                console.log(`[CatalogScreen] successfully posted new activity`);
            } else {
                requestSuccess = false;
                console.log(`[CatalogScreen] error posting new activity`);
            }
            return response.json();
        }).then((json) => {
            console.log(`[CatalogScreen] json: ${json}`);
            if (requestSuccess) {
                console.log(`[CatalogScreen] updating state.catalog`);
                let tempCatalogData = this.state.catalogData;
                tempCatalogData['ACTIVITY'] = json;
                this.setState({ catalogData: tempCatalogData });
            } else {
                console.log(`[CatalogScreen] error posting new activity with error message: ${json.message}`);
                this.errorMessage = json.message;
            }

            this.setState({
                showAddActivityModal: false,
                newActivityName: '',
                newActivityDescription: '',
                newActivityColor: '',
                newActivityIcon: ''
            });
        });
    }

    async loadCatalogData() {
        const sessionToken = await AsyncStorage.getItem('sessionToken');

        const endpoint = `${host}/catalog/events`;
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

}