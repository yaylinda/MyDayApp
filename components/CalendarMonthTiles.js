import React, { Component } from 'react';
import { View, Text } from 'native-base';
import { COLORS, formatDecimal, formatDate } from '../util/Constants';
import { TouchableOpacity } from 'react-native';
import ColorInterpolator from '../util/ColorInterpolator';

const NUM_COLORS = 10;

export default class CalendarMonthTiles extends Component {

    constructor(props) {
        super(props);

        let colors = ColorInterpolator.generateColor('#FFFFFF', '#52e3c2', NUM_COLORS);

        this.state = {
            title: props.title,
            data: props.data,

            calendarCols: [0, 1, 2, 3, 4, 5, 6],
            calendarRows: [...Array(Math.ceil(this.props.data.length / 7)).keys()],

            selectedRowIndex: -1,
            selectedColIndex: -1,
            selectedDatum: null,
            showMoreInformation: false,

            maxValue: Math.max(...props.data.map(d => d.value)),
            colorsArray: colors.reverse(),
        }
    }

    render() {
        return (
            <View padder style={{ flex: 1 }}>
                <View padder>
                    {this.renderMoreInformation()}
                    {this.renderTiles()}
                </View>
            </View>
        );
    }

    renderMoreInformation() {
        if (this.state.showMoreInformation) {

            const datum = this.getDatumAtIndex(this.state.selectedRowIndex, this.state.selectedColIndex);

            if (datum) {
                return (
                    <View padder style={{
                        flexDirection: 'column',
                        backgroundColor: COLORS.BACKGROUND_MAIN,
                        borderRadius: 10,
                        marginBottom: 10,
                    }}>
                        <Text style={{ color: COLORS.TEXT_ACCENT, fontWeight: '500' }}>
                            {formatDate(datum.date)}
                        </Text>
                        <Text style={{ color: 'white' }}>
                            {datum.label}: {formatDecimal(datum.value)}
                        </Text>
                    </View>
                );
            }
        }
    }

    renderTiles() {
        let maxValue = Math.max(...this.props.data.map(d => d.value));

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
                                            borderRadius: 10,
                                            aspectRatio: 1,
                                            justifyContent: 'center',
                                        }}>
                                        {this.renderTileData(rowIndex, colIndex, maxValue)}
                                    </TouchableOpacity>
                                );
                            })
                        }
                    </View>
                )
            })
        );
    }

    renderTileData(rowIndex, colIndex, maxValue) {
        const datum = this.getDatumAtIndex(rowIndex, colIndex);
        if (datum) {

            const color = datum.value === 0
                ? 'white'
                : '#' + this.state.colorsArray[Math.ceil((datum.value / maxValue) * 10) - 1];

            return (
                <View style={{ flex: 1, borderRadius: 10, justifyContent: 'center', backgroundColor: color }}>
                    <Text style={{ alignSelf: 'center', color: 'black' }}>
                        {formatDecimal(datum.value)}
                    </Text>
                </View>
            );
        }
    }

    getDatumAtIndex(rowIndex, colIndex) {
        const index = (rowIndex * this.state.calendarCols.length) + colIndex;
        return this.props.data[index];
    }

    handleClickTile(rowIndex, colIndex) {
        const datum = this.getDatumAtIndex(rowIndex, colIndex);

        if (!datum) {
            return;
        }

        if (rowIndex === this.state.selectedRowIndex
            && colIndex === this.state.selectedColIndex
            && this.state.showMoreInformation
            || !datum) {
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