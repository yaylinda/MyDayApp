import React, { Component } from "react";
import { Card, CardItem, Text, Button, Container, Left, Right } from "native-base";
import moment from 'moment'
import Modal from "react-native-modal";

export default class DayInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAddActivityModal: false,
            showAddEmotionModal: false
        }
        console.log('[DayInfo] constructor');
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#282833'}}>
                <Card transparent style={{ flex: 1, backgroundColor: '#282833'}}>
                    <CardItem header bordered style={{ backgroundColor: '#282833' }}>
                        <Text style={{color: '#ff4495', fontSize: 18}}>{this.formatDate(this.props.day.date)}</Text>
                    </CardItem>
                    <CardItem bordered style={{ backgroundColor: '#282833' }}>
                        <Card transparent style={{ backgroundColor: '#282833' }}>
                            <CardItem style={{ backgroundColor: '#282833' }}>
                                { this.renderActivities() }
                            </CardItem>
                            <CardItem style={{ backgroundColor: '#282833' }}>
                                <Button onPress={() => this.addActivity()} style={{backgroundColor: '#52e3c2', justifyContent: 'center'}}><Text>Add Activity</Text></Button>
                            </CardItem>
                        </Card>
                    </CardItem>
                    <CardItem bordered style={{ backgroundColor: '#282833' }}>
                        <Card transparent style={{ backgroundColor: '#282833' }}>
                            <CardItem style={{ backgroundColor: '#282833' }}>
                                { this.renderEmotions() }
                            </CardItem>
                            <CardItem style={{ backgroundColor: '#282833' }}>
                                <Button onPress={() => this.addEmotion()} style={{backgroundColor: '#52e3c2', justifyContent: 'center'}}><Text>Add Emotion</Text></Button>
                            </CardItem>
                        </Card>
                    </CardItem>
                </Card>

                <Modal isVisible={this.state.showAddActivityModal}>
                    <Card transparent style={{ backgroundColor: '#40424f'}}>
                        <CardItem header bordered style={{ backgroundColor: '#40424f'}}>
                            <Text>Add Activity</Text>
                        </CardItem>
                        <CardItem style={{ backgroundColor: '#40424f'}}>
                            
                        </CardItem>
                        <CardItem style={{ backgroundColor: '#40424f'}}>
                            <Left>
                                <Button onPress={() => this.cancelActivityModal()}><Text>Cancel</Text></Button>
                            </Left>
                            <Right>
                                <Button onPress={() => this.saveNewActivity()}><Text>Save</Text></Button>
                            </Right>
                        </CardItem>
                    </Card>
                </Modal>

            </Container>
        );
    }

    addActivity() {
        console.log(`[DayInfo] addActivity pressed`);
        this.setState({ showAddActivityModal: true });
    }

    cancelActivityModal() {
        console.log(`[DayInfo] cancelActivityModal pressed`);
        this.setState({ showAddActivityModal: false });
    }

    saveNewActivity() {
        console.log(`[DayInfo] saveNewActivity pressed`);
        this.setState({ showAddActivityModal: false });
    }

    addEmotion() {
        console.log(`[DayInfo] addEmotion pressed`);
    }

    renderActivities() {
        const activities = this.props.day.events.filter((e) => e.type === 'ACTIVITY');

        if (activities.length) {
            return (
            <Container>
                {activities.map((item, index) => {
                    return (<Button key={index}><Text>{item.name}</Text></Button>);
                })}

            </Container>);
        } else {
            return (<Text style={{color: 'white'}}>No Activites Today</Text>);
        }
    }

    renderEmotions() {
        const emotions = this.props.day.events.filter((e) => e.type === 'EMOTION');

        if (emotions.length) {
            return (
            <Container>
                {emotions.map((item, index) => {
                    return (<Button key={index}><Text>{item.name}</Text></Button>);
                })}

            </Container>);
        } else {
            return (<Text style={{color: 'white'}}>No Emotions Today</Text>);
        }
    }

    formatDate(date) {
        return moment(date, "YYYY-MM-DD").format('dddd, MMM Do YYYY');
    }
}