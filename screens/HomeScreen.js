import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { createStackNavigator } from 'react-navigation';

import { MonoText } from '../components/StyledText';

import colour from '../constants/Colors';
import {Button} from "react-native-elements";


class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/DrinkIcons/cheers.png')
                  : require('../assets/images/DrinkIcons/cheers.png')
              }
              style={styles.welcomeImage}
            />
          </View>

            <Button
                onPress={() => this.props.navigation.navigate('Calc')}
                style={styles.button}
                rounded
                title='Start Drinking?'
                backgroundColor={colour.actionButton}
            />
            <Text > </Text>

            <Text style={styles.getStartedText}>Info about drinking here</Text>


        </ScrollView>
      </View>
    );
  }
}

class CalculatorScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Calculator Screen</Text>
            </View>
        );
    }
}

const RootStack = createStackNavigator
(
    {
        Home: HomeScreen,
        Calc: CalculatorScreen,
    },
    {
        initialRouteName: 'Home',
    }
);
export default class App extends React.Component {
    render() {
        return <RootStack />;
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colour.background,
  },
  developmentModeText: {
    marginBottom: 20,
    color: colour.defaultText,
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
    color: colour.defaultText,
  },
  codeHighlightContainer: {
    backgroundColor: colour.secondary,
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: colour.defaultText,
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
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: colour.secondary,
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: colour.defaultText,
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
    color: colour.accent,
  }

});
