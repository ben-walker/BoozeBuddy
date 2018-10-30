import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    StyleSheet,
} from 'react-native';
import {
    Card,
    Button,
    Icon,
} from 'react-native-elements';
import colors from '../constants/Colors';

class DrinkCard extends Component {
	render() {
		const { title, description, onPressFunction, image} = this.props;
		return (
			<Card containerStyle={{minWidth: '40%'}}
				image={{uri: image}}>
				<Text style={{marginBottom: 10}}>
					{description}
				</Text>
				<Button
					icon={<Icon name='code' color='#ffffff'/>}
					backgroundColor='#03A9F4'
					title={title}
					onPress = {onPressFunction}/>
			</Card>
		);
	}
}

DrinkCard.propTypes = {
  title: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
  onPressFunction: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    buttonStyle: {
        padding: 10,
        backgroundColor: colors.dark,
        borderRadius: 5,
        width: 80,
        height: 80,
        alignItems: 'center'
    }
});

export default DrinkCard;
