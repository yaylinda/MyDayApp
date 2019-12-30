import React, { Component } from 'react';
import {
  Container,
} from 'native-base';
import { host } from '../util/Constants';
import { AsyncStorage } from 'react-native';
import DayInfo from '../components/DayInfo';

export default class DayScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            daysData: [],
            catalogData: { 'ACTIVITY': [], 'EMOTION': [] },
            loadedDayData: false,
            errorMessage: ''
        }
    }

    componentDidMount() {
        this.loadDayData();
        this.loadCatalogData();
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#282833' }}>
                {
                    this.state.daysData.map((item, index) => {
                        return (<DayInfo key={index} day={item} catalogData={this.state.catalogData}></DayInfo>);
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