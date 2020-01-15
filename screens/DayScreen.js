import React, { Component } from 'react';
import {
    Container, Content, DeckSwiper, Button, Icon, Text, View,
} from 'native-base';
import { host } from '../util/Constants';
import { AsyncStorage, Dimensions } from 'react-native';
import DayInfo from './DayInfoScreen';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class DayScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            daysData: [],
            catalogData: { 'ACTIVITY': [], 'EMOTION': [] },
            loadedDayData: false,
            errorMessage: ''
        }
        console.log('[DayScreen] constructor');
    }

    componentDidMount() {
        this.loadDayData();
        this.loadCatalogData();
    }

    render() {
        
        return (
            <Content padder style={{ flex: 1, backgroundColor: '#282833' }}>
                <View>
                    <Carousel
                        layout={'stack'} layoutCardOffset={`18`}
                        ref={(c) => { this._carousel = c; }}
                        data={this.state.daysData}
                        renderItem={this.renderItem}
                        sliderWidth={Dimensions.get('window').width}
                        itemWidth={Dimensions.get('window').width}
                    />
                </View>
            </Content>
        );
    }

    renderItem = ({item, index}) => {
        return (<DayInfo key={index} day={item} catalogData={this.state.catalogData} />);
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
            // console.log(`[CatalogScreen] json: ${JSON.stringify(json)}`);
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