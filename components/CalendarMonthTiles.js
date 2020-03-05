import React, { Component } from 'react';
import { View, Text } from 'native-base';
import { HOST, COLORS } from '../util/Constants';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';

export default class CalendarMonthTiles extends Component {

    constructor(props) {
        super(props);
        // title
        // data: [{ value: , label: , }]

        this.state = {
            calendarCols: [0, 1, 2, 3, 4, 5, 6],
            calendarRows: [...Array(Math.ceil(this.props.data.length / 7)).keys()],
        
            selectedRowIndex: -1,
            selectedColIndex: -1,
            selectedDatum: null,
            showMoreInformation: false,
        }
    }

    render() {
        return (
            <View padder style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_LIGHT, borderRadius: 10 }}>

                <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 10}}>
                    <Text style={{
                        color: COLORS.TEXT_ACCENT, 
                        fontSize: 18
                    }}>
                        {this.props.title}
                    </Text>
                </View>

                <View padder>
                    {this.renderMoreInformation()}
                    {this.renderTiles()}
                </View>

                

                
            </View>
        );
    }

    renderMoreInformation() {
        if (this.state.showMoreInformation) {
            return (
                <View padder style={{
                    backgroundColor: COLORS.BACKGROUND_MAIN, 
                    borderRadius: 10, 
                    marginBottom: 10
                }}>
                    <Text>More info! row: {this.state.selectedRowIndex}, col: {this.state.selectedColIndex}</Text>
                </View>
            );
        }
    }

    renderTiles() {
        return (
            this.state.calendarRows.map((item, rowIndex) => {
                return (
                    <View key={rowIndex} style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        paddingTop: 5,
                        paddingBottom: 5
                    }}>
                        {
                            this.state.calendarCols.map((item, colIndex) => {
                                return (
                                    <TouchableOpacity key={colIndex}
                                        onPress={() => this.handleClickTile(rowIndex, colIndex)}
                                        style={{
                                            height: 40, 
                                            borderColor: 
                                                rowIndex === this.state.selectedRowIndex 
                                                && colIndex === this.state.selectedColIndex 
                                                && this.state.showMoreInformation ? COLORS.TEXT_MAIN : 'white', 
                                            borderWidth: 1, 
                                            borderRadius: 10,
                                            aspectRatio: 1,
                                            justifyContent: 'center',
                                    }}>
                                        {this.renderTileData(rowIndex, colIndex)}
                                    </TouchableOpacity>
                                );
                            })
                        }
                    </View>
                )
            })
        );
    }

    renderTileData(rowIndex, colIndex) {
        const index = (rowIndex * this.state.calendarCols.length) + colIndex;
        const datum = this.props.data[index];

        return (
            <Text style={{alignSelf: 'center', color: 'white'}}>
                {datum}
            </Text>
        );
    }

    handleClickTile(rowIndex, colIndex) {
        if (rowIndex === this.state.selectedRowIndex && colIndex === this.state.selectedColIndex && this.state.showMoreInformation) {
            this.setState({
                showMoreInformation: false,
                selectedRowIndex: -1,
                selectedColIndex: -1,
            });
        } else {
            this.setState({
                showMoreInformation: true,
                selectedRowIndex: rowIndex,
                selectedColIndex: colIndex,
            });
        }
    }
}