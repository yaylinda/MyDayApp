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
                <Card transparent style={{ backgroundColor: '#282833' }}>
                    <CardItem header bordered style={{ backgroundColor: '#282833' }}>
                        <Text style={{color: '#ff4495', fontSize: 18}}>Activities Catalog</Text>
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833' }}>
                        { this.renderCatalogData('ACTIVITY') }
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833', flexDirection: 'row', justifyContent: 'center' }}>
                        <Button rounded
                            onPress={() => this.setState({ showAddModal: true, newType: 'ACTIVITY' })}
                            style={{backgroundColor: '#ff4495'}}>
                            <Icon name="add-circle" />
                        </Button>
                    </CardItem>
                </Card>

                <Card transparent style={{ backgroundColor: '#282833' }}>
                    <CardItem header bordered style={{ backgroundColor: '#282833' }}>
                        <Text style={{color: '#ff4495', fontSize: 18}}>Emotions Catalog</Text>
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833' }}>
                        { this.renderCatalogData('EMOTION') }
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833', flexDirection: 'row', justifyContent: 'center' }}>
                        <Button rounded
                            onPress={() => this.setState({ showAddModal: true, newType: 'EMOTION'  })}
                            style={{backgroundColor: '#ff4495'}}>
                            <Icon name="add-circle" />
                        </Button>
                    </CardItem>
                </Card>

                <Modal isVisible={this.state.showAddModal}>
                    <View style={{ backgroundColor: '#40424f', justifyContent: 'center', borderRadius: 5 }}>
                        <View style={{ paddingTop: 30, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: "600", color: '#52e3c2'}}>Add to Catalog</Text>
                        </View>
                        <Form style={{marginBottom: 20}}>
                            <Item floatingLabel>
                                <Label style={{color: 'white'}}>Name</Label>
                                <Input style={{color: 'white'}} onChangeText={value => this.setState({ newName: value })} />
                            </Item>
                            <Item floatingLabel>
                                <Label style={{color: 'white'}}>Description</Label>
                                <Input style={{color: 'white'}} onChangeText={value => this.setState({ newDescription: value })} />
                            </Item>
                            <Item floatingLabel>
                                <Label style={{color: 'white'}}>Icon</Label>
                                <Input style={{color: 'white'}} onChangeText={value => this.setState({ newIcon: value })} />
                            </Item>
                            <Item floatingLabel>
                                <Label style={{color: 'white'}}>Color</Label>
                                <Input style={{color: 'white'}} onChangeText={value => this.setState({ newColor: value })} />
                            </Item>
                        </Form>
                        <View padder style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Button onPress={() => this.cancelAdd()} style={{backgroundColor: '#52e3c2'}}>
                                <Text>Cancel</Text>
                            </Button>
                            <Button onPress={() => this.persistNew()} style={{backgroundColor: '#52e3c2'}}>
                                <Text>Save</Text>
                            </Button>
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
                    renderContent={this.renderCatalogDataContent}
                    style={{borderWidth: 0}}>
                </Accordion>
            );
        } else {
            return (<Text style={{color: 'white'}}>No Activities in Catalog. Add one!</Text>);
        }
    }

    renderCatalogDataHeader(item, expanded) {
        return (
            <View padder style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#40c4ff",
                borderColor: "white",
                borderStyle: 'solid',
                borderWidth: 3,
                marginTop: 5
            }}>
                <Text style={{ fontWeight: "600", color: "white" }}>{item.name}</Text>
                {expanded
                    ? <Icon style={{ fontSize: 18, color: 'white' }} name="arrow-up" />
                    : <Icon style={{ fontSize: 18, color: 'white' }} name="arrow-down" />}
            </View>);
    }

    renderCatalogDataContent(item) {
        return (
            <View padder style={{ backgroundColor: 'white', borderColor: "#40c4ff", borderStyle: 'solid', borderWidth: 3 }}>
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