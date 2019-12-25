import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Button,
  Input,
  ListItem,
  Overlay
} from 'react-native-elements';

export default function HomeScreen() {

  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [activitiesList, setActivitiesList] = useState([]);

  return (
    <View style={styles.container}>

      <Button title="Add Activity" onPress={() => handlePressedAddActivity(setShowAddActivityModal)} />

      {
        activitiesList.map((a, i) => (
          <ListItem
            key={i}
            title={a}
            bottomDivider
          />
        ))
      }

      <Overlay isVisible={showAddActivityModal}>

        <View>
          <Text>New Activity</Text>

          <Input placeholder="Enter Activity" onChangeText={newActivity => setNewActivity(newActivity)} value={newActivity} />

          <Button title="Cancel" onPress={() => handleCancelAddActivity(setShowAddActivityModal, setNewActivity)} />

          <Button title="Add" onPress={() => handleSaveActivity(setShowAddActivityModal, setNewActivity, newActivity, activitiesList)} />
        </View>

      </Overlay>
    </View>
  );
}

HomeScreen.navigationOptions = {
  title: 'My Day',
};

function handlePressedAddActivity(setShowAddActivityModal) {
  setShowAddActivityModal(true);
}

function handleCancelAddActivity(setShowAddActivityModal, setNewActivity) {
  setShowAddActivityModal(false);
  setNewActivity('');
}

function handleSaveActivity(setShowAddActivityModal, setNewActivity, newActivity, activitiesList) {
  setShowAddActivityModal(false);
  setNewActivity('');
  activitiesList.push(newActivity);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
