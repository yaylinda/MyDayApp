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

            showAddModal: false,
            newType: '',
            newName: '',
            newDescription: '',
            newColor: '',
            newIcon: ''
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
                    <CardItem bordered>{ this.renderCatalogData('ACTIVITY') }</CardItem>
                    <CardItem>
                        <Button onPress={() => this.setState({ showAddModal: true, newType: 'ACTIVITY' })}>
                            <Text>Add Activity to Catalog</Text>
                        </Button>
                    </CardItem>
                </Card>

                <Card>
                    <CardItem header bordered>
                        <Text>Emotions Catalog</Text>
                    </CardItem>
                    <CardItem bordered>{ this.renderCatalogData('EMOTION') }</CardItem>
                    <CardItem>
                        <Button onPress={() => this.setState({ showAddModal: true, newType: 'EMOTION'  })}>
                            <Text>Add Emotion to Catalog</Text>
                        </Button>
                    </CardItem>
                </Card>

                <Modal isVisible={this.state.showAddModal}>
                    <View style={{ backgroundColor: 'white', justifyContent: 'center', borderRadius: 5 }}>
                        <Form>
                            <Item floatingLabel>
                                <Label>Name</Label>
                                <Input onChangeText={value => this.setState({ newName: value })} />
                            </Item>
                            <Item floatingLabel>
                                <Label>Description</Label>
                                <Input onChangeText={value => this.setState({ newDescription: value })} />
                            </Item>
                            <Item floatingLabel>
                                <Label>Icon</Label>
                                <Input onChangeText={value => this.setState({ newIcon: value })} />
                            </Item>
                            <Item floatingLabel>
                                <Label>Color</Label>
                                <Input onChangeText={value => this.setState({ newColor: value })} />
                            </Item>
                        </Form>
                        <View padder style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Button onPress={() => this.cancelAdd()}><Text>Cancel</Text></Button>
                            <Button onPress={() => this.persistNew()}><Text>Save</Text></Button>
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

    cancelAdd() {
        console.log(`[CatalogScreen] cancel add new`);
        this.setState({
            showAddModal: false,
            newType: '',
            newName: '',
            newDescription: '',
            newColor: '',
            newIcon: ''
        });
    }

    async persistNew() {
        console.log(`[CatalogScreen] persist new`);
        const sessionToken = await AsyncStorage.getItem('sessionToken');
        const endpoint = `${host}/catalog/events/${this.state.newType}`;
        const body = {
            dayEventCatalogId: '',
            belongsTo: '',
            type: this.state.newType,
            name: this.state.newName,
            color: this.state.newColor,
            icon: this.state.newIcon,
            description: this.state.newDescription
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
            } else {
                requestSuccess = false;
                console.log(`[CatalogScreen] error posting new`);
            }
            return response.json();
        }).then((json) => {
            console.log(`[CatalogScreen] json: ${json}`);
            if (requestSuccess) {
                console.log(`[CatalogScreen] updating this.state.catalogData`);
                let tempCatalogData = this.state.catalogData;
                tempCatalogData[this.state.newType] = json;
                this.setState({ catalogData: tempCatalogData });
            } else {
                console.log(`[CatalogScreen] error posting new event with error message: ${json.message}`);
                this.errorMessage = json.message;
            }

            this.setState({
                showAddModal: false,
                newType: '',
                newName: '',
                newDescription: '',
                newColor: '',
                newIcon: ''
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