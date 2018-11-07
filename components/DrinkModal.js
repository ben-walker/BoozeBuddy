import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {
  Tile,
  Button,
  Icon,
} from 'react-native-elements';
import Modal from 'react-native-modal';
import DropDownAlert from 'react-native-dropdownalert';
import style from '../constants/StyleSheet';
import colors from '../constants/Colors';

class DrinkModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      internalDrink: props.drinkData,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.drinkData !== this.props.drinkData) this.setState({ internalDrink: this.props.drinkData });
  }

    _addToFavourites = async () => {
      const drink = this.state.internalDrink;
      const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/addFavourite', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lcboId: drink.lcbo_id }),
      });

      if (!rawResponse.ok) return this.dropDown.alertWithType('error', 'Error', 'Sorry, we couldn\'t add that drink to your Favourites :(');
      this.dropDown.alertWithType('success', 'Added to Favourites', `Nice! We just added ${drink.name} to your Favourites!`);
    }

    toggleModal = () => this.setState({ isVisible: !this.state.isVisible });

    render() {
      const addToFavouritesButton = (
        <Button
          title="Add to Favourites"
          rounded
          raised
          backgroundColor={colors.background}
          onPress={this._addToFavourites}
        />
      );

      const heartIcon = (
        <Icon
          name="favorite"
          size={35}
          color="red"
        />
      );

      return (
        <Modal
          isVisible={this.state.isVisible}
          onSwipe={this.toggleModal}
          swipeDirection="down"
          style={style.drinkModal}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}
          >
            <Tile
              imageSrc={this.state.internalDrink
                ? this.state.internalDrink.image_url
                  ? { uri: this.state.internalDrink.image_url }
                  : require('../assets/images/DrinkIcons/cocktail.png')
                : { uri: '' }}
              height={600}
              width={400}
            />

            {this.state.internalDrink
              ? this.state.internalDrink.favourite ? heartIcon : addToFavouritesButton
              : null}

            <Icon
              name="arrow-downward"
              raised
              reverse
              size={24}
              onPress={this.toggleModal}
              color="grey"
            />

            <DropDownAlert
              ref={ref => this.dropDown = ref}
            />
          </View>
        </Modal>
      );
    }
}

DrinkModal.propTypes = {
  drinkData: PropTypes.object,
};

export default DrinkModal;
