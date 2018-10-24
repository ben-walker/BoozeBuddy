import React from 'react';

import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import colour from "../constants/Colors";

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
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
