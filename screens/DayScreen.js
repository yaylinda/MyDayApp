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
            <Content padder style={{ backgroundColor: '#282833' }}>
                <View>
                    <Carousel
                        ref={c => this.carousel = c}
                        data={this.state.daysData}
                        renderItem={this.renderItem}
                        vertical={true}
                        onSnapToItem={(index) => this.setState({ activeSlide: index })}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        sliderHeight={Dimensions.get('window').height * 0.8}
                        itemHeight={Dimensions.get('window').height * 0.8}
                    />
                    <Pagination style={{borderWidth:1, borderColor:'white'}}
                        dotsLength={this.state.daysData.length}
                        activeDotIndex={this.state.activeSlide}
                        containerStyle={{
                            paddingVertical: 8
                        }}
                        dotColor={'rgba(255, 255, 255, 0.92)'}
                        dotStyle={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            marginHorizontal: 8
                        }}
                        inactiveDotColor={'black'}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        carouselRef={this.carousel}
                        tappableDots={!!this.carousel}
                    />
                </View>


                {/* TODO - move this entire element somewhere else... maybe the footer? 
                    need to think about where to put the function handlers as well */}
                {/* <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{ }}
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
                </Fab> */}
            </Content>
        );
    }

    renderItem = ({ item, index }) => {
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