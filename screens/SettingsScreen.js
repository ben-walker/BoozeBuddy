import React from 'react';
import colour from '../constants/Colors';
import {AsyncStorage, Image, ScrollView, StyleSheet, View} from "react-native";
import {Button} from "react-native-elements";

export default class SettingsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this)
    }

  static navigationOptions = {
    title: 'Settings',
      headerTintColor: colour.defaultText,
      headerStyle: {
          backgroundColor: colour.dark
      },
  };

    async logOut() {
        await fetch('https://dr-robotnik.herokuapp.com/api/logOut', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        await AsyncStorage.removeItem('userToken');
        this.props.navigation.navigate('Auth');
    }

  render() {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} >

                <Button
                    onPress={this.logOut}
                    style={styles.button}
                    rounded
                    title='Log Out'
                    backgroundColor={colour.errorBackground}
                />
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

});
