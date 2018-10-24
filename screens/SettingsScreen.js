import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import colour from '../constants/Colors';
import {StyleSheet} from "react-native";

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <ExpoConfigView />;
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
