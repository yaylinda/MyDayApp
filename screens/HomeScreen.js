import React, { Component } from 'react';
import {
  Button,
  Container,
  Text,
  Header,
  Content,
  Footer,
  FooterTab,
  Icon,
} from 'native-base';
import DayScreen from './DayScreen';
import CatalogScreen from './CatalogScreen';
import StatisticsScreen from './StatisticsScreen';
import SettingsScreen from './SettingsScreen';

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddActivityModal: false,
      newActivity: '',
      activitiesList: [],
      activeTab: 'day'
    };
    console.log(`[HomeScreen] username=${this.props.navigation.getParam('username', 'USERNAME NOT FOUND')}`);
    console.log(`[HomeScreen] state: ${JSON.stringify(this.state)}`);
  }

  render() {
    return (
      <Container style={{ flex: 1, backgroundColor: '#282833' }}>
        
        <Content padder>
          { this.renderContent() }
        </Content>

        <Footer style={{ backgroundColor: '#282833' }}>
          <FooterTab>
            <Button vertical active={this.state.activeTab === 'day'} onPress={() => this.handleChangeTab('day')}>
              <Icon  name="sunny" />
              <Text>Day</Text>
            </Button>
            <Button vertical active={this.state.activeTab === 'stats'} onPress={() => this.handleChangeTab('stats')}>
              <Icon name="stats" />
              <Text>Stats</Text>
            </Button>
            <Button vertical active={this.state.activeTab === 'catalog'} onPress={() => this.handleChangeTab('catalog')}>
              <Icon name="list" />
              <Text>Catalog</Text>
            </Button>
            <Button vertical active={this.state.activeTab === 'settings'} onPress={() => this.handleChangeTab('settings')}>
              <Icon name="settings" />
              <Text>Settings</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

  renderContent() {
    if (this.state.activeTab === 'day') {
      return (<DayScreen></DayScreen>);
    } else if (this.state.activeTab === 'catalog') {
      return (<CatalogScreen></CatalogScreen>);
    } else if (this.state.activeTab === 'stats') {
      return (<StatisticsScreen></StatisticsScreen>);
    } else if (this.state.activeTab === 'settings') {
      return (<SettingsScreen></SettingsScreen>);
    }
  }

  handleChangeTab(tabName) {
    console.log(`[HomeScreen] handleChangeTab: ${tabName}`);
    this.setState({ activeTab: tabName });
  }
}
