import React, { Component } from "react";
import { Card, CardItem, Text, Button, Container, Left, Right, View, Picker, Form, Item, Icon } from "native-base";
import moment from 'moment'
import Modal from "react-native-modal";
import { AsyncStorage } from "react-native";
import { host } from "../util/Constants";
import { Rating } from 'react-native-ratings';


export default class DayInfo extends Component {

    static navigationOptions = {
        title: 'Home',
      };

    constructor(props) {
        super(props);
        this.state = {
            day: this.props.day,
            errorMessage: '',
            showAddModal: false,
            addType: '',
            selectedNewDayEvent: -1,
            selectedEmotionRanking: -1
        }
        console.log('[DayInfo] constructor');
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#282833'}}>
                
                <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#52e3c2'}}>{this.formatDate(this.state.day.date)}</Text>
                </View>

                <Card transparent style={{ backgroundColor: '#282833' }}>
                    <CardItem header bordered style={{ backgroundColor: '#282833' }}>
                        <Text style={{color: '#ff4495', fontSize: 18}}>Day's Emotions</Text>
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833' }}>
                        { this.renderEmotions()}
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833', flexDirection: 'row', justifyContent: 'center' }}>
                        <Button rounded
                            onPress={() => this.setState({ showAddModal: true, addType: 'EMOTION'  })}
                            style={{backgroundColor: '#ff4495'}}>
                            <Icon name="add-circle" />
                        </Button>
                    </CardItem>
                </Card>
                

                <Card transparent style={{ backgroundColor: '#282833' }}>
                    <CardItem header bordered style={{ backgroundColor: '#282833' }}>
                        <Text style={{color: '#ff4495', fontSize: 18}}>Day's Activities</Text>
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833' }}>
                        { this.renderActivities() }
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833', flexDirection: 'row', justifyContent: 'center' }}>
                        <Button rounded
                            onPress={() => this.setState({ showAddModal: true, addType: 'ACTIVITY' })}
                            style={{backgroundColor: '#ff4495'}}>
                            <Icon name="add-circle" />
                        </Button>
                    </CardItem>
                </Card>

                <Modal isVisible={this.state.showAddModal && this.state.addType === 'EMOTION'}>
                <View transparent style={{ backgroundColor: '#40424f', justifyContent: 'center', borderRadius: 5 }}>
                        <View style={{ paddingTop: 30, paddingBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: "600", color: '#52e3c2'}}>How do you feel?</Text>
                        </View>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                            <Icon name="heart-empty" style={{ fontSize: 30, fontWeight: "500", color: '#ff4b12'}}></Icon>
                            <Icon name="heart-empty" style={{ fontSize: 30, fontWeight: "500", color: '#ff4b12'}}></Icon>
                            <Icon name="heart-empty" style={{ fontSize: 30, fontWeight: "500", color: '#ff4b12'}}></Icon>
                            <Icon name="heart-empty" style={{ fontSize: 30, fontWeight: "500", color: '#ff4b12'}}></Icon>
                            <Icon name="heart-empty" style={{ fontSize: 30, fontWeight: "500", color: '#ff4b12'}}></Icon>
                        </View>

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

                <Modal isVisible={this.state.showAddModal && this.state.addType === 'ACTIVITY'}>
                    <View transparent style={{ backgroundColor: '#40424f', justifyContent: 'center', borderRadius: 5 }}>
                        <View style={{ paddingTop: 30, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: "600", color: '#52e3c2'}}>Add Day Event</Text>
                        </View>
                        <Form style={{marginBottom: 20}}>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Select Day Event"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.selectedDayEventIndex}
                                    onValueChange={value => this.setState({ selectedDayEventIndex: value })}>
                                    {
                                        this.renderDayEventsPickerItems()
                                    }
                                </Picker>
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

    renderActivities() {
        const activities = this.state.day.events.filter((e) => e.type === 'ACTIVITY');

        if (activities.length) {
            return (
            <View>
                {activities.map((item, index) => {
                    return (<Button key={index}><Text>{item.name}</Text></Button>);
                })}

            </View>);
        } else {
            return (<Text style={{color: 'white'}}>No Activites Today</Text>);
        }
    }

    renderEmotions() {
        const emotions = this.state.day.events.filter((e) => e.type === 'EMOTION');

        if (emotions.length) {
            return (
            <View>
                {emotions.map((item, index) => {
                    return (<Button key={index}><Text>{item.name}</Text></Button>);
                })}

            </View>);
        } else {
            return (<Text style={{color: 'white'}}>No Emotions Today</Text>);
        }
    }

    renderDayEventsPickerItems() {
        if (this.props.catalogData && this.state.addType) {
            return this.props.catalogData[this.state.addType].map((catalog, index) => {
                return (<Picker.Item key={index} value={index} label={catalog.name}></Picker.Item>);
            });
        }
    }

    cancelAdd() {
        console.log(`[DayInfo] cancel add new`);
        this.setState({
            showAddModal: false,
            addType: '',
            selectedNewDayEvent: -1
        });
    }

    async persistNew() {
        console.log(`[DayInfo] persist new`);
        const sessionToken = await AsyncStorage.getItem('sessionToken');
        const endpoint = `${host}/days/${this.state.day.dayId}`;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Session-Token': sessionToken
        };

        const newDayEvent = this.props.catalogData[this.state.addType][this.state.selectedDayEventIndex];
        newDayEvent.startTime = moment().format('hh:mm A');
        newDayEvent.endTime = '';

        const body = this.state.day;
        body.events.push(newDayEvent);
        
        console.log(`[DayInfo] calling ${endpoint}, with ${JSON.stringify(body)}`);

        let requestSuccess = false;

        fetch(endpoint, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
        }).then((response) => {
            if (response.ok) {
                requestSuccess = true;
                console.log(`[DayInfo] successfully updated day`);
            } else {
                requestSuccess = false;
                console.log(`[DayInfo] error updating day`);
            }
            return response.json();
        }).then((json) => {
            console.log(`[DayInfo] json: ${json}`);
            if (requestSuccess) {
                console.log(`[DayInfo] updating this.state.day`);
                this.setState({ day: json });
            } else {
                console.log(`[DayInfo] error posting new event with error message: ${json.message}`);
                this.errorMessage = json.message;
            }

            this.setState({
                showAddModal: false,
                addType: '',
                selectedNewDayEvent: -1
            });
        });

    }

    formatDate(date) {
        return moment(date, "YYYY-MM-DD").format('dddd, MMM Do YYYY');
    }
}