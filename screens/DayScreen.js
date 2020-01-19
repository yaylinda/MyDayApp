import React, { Component } from 'react';
import {
    Container, Content, DeckSwiper, Button, Icon, Text, View, Fab, List, ListItem, CheckBox, Body,
} from 'native-base';
import { host } from '../util/Constants';
import { AsyncStorage, Dimensions } from 'react-native';
import DayInfo from './DayInfoScreen';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Modal from "react-native-modal";
import moment from 'moment'

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

            // states for FAB / modal actions
            active: false,
            showAddModal: false,
            addType: '',
            selectedActivityIndex: -1,
            selectedEmotionScore: 0,
            selectedHearts: [false, false, false, false, false],
            heartLabels: ['Bad', 'Kind of bad', 'Okay', 'Pretty good', 'Good'],
            randomPromptIndex: -1,
            selectedPromptAnswerIndex: -1
        }
        console.log('[DayScreen] constructor');
    }

    componentDidMount() {
        this.loadDayData();
        this.loadCatalogData();
    }

    render() {

        return (
            <View style={{ backgroundColor: '#282833', flex: 1 }}>
                <Content scrollEnabled={false} style={{ backgroundColor: '#282833', flex: 1 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Carousel
                            layout={'stack'}
                            ref={c => this.carousel = c}
                            data={this.state.daysData}
                            renderItem={this.renderItem}
                            onSnapToItem={(index) => this.setState({ activeSlide: index })}
                            sliderWidth={Dimensions.get('window').width}
                            itemWidth={Dimensions.get('window').width * 0.85}
                            extraData={this.state.daysData}
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
                    {this.renderFab()}
                </Content>
                {this.state.showAddModal ? this.renderModal() : null}
            </View>
        );
    }

    renderItem = ({ item, index }) => {
        return (
            <DayInfo key={index} day={item} />
        );
    }

    renderFab() {
        return (
            <Fab
                active={this.state.active}
                direction="up"
                containerStyle={{ paddingRight: 20 }}
                style={{ backgroundColor: '#ff4495' }}
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

    renderModal() {
        return (
            <Modal isVisible={this.state.showAddModal}>
                <View transparent style={{ backgroundColor: '#40424f', justifyContent: 'center', borderRadius: 5 }}>

                    <View style={{ paddingTop: 30, flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: '#52e3c2' }}>{this.renderModalTitle()}</Text>
                    </View>

                    {this.renderModalContent()}

                    <View padder style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button onPress={() => this.cancelAdd()} style={{ backgroundColor: '#52e3c2' }}>
                            <Text>Cancel</Text>
                        </Button>
                        <Button onPress={() => this.persistNew()} style={{ backgroundColor: '#52e3c2' }}>
                            <Text>Save</Text>
                        </Button>
                    </View>

                </View>
            </Modal>
        );
    }

    renderModalTitle() {
        if (this.state.addType === 'EMOTION') {
            return ('New Day Score');
        } else if (this.state.addType === 'ACTIVITY') {
            return ('New Day Activity');
        } else if (this.state.addType === 'PROMPT') {
            return ('New Day Prompt');
        }
    }

    renderModalContent() {
        if (this.state.addType === 'EMOTION') {
            return (this.renderEmotionModal());
        } else if (this.state.addType === 'ACTIVITY') {
            return (this.renderActivityModal());
        } else if (this.state.addType === 'PROMPT') {
            return (this.renderPromptModal());
        }
    }

    renderEmotionModal() {
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    {this.renderHearts()}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    {this.renderHeartsText()}
                </View>
            </View>
        );
    }

    renderHearts() {
        return this.state.selectedHearts.map((h, index) => {
            return (
                <Button transparent key={index} onPress={() => this.toggleHearts(index)}>
                    {
                        this.state.selectedHearts[index] ?
                            <Icon name="star" style={{ fontSize: 30, fontWeight: "500", color: '#ffd900' }}></Icon> :
                            <Icon name="star-outline" style={{ fontSize: 30, fontWeight: "500", color: '#ffd900' }}></Icon>
                    }
                </Button>
            );
        });
    }

    renderHeartsText() {
        if (this.state.selectedEmotionScore) {
            return (<Text style={{ fontWeight: "500", color: '#ffd900' }}>{this.state.heartLabels[this.state.selectedEmotionScore - 1]}</Text>);
        }
    }

    renderActivityModal() {
        return (
            <View padder>
                <Text style={{ color: 'white' }}>Select activity</Text>
                <List>
                    {
                        this.state.catalogData['ACTIVITY'].map((item, index) => {
                            return (
                                <ListItem key={index}>
                                    <CheckBox
                                        checked={this.state.selectedActivityIndex === index}
                                        onPress={() => this.setState({ selectedActivityIndex: index })}
                                    />
                                    <Body>
                                        <Text style={{ color: 'white' }}>{item.name}</Text>
                                    </Body>
                                </ListItem>
                            );
                        })
                    }
                </List>
            </View>
        );
    }

    renderDayEventsPickerItems() {
        if (this.state.catalogData && this.state.addType) {
            return this.state.catalogData[this.state.addType].map((catalog, index) => {
                return (<Picker.Item key={index} value={index} label={catalog.name}></Picker.Item>);
            });
        }
    }

    renderPromptModal() {
        if (this.state.randomPromptIndex > 0 && this.state.catalogData['PROMPT']) {
            return (
                <View padder>
                    <Text style={{ color: 'white' }}>{this.state.catalogData['PROMPT'][this.state.randomPromptIndex].question}</Text>
                    <List>
                        {
                            this.state.catalogData['PROMPT'][this.state.randomPromptIndex].answers.map((answer, index) => {
                                return (
                                    <ListItem key={index}>
                                        <CheckBox
                                            checked={this.state.selectedPromptAnswerIndex === index}
                                            onPress={() => this.setState({ selectedPromptAnswerIndex: index })}
                                        />
                                        <Body>
                                            <Text style={{ color: 'white' }}>{answer}</Text>
                                        </Body>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </View>
            );
        }
    }

    cancelAdd() {
        console.log(`[DayInfo] cancel add new`);
        this.resetState();
    }

    toggleHearts(heartIndex) {
        let tempHearts = [false, false, false, false, false];

        for (let i = 0; i < this.state.selectedHearts.length; i++) {
            tempHearts[i] = true;
            if (i === heartIndex) {
                break;
            }
        }

        this.setState({ selectedHearts: tempHearts });
        this.setState({ selectedEmotionScore: heartIndex + 1 });
    }

    handleAddRandomPrompt() {
        this.setState({
            showAddModal: true,
            addType: 'PROMPT',
            randomPromptIndex: Math.floor(Math.random() * this.state.catalogData['PROMPT'].length)
        });
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

    async persistNew() {
        console.log(`[DayInfo] persist new ${this.state.addType}`);
        const currentDay = this.state.daysData[this.state.activeSlide];

        const sessionToken = await AsyncStorage.getItem('sessionToken');
        const endpoint = `${host}/days/${currentDay.dayId}/${this.state.addType}`;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Session-Token': sessionToken
        };

        let body = {};
        if (this.state.addType === 'EMOTION') {
            body['emotionScore'] = this.state.selectedEmotionScore;
            body['description'] = ''; // TODO - get description input later
        } else if (this.state.addType === 'ACTIVITY') {
            const newDayEvent = this.state.catalogData[this.state.addType][this.state.selectedActivityIndex];
            body = newDayEvent;
        } else if (this.state.addType === 'PROMPT') {
            body['question'] = this.state.catalogData['PROMPT'][this.state.randomPromptIndex].question;
            body['selectedAnswer'] = this.state.catalogData['PROMPT'][this.state.randomPromptIndex].answers[this.state.selectedPromptAnswerIndex];
        }
        body['startTime'] = moment().format('hh:mm A');
        body['endTime'] = '';

        console.log(`[DayInfo] calling ${endpoint}, with ${JSON.stringify(body)}`);

        let requestSuccess = false;

        fetch(endpoint, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
        }).then((response) => {
            if (response.ok) {
                requestSuccess = true;
                console.log(`[DayInfo] successfully updated day`);
            } else {
                requestSuccess = false;
                console.log(`[DayInfo] error updating day`);
            }
            return response.json();
        }).then((json) => {
            console.log(`[DayInfo] json: ${JSON.stringify(json)}`);
            if (requestSuccess) {
                console.log(`[DayInfo] updating this.state.daysData[activeIndex], where activeIndex=${this.state.activeSlide}`);
                let tempDays = this.state.daysData;
                tempDays[this.state.activeSlide] = json;
                this.setState({ daysData: tempDays });
            } else {
                console.log(`[DayInfo] error posting new event with error message: ${json.message}`);
                this.errorMessage = json.message;
            }

            this.resetState();
        });
    }

    resetState() {
        this.setState({
            showAddModal: false,
            addType: '',
            selectedActivityIndex: -1,
            selectedEmotionScore: 0,
            selectedHearts: [false, false, false, false, false],
            randomPromptIndex: -1,
            selectedPromptAnswerIndex: -1
        });
    }

}