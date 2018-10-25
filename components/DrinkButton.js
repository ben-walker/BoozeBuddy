import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import colour from '../constants/Colors';

class DrinkButton extends Component {
	render() {
		const { title, onPress, image} = this.props;
		return (
		    <TouchableOpacity style={styles.buttonStyle} onPress={() => onPress()}>
                <Image source={require("../assets/images/DrinkIcons/cocktail2.png")}/>
                <View style={styles.textViewStyle}>
                    <Text style={{fontSize: 16, color: colour.defaultText}}>{title}</Text>
                </View>
		    </TouchableOpacity>
		);
	}
}

DrinkButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  textViewStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
      backgroundColor: colour.dark,
      width: 80,
      height: 20
  },

  buttonStyle: {
  	padding:10,
  	backgroundColor: colour.dark,
  	borderRadius:5,
      width: 80,
      height: 80,
      alignItems: 'center'
  }
});

export default DrinkButton;
