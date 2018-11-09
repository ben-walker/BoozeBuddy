import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {
  Tile,
  Button,
  Icon,
} from 'react-native-elements';
import Modal from 'react-native-modal';
import DropdownAlert from 'react-native-dropdownalert';
import style from '../constants/StyleSheet';
import colors from '../constants/Colors';
import * as cocktailIcon from '../assets/images/DrinkIcons/cocktail.png';

class DrinkModal extends Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: false };
  }

  addToFavourites = async () => {
    const {
      drinkData,
      getFavourites,
    } = this.props;
    const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/addFavourite', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lcboId: drinkData.lcbo_id }),
    });

    if (!rawResponse.ok) return this.dropDown.alertWithType('error', 'Error', 'Sorry, we couldn\'t add that drink to your Favourites :(');
    getFavourites();
    return this.dropDown.alertWithType('success', 'Added to Favourites', `Nice! We just added ${drinkData.name} to your Favourites!`);
  }

  getImageSrc = () => {
    const { drinkData } = this.props;
    if (drinkData) {
      return drinkData.image_url
        ? ({ uri: drinkData.image_url })
        : cocktailIcon.default;
    }
    return ({ uri: '' });
  }

  toggleModal = () => this.setState(prevState => ({ isVisible: !prevState.isVisible }))

  render() {
    const { isVisible } = this.state;
    const { favourite } = this.props;

    const addToFavouritesButton = (
      <Button
        title="Add to Favourites"
        rounded
        raised
        backgroundColor={colors.background}
        onPress={this.addToFavourites}
      />
    );

    const heartIcon = (
      <Icon
        name="favorite"
        size={35}
        color="red"
      />
    );

    const image = this.getImageSrc();

    return (
      <Modal
        isVisible={isVisible}
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
            imageSrc={image}
            height={600}
            width={400}
          />

          {favourite ? heartIcon : addToFavouritesButton}

          <Icon
            name="arrow-downward"
            raised
            reverse
            size={24}
            onPress={this.toggleModal}
            color="grey"
          />

          <DropdownAlert ref={(ref) => { this.dropDown = ref; }} />
        </View>
      </Modal>
    );
  }
}

DrinkModal.defaultProps = {
  drinkData: null,
  favourite: false,
  getFavourites: null,
};

DrinkModal.propTypes = {
  drinkData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  favourite: PropTypes.bool,
  getFavourites: PropTypes.func,
};

export default DrinkModal;
