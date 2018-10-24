import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';

class DrinkButton extends Component {
	render() {
		const { title, onPress, image} = this.props;
		return (
		  <TouchableOpacity style={styles.buttonStyle} onPress={() => onPress()}>
      <Image source={require("../assets/images/DrinkIcons/cocktail.png")}/>
        <View style={styles.textViewStyle}>
          <Text style={{fontSize: 40, color: 'orange'}}>{title}</Text>
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
    alignItems: 'center'
  },

  buttonStyle: {
  	padding:10,
  	backgroundColor: '#202646',
  	borderRadius:5
  }
});

export default DrinkButton;
