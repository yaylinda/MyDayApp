import React, { Component } from 'react';
import { View, Text } from 'native-base';
import { HOST, COLORS } from '../util/Constants';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';

export default class CalendarMonthTiles extends Component {

    constructor(props) {
        super(props);

        let colors = this.generateColor('#FFFFFF', '#52e3c2', 10);

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

        console.log(this.state.maxValue);
    }

    render() {

        // this.setState({maxValue: Math.max(...this.state.data.map(d => d.value))})
        
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
                        <Text style={{color: COLORS.TEXT_ACCENT, fontWeight: '500'}}>{this.formatDate(datum.date)}</Text>
                        <Text style={{color: 'white'}}>{datum.label}: {datum.value}</Text>
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
                        {datum.value}
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

    formatDate(date) {
        return moment(date, "YYYY-MM-DD").format('ddd, MMM Do YYYY');
    }

    hex (c) {
        let s = "0123456789abcdef";
        let i = parseInt (c);
        if (i == 0 || isNaN (c))
          return "00";
        i = Math.round (Math.min (Math.max (0, i), 255));
        return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
      }
      
    convertToHex (rgb) {
        return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
    }
      
    trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }
      
    convertToRGB (hex) {
        let color = [];
        color[0] = parseInt ((this.trim(hex)).substring (0, 2), 16);
        color[1] = parseInt ((this.trim(hex)).substring (2, 4), 16);
        color[2] = parseInt ((this.trim(hex)).substring (4, 6), 16);
        return color;
      }
      
    generateColor(colorStart,colorEnd,colorCount) {
        let start = this.convertToRGB (colorStart);    
        let end   = this.convertToRGB (colorEnd);    
        let len = colorCount;
        let alpha = 0.0;
        let saida = [];
        for (let i = 0; i < len; i++) {
        let c = [];
            alpha += (1.0/len);
            c[0] = start[0] * alpha + (1 - alpha) * end[0];
            c[1] = start[1] * alpha + (1 - alpha) * end[1];
            c[2] = start[2] * alpha + (1 - alpha) * end[2];
            saida.push(this.convertToHex (c));
        }
        return saida;
    }
}