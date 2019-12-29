import React, { Component } from 'react';
import {
  Button,
  Container,
  Form,
  Item,
  Picker,
  Text,
  Header,
  Content,
  Left,
  Right,
  Body,
  Title,
  Footer,
  FooterTab,
  Icon,
  List,
  ListItem,
} from 'native-base';
import { host } from '../util/Constants';
import { FlatList, AsyncStorage } from 'react-native';
import DayInfo from '../components/DayInfo';

export default class DayScreen extends Component {

    constructor(props) {
        // TODO - get day data for user
        super(props);
        this.state = {
            daysData: [],
            loadedDayData: false,
            errorMessage: ''
        }
    }

    componentDidMount() {
        this.loadDayData();
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#282833' }}>
                {
                    this.state.daysData.map((item, index) => {
                        return (<DayInfo key={index} day={item}></DayInfo>);
                    })
                }
            </Container>
        );
    }

    async loadDayData() {
        const sessionToken = await AsyncStorage.getItem('sessionToken');

        const endpoint = `${host}/days`;
        console.log(`[DayScreen] calling ${endpoint}`);

        fetch(endpoint, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Session-Token': sessionToken
              },
        }).then((response) => {
            if (response.ok) {
                console.log(`[DayScreen] successfully retrieved day data`);
                this.state.loadedDayData = true;
            } else {
                console.log(`[DayScreen] error retrieving day data`);
                this.state.loadedDayData = false;
            }
            return response.json();
        }).then((json) => {
            console.log(`[DayScreen] json: ${JSON.stringify(json)}`);
            if (this.state.loadedDayData) {
                console.log('[DayScreen] updating state.daysData');
                this.setState({ daysData: json });
            } else {
                console.log(`[DayScreen] retrieving day data error message: ${json.message}`);
                this.errorMessage = json.message;
                // TODO - show error message on screen
            }
        })
    }

}