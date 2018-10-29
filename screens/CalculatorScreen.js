import React from 'react';
import {
    ScrollView,
    Text,
    View,
    StyleSheet, Alert,
} from 'react-native';
import colour from '../constants/Colors';
import DrinkCard from '../components/DrinkCard.js';

export default class CalculatorScreen extends React.Component {
  static navigationOptions = {
    header:null
  };

  render() {
    const date = new Date();
    const timestamp = date.getHours() + ":" + date.getMinutes();
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
            <DrinkCard title="Red"  onPress={() => Alert.alert("Looks like we ran out of alcohol. Try again later.")}>
            </DrinkCard>

        </View>

        <ScrollView style={styles.listContainer}>
          <Text style={styles.smallText}>Drink List</Text>
            <DrinkCard title="Blue" onPress={() => Alert.alert("Looks like we ran out of alcohol. Try again later.")}>
            </DrinkCard>

        </ScrollView>
      </ScrollView>
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
