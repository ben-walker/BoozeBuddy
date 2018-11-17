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
import * as beerIcon from '../assets/images/DrinkIcons/beer.png';

class DrinkModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      favourite: false,
      loading: false,
    };
  }

  static getDerivedStateFromProps(props, current) {
    if (current.favourite !== props.favourite) return { favourite: props.favourite };
    return null;
  }

  addToFavourites = async () => {
    this.setState({ loading: true });
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
    if (!rawResponse.ok) {
      this.setState({ loading: false });
      return this.dropDown.alertWithType('error', 'Error', 'Sorry, we couldn\'t add that drink to your Favourites :(');
    }
    await getFavourites();
    this.setState({
      favourite: true,
      loading: false,
    });
    return this.dropDown.alertWithType('success', 'Added to Favourites', `Nice! We just added ${drinkData.name} to your Favourites!`);
  }

  getImageSrc = () => {
    const { drinkData } = this.props;
    if (!drinkData) return ({ uri: '' });
    if (drinkData.picture) return ({ uri: `https://dr-robotnik.herokuapp.com/api/customDrinkImage?drinkName=${drinkData.name}` });
    return drinkData.image_url ? ({ uri: drinkData.image_url }) : beerIcon.default;
  }

  toggleModal = () => this.setState(prevState => ({ isVisible: !prevState.isVisible }))

  render() {
    const {
      isVisible,
      favourite,
      loading,
    } = this.state;

    const addToFavouritesButton = (
      <Button
        title="Add to Favourites"
        loading={loading}
        rounded
        raised
        containerViewStyle={style.button}
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
            containerStyle={{ margin: 15 }}
            imageSrc={image}
            height={500}
            width={300}
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
  getFavourites: null,
};

DrinkModal.propTypes = {
  drinkData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  getFavourites: PropTypes.func,
};

export default DrinkModal;
