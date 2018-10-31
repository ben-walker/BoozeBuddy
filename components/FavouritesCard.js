import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
} from 'react-native';
import {
    Card,
    Button,
    Icon,
} from 'react-native-elements';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';

class FavouritesCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drinkData: props.drinkData,
		};
	}

	render() {
		const {
			title,
			description,
			onPressFunction,
			image,
			style,
		} = this.props;
		return (
			<Card
				containerStyle={{width:80, height:80} }
                featuredTitleStyle={{fontSize:10}}
				featuredTitle={description}
				image={{uri: image}}
			>
			</Card>
		);
	}
}

FavouritesCard.propTypes = {
  	title: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	onPressFunction: PropTypes.func.isRequired,
	drinkData: PropTypes.object,
	style: PropTypes.object,
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

export default FavouritesCard;
