import React, { Component } from "react";
import { Card, CardItem, Text, Button, Container } from "native-base";
import moment from 'moment'

export default class DayInfo extends Component {

    constructor(props) {
        super(props);
        console.log('[DayInfo] constructor');
    }

    render() {
        return (
            <Card transparent style={{ backgroundColor: '#282833'}}>
                <CardItem header bordered style={{ backgroundColor: '#282833' }}>
                    <Text style={{color: '#ff4495', fontSize: 18}}>{this.formatDate(this.props.day.date)}</Text>
                </CardItem>
                <CardItem bordered style={{ backgroundColor: '#282833' }}>
                    <Card transparent style={{ backgroundColor: '#282833' }}>
                        <CardItem style={{ backgroundColor: '#282833' }}>
                            { this.renderActivities() }
                        </CardItem>
                        <CardItem style={{ backgroundColor: '#282833' }}>
                            <Button style={{backgroundColor: '#52e3c2', justifyContent: 'center'}}><Text>Add Activity</Text></Button>
                        </CardItem>
                    </Card>
                </CardItem>
                <CardItem bordered style={{ backgroundColor: '#282833' }}>
                    <Card transparent style={{ backgroundColor: '#282833' }}>
                        <CardItem style={{ backgroundColor: '#282833' }}>
                            { this.renderEmotions() }
                        </CardItem>
                        <CardItem style={{ backgroundColor: '#282833' }}>
                            <Button style={{backgroundColor: '#52e3c2', justifyContent: 'center'}}><Text>Add Emotion</Text></Button>
                        </CardItem>
                    </Card>
                </CardItem>
            </Card>
        );
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