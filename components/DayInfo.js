import React, { Component } from "react";
import { Card, CardItem, Body, Text } from "native-base";
import moment from 'moment'

export default class DayInfo extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card transparent>
                <CardItem header bordered>
                    <Text>{this.formatDate(this.props.date)}</Text>
                </CardItem>
            </Card>
        );
    }

    formatDate(date) {
        return moment(date).format('MMM Do YYYY');
    }
}