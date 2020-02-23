import React, { Component } from 'react';
import { Text, View, Form, Label, Input, Button, Item } from 'native-base';
import { COLORS, HOST, EMOJI_REGEX_PATTERN } from '../util/Constants';
import { Alert, AsyncStorage } from 'react-native';

export default class CatalogFormScreen extends Component {

    // TODO - get header to say "Edit Catalog" and "Add to Catalog"

    constructor(props) {
        super(props);

        const data = this.props.navigation.state.params.data;

        this.state = {
            formType: this.props.navigation.state.params.formType,
            data: data,
            newName: data && data.name ? data.name : '',
            newDescription: data && data.description ? data.description : '',
            newIcon: data && data.icon ? data.icon : '',
            newColor: '',
            newQuestion: data && data.question ? data.question : '',
            newAnswers: data && data.answers ? data.answers : [''],
            isDisabled: true,
            doDelete: false,
        }
        console.log(this.state.data);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN }}>
                <View padder>
                    {this.state.formType === 'ACTIVITY'
                        ? this.renderActivityForm()
                        : this.renderPromptForm()}
                </View>

                <View padder style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Button 
                        disabled={ this.state.data ? false : this.state.isDisabled }
                        style={ (this.state.data ? false : this.state.isDisabled)
                            ? { backgroundColor: '#52e3c2', justifyContent: 'center', opacity: 0.5 } 
                            : { backgroundColor: '#52e3c2', justifyContent: 'center' } } 
                        onPress={ () => this.persistNew() }
                    >
                        <Text>Save</Text>
                    </Button>
                </View>

                {
                    this.state.data ? 
                    <View padder style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Button 
                        style={{ backgroundColor: 'red', justifyContent: 'center' }} 
                        onPress={() => Alert.alert(
                            'Are you sure?', 
                            `This ${this.state.formType} will be deleted from the Catalog and you will not be able to select it for your future Days. It will still remain on your previous Days and Stats.`,
                            [
                                {text: 'Cancel'},
                                {text: 'OK', onPress: () => this.handleDeleteConfirmation()}
                            ])
                        }
                    >
                        <Text>Delete</Text>
                    </Button>
                </View> : null
                }

                
            </View>
        );
    }

    handleDeleteConfirmation() {
        this.setState({doDelete: true});
        this.persistNew();
    }

    renderActivityForm() {
        return (
            <View>
                <Item floatingLabel style={{ marginBottom: 10 }}>
                    <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Activity Name</Label>
                    {
                        this.state.data && this.state.data.name ? 
                        <Input
                            style={{ color: 'white', opacity: 0.8 }}
                            value={this.state.data.name}
                            disabled
                        /> :
                        <Input
                            style={{ color: 'white' }}
                            onChangeText={value => this.setState({
                                newName: value, 
                                isDisabled: value.length === 0 || this.state.newIcon.length === 0
                            })}
                        /> 
                    }
                </Item>
                <Item floatingLabel style={{ marginBottom: 10 }}>
                    <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Icon (emoji)</Label>
                    <Input
                        onChangeText={value => this.cleanEmojiInput(value)}
                        value={this.state.newIcon}
                    />
                </Item>
                <Item floatingLabel style={{ marginBottom: 10 }}>
                    <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Description (optional)</Label>
                    <Input
                        style={{ color: 'white' }}
                        value={this.state.newDescription}
                        onChangeText={value => this.setState({ newDescription: value })}
                    /> 
                </Item>
            </View>
        );
    }

    // TODO - handle EDIT mode of PROMPT
    renderPromptForm() {
        return (
            <View padder>
                <Item floatingLabel style={{ marginBottom: 10 }}>
                    <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Question</Label>
                    <Input
                        style={{ color: 'white' }} 
                        onChangeText={value => this.setState({
                            newQuestion: value, 
                            isDisabled: value.length === 0 || this.state.newAnswers[0].length === 0
                        })} 
                    />
                </Item>
                {
                    this.state.newAnswers.map((answer, index) => {
                        return (
                            <Item floatingLabel key={index} style={{ marginBottom: 10 }}>
                                <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Answer Option #{index + 1}</Label>
                                <Input 
                                    style={{ color: 'white' }} 
                                    onChangeText={value => this.updateAnswers(index, value)} 
                                />
                            </Item>
                        );
                    })
                }
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Button small rounded 
                        onPress={() => this.setState({ newAnswers: this.state.newAnswers.concat('') })} 
                        style={{ borderColor: '#52e3c2', borderWidth: 1, backgroundColor: COLORS.BACKGROUND_MAIN }}
                    >
                        <Text style={{ color: 'white' }}>Add Answer Option</Text>
                    </Button>
                </View>
            </View>
        );
    }

    updateAnswers(index, value) {
        const tempAnswers = this.state.newAnswers;
        tempAnswers[index] = value;
        this.setState({ newAnswers: tempAnswers, isDisabled: this.state.newQuestion.length === 0 || tempAnswers[0].length === 0 });
    }

    cleanEmojiInput(value) {
        console.log('value: ' + value);

        let matches = value.match(EMOJI_REGEX_PATTERN);
        let cleanedInput = matches ? matches[0] : ''

        console.log('cleanedInput: ' + cleanedInput);

        this.setState({
            newIcon: cleanedInput, 
            isDisabled: cleanedInput.length === 0 || this.state.newName.length === 0
        })
    }

    async persistNew() {
        console.log(`[CatalogFormScreen] ${this.state.doDelete ? 'DELETE' : this.state.data ? 'PUT' : 'POST'}`);

        const sessionToken = await AsyncStorage.getItem('sessionToken');

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Session-Token': sessionToken
        };

        const endpoint = (this.state.data || this.doDelete)
            ? `${HOST}/catalog/events/${this.state.formType}/catalogEventId/${this.state.data.catalogEventId}` 
            : `${HOST}/catalog/events/${this.state.formType}`
        
        let body = {};

        if (!this.state.doDelete) {
            if (this.state.data) {
                this.state.formType === 'ACTIVITY' 
                    ? (this.state.data.description = this.state.newDescription, this.state.data.icon = this.state.newIcon)
                    : this.state.data.answers = this.state.newAnswers;
                body = this.state.data;
            } else {
                body = {
                    dayEventCatalogId: '',
                    belongsTo: '',
                    type: this.state.formType,
                    name: this.state.newName,
                    color: this.state.newColor, // TODO - this is not getting set from input
                    icon: this.state.newIcon, // TODO - this is not getting set from input
                    description: this.state.newDescription,
                    question: this.state.newQuestion,
                    answers: this.state.newAnswers,
                    allowMultiSelect: this.state.newAllowMultiSelect // TODO - this is not getting set from input
                };
            }
        }
        
        console.log(`[CatalogFormScreen] calling ${endpoint}, with ${JSON.stringify(body)}`);

        let requestSuccess = false;

        fetch(endpoint, {
            method: this.state.doDelete ? 'DELETE' : this.state.data ? 'PUT' : 'POST',
            headers: headers,
            body: JSON.stringify(body)
        }).then((response) => {
            if (response.ok) {
                requestSuccess = true;
                console.log(`[CatalogFormScreen] successfully created/updated`);
                AsyncStorage.setItem('doCatalogUpdate_DayScreen', 'doCatalogUpdate_DayScreen');
                AsyncStorage.setItem('doCatalogUpdate_CatalogScreen', 'doCatalogUpdate_CatalogScreen');
            } else {
                requestSuccess = false;
                console.log(`[CatalogFormScreen] error creating/updating`);
            }
            return response.json();
        }).then((json) => {
            console.log(`[CatalogFormScreen] json: ${JSON.stringify(json)}`);
            if (requestSuccess) {
                console.log(`[CatalogFormScreen] successfully persisted catalog data, navigating back`);
                this.props.navigation.goBack();
            } else {
                console.log(`[CatalogFormScreen] error creating/updating with error message: ${json.message}`);
                this.errorMessage = json.message;
                Alert.alert('Error', this.errorMessage);
            }

            this.resetState();
        });
    }

    resetState() {
        this.setState({
            newType: '',
            newName: '',
            newDescription: '',
            newColor: '',
            newIcon: '',
            newQuestion: '',
            newAnswers: [''],
            isDisabled: true,
            doDelete: false,
        });
    }
}