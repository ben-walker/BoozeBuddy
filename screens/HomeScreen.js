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


import colour from '../constants/Colors';
import {Button} from "react-native-elements";
import SettingsScreen from "./SettingsScreen";

class HomeScreen extends React.Component {
  static navigationOptions = {
      header:null
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.contentContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/DrinkIcons/cheers.png')
                  : require('../assets/images/DrinkIcons/cheers.png')
              }
              style={styles.imageIcon}
            />
          </View>

            <Button
                onPress={() => this.props.navigation.navigate('Calc')}
                style={styles.button}
                rounded
                title='Start Drinking?'
                backgroundColor={colour.accent}
            />
            <Text > </Text>

            <Text style={styles.defaultText}>Info about drinking here</Text>


        </ScrollView>
      </View>
    );
  }
}

class CalculatorScreen extends React.Component {
    static navigationOptions = {
        header:null
    };
    render() {
        var date = new Date();
        var timestamp = date.getHours() + ":" + date.getMinutes();
        var bac;

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.defaultText}>Calculator Screen</Text>

                <View style={styles.bacHeader}>
                    <Text style={styles.bigText}>BAC:</Text>

                </View>

                <View style={styles.timeHeader}>
                    <Text style={styles.smallText}>Drink display : X X X X X X X X X  </Text>
                </View>

                <View style={styles.timeHeader}>
                    <Text style={styles.defaultText}>Started Drinking : </Text>
                </View>

                <View style={styles.favBar}>
                    <Text style={styles.smallText}>Favourites</Text>
                </View>

                <ScrollView style={styles.listContainer}>
                    <Text style={styles.smallText}>Drink List</Text>
                </ScrollView>
            </ScrollView>

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
    static navigationOptions = {
        header:null
    };
    render() {
        return <RootStack />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colour.background,
        paddingTop: 22
    },
    contentContainer: {
        marginTop: 10,
        marginBottom:20,
        alignItems: 'center',
        backgroundColor:colour.secondary
    },

    imageIcon:{
        width:100,
        height:80,
        marginTop:3,
        marginLeft: -10,
        resizeMode: "contain"
    },
    defaultText: {
        fontSize: 17,
        color: colour.defaultText,
        lineHeight: 24,
        textAlign: 'center'
    },

    bigText:{
        fontSize: 48,
        color: colour.defaultText,
        textAlign: 'center'
    },
    smallText:{
        fontSize: 10,
        color: colour.defaultText
    },

    bacHeader:{
        height:60,
        backgroundColor: colour.secondary,
        alignItems: 'flex-end'
    },
    timeHeader:{
        height:30,
        backgroundColor: colour.background,
    },
    favBar:{
        height:100,
        backgroundColor: colour.secondary,
    },
    listContainer:{
        backgroundColor: colour.background,
    },
    drinkIconContainer:{
        height:80,
        backgroundColor: colour.secondary,
    }
});
