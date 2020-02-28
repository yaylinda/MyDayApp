import React, { Component } from "react";
import { Card, CardItem, Text, Button, View, Picker, Icon, ListItem, CheckBox, Body, List, Fab, Content } from "native-base";
import moment from 'moment'
import Modal from "react-native-modal";
import { AsyncStorage, Dimensions, TouchableOpacity, Alert } from "react-native";
import { HOST, COLORS } from "../util/Constants";

export default class DayInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventTypeToEdit: '',
            dayEventIdToEdit: '',
        }
    }

    render() {
        return (
            <Content padder style={{
                backgroundColor: COLORS.BACKGROUND_LIGHT,
                height: Dimensions.get('window').height * 0.80,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: 'white'
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: '800', color: '#52e3c2' }}>
                        {this.formatDate(this.props.day.date)}
                    </Text>
                </View>

                <Card transparent style={{ backgroundColor: COLORS.BACKGROUND_LIGHT }}>
                    <CardItem header bordered style={{
                        backgroundColor: COLORS.BACKGROUND_LIGHT,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ color: '#ff4495', fontSize: 18 }}>Scores</Text>

                    </CardItem>
                    <CardItem style={{ backgroundColor: COLORS.BACKGROUND_LIGHT }}>
                        {this.renderEmotions()}
                    </CardItem>
                </Card>

                <Card transparent style={{ backgroundColor: COLORS.BACKGROUND_LIGHT }}>
                    <CardItem header bordered style={{
                        backgroundColor: COLORS.BACKGROUND_LIGHT,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ color: '#ff4495', fontSize: 18 }}>Activities</Text>

                    </CardItem>
                    <CardItem style={{ backgroundColor: COLORS.BACKGROUND_LIGHT }}>
                        {this.renderActivities()}
                    </CardItem>
                </Card>

                <Card transparent style={{ backgroundColor: COLORS.BACKGROUND_LIGHT }}>
                    <CardItem header bordered style={{
                        backgroundColor: COLORS.BACKGROUND_LIGHT,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ color: '#ff4495', fontSize: 18 }}>Prompts</Text>

                    </CardItem>
                    <CardItem style={{ backgroundColor: COLORS.BACKGROUND_LIGHT }}>
                        {this.renderPrompts()}
                    </CardItem>
                </Card>

            </Content>
        );
    }

    renderEmotions() {
        if (this.props.day.emotions.length) {
            return (
                <View style={{ flex: 1 }}>
                    {
                        this.props.day.emotions.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} activeOpacity={0.5} onLongPress={() => this.setState({
                                    showEditScoresButton: true,
                                    eventTypeToEdit: 'EMOTION',
                                    dayEventIdToEdit: item.dayEventId,
                                })}>
                                    <View key={index} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                                        <View padder style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            width: 110,
                                            backgroundColor: COLORS.BACKGORUND_ACCENT,
                                            borderTopLeftRadius: 10,
                                            borderBottomLeftRadius: 10
                                        }}>
                                            <Text style={{ color: 'white', fontWeight: "500" }}>{item.startTime}</Text>
                                        </View>
                                        <View padder style={{
                                            flexGrow: (this.state.dayEventIdToEdit === item.dayEventId) ? 0.5 : 1,
                                            backgroundColor: COLORS.BACKGORUND_ACCENT,
                                            borderTopRightRadius: 10,
                                            borderBottomRightRadius: 10
                                        }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                {this.renderDayScore(item.emotionScore)}
                                            </View>
                                        </View>
                                        {
                                            (this.state.dayEventIdToEdit === item.dayEventId) ?
                                                <View padder style={{
                                                    flexGrow: (this.state.dayEventIdToEdit === item.dayEventId) ? 0.4 : 0
                                                }}>
                                                    <Button
                                                        style={{ backgroundColor: 'red', justifyContent: 'center' }}
                                                        onPress={() => Alert.alert(
                                                            'Are you sure?',
                                                            `This will delete the score from this day.`,
                                                            [
                                                                { text: 'Cancel', onPress: () => this.setState({dayEventIdToEdit: ''}) },
                                                                { text: 'OK', onPress: () => this.handleDeleteConfirmation() }
                                                            ])
                                                        }
                                                    >
                                                        <Text>Delete</Text>
                                                    </Button>
                                                </View> : null
                                        }
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    }
                </View>);
        } else {
            return (<Text style={{ color: 'white', fontStyle: 'italic' }}>No scores for this day yet</Text>);
        }
    }

    renderDayScore(score) {
        const scoreHtml = [];
        for (let i = 0; i < score; i++) {
            scoreHtml.push(<Icon key={i} name="star" style={{ fontSize: 18, color: '#ffd900' }}></Icon>);
        }
        return scoreHtml;
    }

    renderActivities() {
        if (this.props.day.activities.length) {
            return (
                <View style={{ flex: 1 }}>
                    {this.props.day.activities.map((item, index) => {
                        return (
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                                <View padder style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    width: 110,
                                    backgroundColor: COLORS.BACKGORUND_ACCENT,
                                    borderTopLeftRadius: 10,
                                    borderBottomLeftRadius: 10
                                }}>
                                    <Text style={{ color: 'white', fontWeight: "500" }}>{item.startTime}</Text>
                                </View>
                                <View padder style={{
                                    flexGrow: 1,
                                    backgroundColor: COLORS.BACKGORUND_ACCENT,
                                    borderTopRightRadius: 10,
                                    borderBottomRightRadius: 10
                                }}>
                                    <Text style={{ color: 'white' }}>{item.icon} {item.name}</Text>
                                </View>
                            </View>
                        );
                    })}

                </View>);
        } else {
            return (<Text style={{ color: 'white', fontStyle: 'italic' }}>No activities for this day yet</Text>);
        }
    }

    renderPrompts() {
        if (this.props.day.prompts.length) {
            return (
                <View style={{ flex: 1 }}>
                    {
                        this.props.day.prompts.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                                    <View padder style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        maxWidth: 110,
                                        backgroundColor: COLORS.BACKGORUND_ACCENT,
                                        borderTopLeftRadius: 10,
                                        borderBottomLeftRadius: 10
                                    }}>
                                        <Text style={{ color: 'white', fontWeight: "600" }}>{item.startTime}</Text>
                                    </View>
                                    <View padder style={{
                                        flexGrow: 1,
                                        backgroundColor: COLORS.BACKGORUND_ACCENT,
                                        borderTopRightRadius: 10,
                                        borderBottomRightRadius: 10
                                    }}>
                                        <View>
                                            <View style={{ flexDirection: 'row', borderBottomColor: '#b4b8cd', borderBottomWidth: 1, paddingBottom: 5 }}>
                                                <Text style={{ flex: 1, color: 'white' }}>{item.question}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                                <Text style={{ flex: 1, color: 'white' }}>{item.selectedAnswer}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    }
                </View>
            );
        } else {
            return (<Text style={{ color: 'white', fontStyle: 'italic' }}>No answered prompts for this day yet</Text>);
        }
    }

    async handleDeleteConfirmation() {
        await this.props.actions.deleteDayEvent(this.props.day.dayId, this.state.eventTypeToEdit, this.state.dayEventIdToEdit);
        this.resetState();
    }

    resetState() {
        this.setState({
            eventTypeToEdit: '',
            dayEventIdToEdit: '',
        });
    }

    formatDate(date) {
        return moment(date, "YYYY-MM-DD").format('ddd, MMM Do YYYY');
    }
}