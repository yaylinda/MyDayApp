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
            selectedActivityIndex: -1,
            selectedEmotionScore: 0,
            selectedHearts: [false, false, false, false, false],
            heartLabels: ['Bad', 'Kind of bad', 'Okay', 'Pretty good', 'Good'],
        }
        console.log('[DayInfo] constructor');
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#282833' }}>

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#52e3c2' }}>{this.formatDate(this.state.day.date)}</Text>
                </View>

                <Card transparent style={{ backgroundColor: '#282833' }}>
                    <CardItem header bordered style={{ backgroundColor: '#282833' }}>
                        <Text style={{ color: '#ff4495', fontSize: 18 }}>Day's Scores</Text>
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833' }}>
                        {this.renderEmotions()}
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833', flexDirection: 'row', justifyContent: 'center' }}>
                        <Button rounded
                            onPress={() => this.setState({ showAddModal: true, addType: 'EMOTION' })}
                            style={{ backgroundColor: '#ff4495' }}>
                            <Icon name="add-circle" />
                        </Button>
                    </CardItem>
                </Card>


                <Card transparent style={{ backgroundColor: '#282833' }}>
                    <CardItem header bordered style={{ backgroundColor: '#282833' }}>
                        <Text style={{ color: '#ff4495', fontSize: 18 }}>Day's Activities</Text>
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833' }}>
                        {this.renderActivities()}
                    </CardItem>
                    <CardItem style={{ backgroundColor: '#282833', flexDirection: 'row', justifyContent: 'center' }}>
                        <Button rounded
                            onPress={() => this.setState({ showAddModal: true, addType: 'ACTIVITY' })}
                            style={{ backgroundColor: '#ff4495' }}>
                            <Icon name="add-circle" />
                        </Button>
                    </CardItem>
                </Card>

                <Modal isVisible={this.state.showAddModal && this.state.addType === 'EMOTION'}>
                    <View transparent style={{ backgroundColor: '#40424f', justifyContent: 'center', borderRadius: 5 }}>
                        <View style={{ paddingTop: 30, paddingBottom: 10, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: "600", color: '#52e3c2' }}>
                                How is your day going?
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            { this.renderHearts() }
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            { this.renderHeartsText() }
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

                <Modal isVisible={this.state.showAddModal && this.state.addType === 'ACTIVITY'}>
                    <View transparent style={{ backgroundColor: '#40424f', justifyContent: 'center', borderRadius: 5 }}>
                        <View style={{ paddingTop: 30, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: "600", color: '#52e3c2' }}>Add Day Event</Text>
                        </View>
                        <Form style={{ marginBottom: 20 }}>
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

            </Container>
        );
    }

    renderEmotions() {
        if (this.state.day.emotions.length) {
            return (
                <View style={{flex: 1}}>
                    {
                        this.state.day.emotions.map((item, index) => {
                            return (
                                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 5}}>
                                    <View padder style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        width: 110,
                                        backgroundColor: '#40c4ff',
                                        borderColor: '#40c4ff',
                                        borderWidth: 3,
                                        borderTopLeftRadius: 5,
                                        borderBottomLeftRadius: 5}}>
                                        <Text style={{color: 'white', fontWeight: "600"}}>{item.startTime}</Text>
                                    </View>
                                    <View padder style={{
                                        flexGrow: 1,
                                        backgroundColor: 'white',
                                        borderColor: '#40c4ff',
                                        borderWidth: 3,
                                        borderTopRightRadius: 5,
                                        borderBottomRightRadius: 5}}>
                                        <View style={{flexDirection: 'row'}}>
                                            { this.renderDayScore(item.emotionScore) }
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    }
                </View>);
        } else {
            return (<Text style={{ color: 'white' }}>No Scores for Today</Text>);
        }
    }

    renderActivities() {
        if (this.state.day.activities.length) {
            return (
                <View style={{flex: 1}}>
                    {this.state.day.activities.map((item, index) => {
                        return (
                            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 5}}>
                                <View padder style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    width: 110,
                                    backgroundColor: '#40c4ff',
                                    borderColor: '#40c4ff',
                                    borderWidth: 3,
                                    borderTopLeftRadius: 5,
                                    borderBottomLeftRadius: 5}}>
                                    <Text style={{color: 'white', fontWeight: "600"}}>{item.startTime}</Text>
                                </View>
                                <View padder style={{
                                    flexGrow: 1,
                                    backgroundColor: 'white',
                                    borderColor: '#40c4ff',
                                    borderWidth: 3,
                                    borderTopRightRadius: 5,
                                    borderBottomRightRadius: 5}}>
                                    <Text>
                                        { item.name }
                                    </Text>
                                </View>
                            </View>
                        );
                    })}

                </View>);
        } else {
            return (<Text style={{ color: 'white' }}>No Activites for Today</Text>);
        }
    }

    renderPrompts() {
        // TODO - implement
    }

    renderDayEventsPickerItems() {
        if (this.props.catalogData && this.state.addType) {
            return this.props.catalogData[this.state.addType].map((catalog, index) => {
                return (<Picker.Item key={index} value={index} label={catalog.name}></Picker.Item>);
            });
        }
    }

    renderHearts() {
        return this.state.selectedHearts.map((h, index) => {
            return (
                <Button transparent key={index} onPress={() => this.toggleHearts(index)}>
                    {
                        this.state.selectedHearts[index] ?
                            <Icon name="star" style={{ fontSize: 30, fontWeight: "500", color: '#ffd900' }}></Icon> :
                            <Icon name="star-outline" style={{ fontSize: 30, fontWeight: "500", color: '#ffd900' }}></Icon>
                    }
                </Button>
            );
        });
    }

    renderHeartsText() {
        if (this.state.selectedEmotionScore) {
        return (<Text style={{ fontWeight: "500", color: '#ffd900' }}>{ this.state.heartLabels[this.state.selectedEmotionScore - 1] }</Text>);
        }
    }

    renderDayScore(score) {
        const scoreHtml = [];
        for (let i = 0; i < score; i++) {
            scoreHtml.push(<Icon name="star" style={{ fontSize: 18, color: '#ffd900' }}></Icon>);
        }
        return scoreHtml;
    }

    cancelAdd() {
        console.log(`[DayInfo] cancel add new`);
        this.setState({
            showAddModal: false,
            addType: '',
            selectedActivityIndex: -1,
            selectedEmotionScore: 0,
            selectedHearts: [false, false, false, false, false]
        });
    }

    toggleHearts(heartIndex) {
        let tempHearts = [false, false, false, false, false];

        for (let i = 0; i < this.state.selectedHearts.length; i++) {
            tempHearts[i] = true;
            if (i === heartIndex) {
                break;
            }
        }

        this.setState({ selectedHearts: tempHearts });
        this.setState({ selectedEmotionScore: heartIndex + 1 });
    }

    async persistNew() {
        console.log(`[DayInfo] persist new ${this.state.addType}`);
        const sessionToken = await AsyncStorage.getItem('sessionToken');
        const endpoint = `${host}/days/${this.state.day.dayId}/${this.state.addType}`;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Session-Token': sessionToken
        };

        let body = {};
        if (this.state.addType === 'ACTIVITY') {
            const newDayEvent = this.props.catalogData[this.state.addType][this.state.selectedDayEventIndex];
            body = newDayEvent;
        } else if (this.state.addType === 'EMOTION') {
            body['emotionScore'] = this.state.selectedEmotionScore;
            body['description'] = ''; // TODO - get description input later
        } else if (this.state.addType === 'PROMPT') {
            // TODO - implement prompt
        }
        body['startTime'] = moment().format('hh:mm A');
        body['endTime'] = '';

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
            console.log(`[DayInfo] json: ${JSON.stringify(json)}`);
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
                selectedActivityIndex: -1,
                selectedEmotionScore: 0,
                selectedHearts: [false, false, false, false, false]
            });
        });

    }

    formatDate(date) {
        return moment(date, "YYYY-MM-DD").format('dddd, MMM Do YYYY');
    }
}