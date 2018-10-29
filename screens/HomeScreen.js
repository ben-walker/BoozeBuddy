import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Alert,
} from 'react-native';


import colour from '../constants/Colors';
import DrinkCard from '../components/DrinkCard.js';
import {Button} from "react-native-elements";

export default class HomeScreen extends React.Component {
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
                onPress={() => this.props.navigation.navigate('Calculator')}
                style={styles.button}
                rounded
                title='Start Drinking?'
                backgroundColor={colour.accent}
            />

            <DrinkCard title="Orange" description="Vodka?" image="https://picsum.photos/100/?random" onPressFunction={() => Alert.alert("Looks like we ran out of alcohol. Try again later.")}></DrinkCard>

            <Text style={styles.defaultText}>Info about drinking here</Text>
        </ScrollView>
      </View>
    );
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
    button: {
        padding: 5
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
