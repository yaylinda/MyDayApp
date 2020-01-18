import React, { Component } from 'react';
import {
    Container, Content, DeckSwiper, Button, Icon, Text, View, Fab,
} from 'native-base';
import { host } from '../util/Constants';
import { AsyncStorage, Dimensions } from 'react-native';
import DayInfo from './DayInfoScreen';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
export default class DayScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            daysData: [],
            activeSlide: 0,
            catalogData: { 'ACTIVITY': [], 'EMOTION': [] },
            loadedDayData: false,
            errorMessage: '',

            // states for FAB actions
            active: false,
            showAddModal: false,
            addType: '',

        }
        console.log('[DayScreen] constructor');
    }

    componentDidMount() {
        this.loadDayData();
        this.loadCatalogData();
    }

    render() {

        return (
            <Content scrollEnabled={false} style={{ backgroundColor: '#282833', flex: 1}}>
                <View style={{ marginBottom: 20 }}>
                    <Carousel
                        layout={'stack'}
                        ref={c => this.carousel = c}
                        data={this.state.daysData}
                        renderItem={this.renderItem}
                        onSnapToItem={(index) => this.setState({ activeSlide: index })}
                        sliderWidth={Dimensions.get('window').width}
                        itemWidth={Dimensions.get('window').width * 0.85}
                    />
                </View>
                <View>
                    <Pagination
                        dotsLength={this.state.daysData.length}
                        activeDotIndex={this.state.activeSlide}
                        containerStyle={{
                            paddingVertical: 0
                        }}
                        dotColor={'white'}
                        dotStyle={{
                            width: 8,
                            height: 8,
                            borderRadius: 8
                        }}
                        inactiveDotColor={'#b4b8cd'}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        carouselRef={this.carousel}
                        tappableDots={!!this.carousel}
                    />
                </View>
                { this.renderFab() }
            </Content>
        );
    }

    renderItem = ({ item, index }) => {
        return (
            <DayInfo 
                key={index} 
                day={item} 
                catalogData={this.state.catalogData} 
                showFab={index === 0}
            />
        );
    }

    renderFab() {
            return (
                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{ paddingRight: 20}}
                    style={{ backgroundColor: '#ff4495'}}
                    position="bottomRight"
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <Icon name="add-circle" />

                    <Button rounded small
                        onPress={() => this.handleAddRandomPrompt()}
                        style={{ backgroundColor: '#ff4495' }}>
                        <Icon name="help" style={{ fontSize: 18 }} />
                    </Button>   

                    <Button rounded small
                        onPress={() => this.setState({ showAddModal: true, addType: 'ACTIVITY' })}
                        style={{ backgroundColor: '#ff4495' }}>
                        <Icon name="apps" style={{ fontSize: 18 }} />
                    </Button>

                    <Button rounded small
                        onPress={() => this.setState({ showAddModal: true, addType: 'EMOTION' })}
                        style={{ backgroundColor: '#ff4495' }}>
                        <Icon name="star-outline" style={{ fontSize: 18 }} />
                    </Button>
                </Fab>
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