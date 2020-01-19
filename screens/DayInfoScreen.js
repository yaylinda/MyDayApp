import React, { Component } from "react";
import { Card, CardItem, Text, Button, View, Picker, Icon, ListItem, CheckBox, Body, List, Fab, Content } from "native-base";
import moment from 'moment'
import Modal from "react-native-modal";
import { AsyncStorage, Dimensions } from "react-native";
import { host } from "../util/Constants";

export default class DayInfo extends Component {

    constructor(props) {
        super(props);
        console.log('[DayInfo] constructor');
    }

    render() {
        return (
            <Content padder style={{
                backgroundColor: '#32323e',
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

                <Card transparent style={{ backgroundColor: '#32323e' }}>
                    <CardItem header bordered style={{
                        backgroundColor: '#32323e',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ color: '#ff4495', fontSize: 18 }}>Day Scores</Text>

                    </CardItem>
                    <CardItem style={{ backgroundColor: '#32323e' }}>
                        {this.renderEmotions()}
                    </CardItem>
                </Card>

                <Card transparent style={{ backgroundColor: '#32323e' }}>
                    <CardItem header bordered style={{
                        backgroundColor: '#32323e',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ color: '#ff4495', fontSize: 18 }}>Day Activities</Text>

                    </CardItem>
                    <CardItem style={{ backgroundColor: '#32323e' }}>
                        {this.renderActivities()}
                    </CardItem>
                </Card>

                <Card transparent style={{ backgroundColor: '#32323e' }}>
                    <CardItem header bordered style={{
                        backgroundColor: '#32323e',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ color: '#ff4495', fontSize: 18 }}>Day Prompts</Text>

                    </CardItem>
                    <CardItem style={{ backgroundColor: '#32323e' }}>
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
                                <View key={index} style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                                    <View padder style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        width: 110,
                                        backgroundColor: '#40c4ff',
                                        borderColor: '#40c4ff',
                                        borderWidth: 3,
                                        borderTopLeftRadius: 5,
                                        borderBottomLeftRadius: 5
                                    }}>
                                        <Text style={{ color: 'white', fontWeight: "600" }}>{item.startTime}</Text>
                                    </View>
                                    <View padder style={{
                                        flexGrow: 1,
                                        backgroundColor: 'white',
                                        borderColor: '#40c4ff',
                                        borderWidth: 3,
                                        borderTopRightRadius: 5,
                                        borderBottomRightRadius: 5
                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            {this.renderDayScore(item.emotionScore)}
                                        </View>
                                    </View>
                                </View>
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
                                    backgroundColor: '#40c4ff',
                                    borderColor: '#40c4ff',
                                    borderWidth: 3,
                                    borderTopLeftRadius: 5,
                                    borderBottomLeftRadius: 5
                                }}>
                                    <Text style={{ color: 'white', fontWeight: "600" }}>{item.startTime}</Text>
                                </View>
                                <View padder style={{
                                    flexGrow: 1,
                                    backgroundColor: 'white',
                                    borderColor: '#40c4ff',
                                    borderWidth: 3,
                                    borderTopRightRadius: 5,
                                    borderBottomRightRadius: 5
                                }}>
                                    <Text>
                                        {item.name}
                                    </Text>
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
                                        width: 110,
                                        backgroundColor: '#40c4ff',
                                        borderColor: '#40c4ff',
                                        borderWidth: 3,
                                        borderTopLeftRadius: 5,
                                        borderBottomLeftRadius: 5
                                    }}>
                                        <Text style={{ color: 'white', fontWeight: "600" }}>{item.startTime}</Text>
                                    </View>
                                    <View padder style={{
                                        flexGrow: 1,
                                        backgroundColor: 'white',
                                        borderColor: '#40c4ff',
                                        borderWidth: 3,
                                        borderTopRightRadius: 5,
                                        borderBottomRightRadius: 5
                                    }}>
                                        <View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: '600' }}>Q: </Text>
                                                <Text>{item.question}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: '600' }}>A: </Text>
                                                <Text>{item.selectedAnswer}</Text>
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

    formatDate(date) {
        return moment(date, "YYYY-MM-DD").format('ddd, MMM Do YYYY');
    }
}