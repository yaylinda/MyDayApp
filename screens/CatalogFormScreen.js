import React, { Component } from 'react';
import { Text, View, Form, Label, Input, Button, Item } from 'native-base';
import { COLORS } from '../util/Constants';

export default class CatalogFormScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formType: this.props.navigation.state.params.formType,
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_MAIN }}>
                <View padder>
                    {this.state.formType === 'ACTIVITY'
                        ? this.renderActivityForm()
                        : this.renderPromptForm()}
                </View>

                <View padder style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button onPress={() => this.persistNew()} style={{ backgroundColor: '#52e3c2' }}>
                        <Text>Save</Text>
                    </Button>
                </View>
            </View>
        );
    }

    renderActivityForm() {

        return (
            <Form style={{ marginBottom: 20 }}>
                <Item floatingLabel>
                    <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Name</Label>
                    <Input style={{ color: 'white' }} onChangeText={value => this.setState({ newName: value })} />
                </Item>
                <Item floatingLabel>
                    <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Description</Label>
                    <Input style={{ color: 'white' }} onChangeText={value => this.setState({ newDescription: value })} />
                </Item>
                <Item floatingLabel>
                    <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Icon</Label>
                    <Input style={{ color: 'white' }} onChangeText={value => this.setState({ newIcon: value })} />
                </Item>
                <Item floatingLabel>
                    <Label style={{ color: COLORS.TEXT_LIGHT_WHITE }}>Color</Label>
                    <Input style={{ color: 'white' }} onChangeText={value => this.setState({ newColor: value })} />
                </Item>
            </Form>
        );
    }
    renderPromptForm() {
        return (
            <View>
                <Form style={{ marginBottom: 20 }}>
                    <Item padder floatingLabel>
                        <Label style={{ color: 'white' }}>Question</Label>
                        <Input style={{ color: 'white' }} onChangeText={value => this.setState({ newQuestion: value })} />
                    </Item>
                    {
                        this.state.newAnswers.map((answer, index) => {
                            return (
                                <Item floatingLabel key={index}>
                                    <Label style={{ color: 'white' }}>Answer Option #{index + 1}</Label>
                                    <Input style={{ color: 'white' }} onChangeText={value => this.updateAnswers(index, value)} />
                                </Item>
                            );
                        })
                    }

                </Form>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Button small rounded onPress={() => this.setState({ newAnswers: this.state.newAnswers.concat('') })} style={{ backgroundColor: '#52e3c2' }}>
                        <Text style={{ color: 'white' }}>Add Answer Option</Text>
                    </Button>
                </View>
            </View>
        );
    }

updateAnswers(index, value) {
    const tempAnswers = this.state.newAnswers;
    tempAnswers[index] = value;
    this.setState({ newAnswers: tempAnswers });
}

async persistNew() {
    console.log(`[CatalogScreen] persist new`);
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const endpoint = `${HOST}/catalog/events/${this.state.newType}`;
    const body = {
        dayEventCatalogId: '',
        belongsTo: '',
        type: this.state.newType,
        name: this.state.newName,
        color: this.state.newColor,
        icon: this.state.newIcon,
        description: this.state.newDescription,
        question: this.state.newQuestion,
        answers: this.state.newAnswers,
        allowMultiSelect: this.state.newAllowMultiSelect
    };
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Session-Token': sessionToken
    };

    console.log(`[CatalogScreen] calling ${endpoint}, with ${JSON.stringify(body)}`);

    let requestSuccess = false;

    fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    }).then((response) => {
        if (response.ok) {
            requestSuccess = true;
            console.log(`[CatalogScreen] successfully posted new`);
            AsyncStorage.setItem('doCatalogUpdate', 'doCatalogUpdate');
        } else {
            requestSuccess = false;
            console.log(`[CatalogScreen] error posting new`);
        }
        return response.json();
    }).then((json) => {
        console.log(`[CatalogScreen] json: ${JSON.stringify(json)}`);
        if (requestSuccess) {
            console.log(`[CatalogScreen] updating this.state.catalogData`);
            let tempCatalogData = this.state.catalogData;
            tempCatalogData[this.state.newType] = json;
            this.setState({ catalogData: tempCatalogData });

            // TODO - make sure to navigate back to previous catalog page
        } else {
            console.log(`[CatalogScreen] error posting new event with error message: ${json.message}`);
            this.errorMessage = json.message;
        }

        this.resetState();
    });
}
}