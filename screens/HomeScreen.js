import React, { Component } from 'react';
import {
  Button,
  Container,
  Form, 
  Item, 
  Picker,
  Text,
  Header
} from 'native-base';
import DayInfo from '../components/DayInfo';

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddActivityModal: false,
      newActivity: '',
      activitiesList: []
    };
  }

  render() {
    console.log(`[HomeScreen] username=${this.props.navigation.getParam('username', 'USERNAME NOT FOUND')}`);
    return (
      <Container style={{flex: 1, backgroundColor: '#282833', padding: 20}}>

        <DayInfo date={new Date()}></DayInfo>
        
        <Button style={{backgroundColor: '#52e3c2'}} onPress={this.handlePressedAddActivity.bind(this)}>
          <Text>Add Activity</Text>
        </Button>
  
        {/* {
          this.state.activitiesList.map((a, i) => (
            <ListItem
              key={i}
              title={a}
              bottomDivider
            />
          ))
        }
  
        <Overlay isVisible={this.state.showAddActivityModal}>
  
          <View>
            <Text>New Activity</Text>
  
            <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Select your Activity"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.newActivity}
                onValueChange={this.updateNewActivity.bind(this)}
              >
                <Picker.Item label="Wallet" value="key0" />
                <Picker.Item label="ATM Card" value="key1" />
                <Picker.Item label="Debit Card" value="key2" />
                <Picker.Item label="Credit Card" value="key3" />
                <Picker.Item label="Net Banking" value="key4" />
              </Picker>
            </Item>
          </Form>

            <Button title="Cancel" onPress={() => this.handleCancelAddActivity()} />
  
            <Button title="Add" onPress={() => this.handleSaveActivity()} />
          </View>
  
        </Overlay> */}

      </Container>
    );
  }

  handlePressedAddActivity() {
    console.log('handlePressedAddActivity');
    this.setState({showAddActivityModal: true});
  }

  updateNewActivity(newActivity) {
    this.setState({newActivity: newActivity});
  }
  
  handleCancelAddActivity() {
    this.setState({showAddActivityModal: false, newActivity: ''});
  }
  
  handleSaveActivity(newActivity) {
    console.log('handleSaveActivity:', newActivity);
    this.setState({showAddActivityModal: false, newActivity: '', activitiesList: this.state.activitiesList.concat(newActivity)});
    console.log(this.state.activitiesList);
  }
}
