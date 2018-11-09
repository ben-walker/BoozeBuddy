import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import colors from '../constants/Colors';
import * as beerIcon from '../assets/images/DrinkIcons/beer.png';

class DrinkListItem extends Component {
  getSubtitle = () => {
    const { drinkData } = this.props;
    const percentage = drinkData.alcohol_content / 100;
    return `${drinkData.package_unit_volume_in_milliliters} mL • ${drinkData.secondary_category} • ${percentage}%`;
  }

  getFavouriteIcon = () => {
    const { favourite } = this.props;
    return favourite
      ? ({ name: 'favorite', color: colors.red })
      : null;
  }

  getAvatar = () => {
    const { drinkData } = this.props;
    return drinkData.image_thumb_url
      ? ({ url: drinkData.image_thumb_url })
      : beerIcon.default;
  }

  render() {
    const {
      drinkData,
      drinkModalRef,
      updateModalDrink,
      logDrink,
    } = this.props;

    const subtitle = this.getSubtitle();
    const favouriteIcon = this.getFavouriteIcon();
    const avatar = this.getAvatar();

    return (
      <TouchableOpacity
        onLongPress={() => {
          updateModalDrink(drinkData);
          drinkModalRef.current.toggleModal();
        }}
      >
        <ListItem
          roundAvatar
          avatar={avatar}
          title={drinkData.name}
          subtitle={subtitle}
          rightIcon={{ name: 'add', color: colors.accent }}
          onPressRightIcon={() => logDrink(drinkData)}
          leftIcon={favouriteIcon}
        />
      </TouchableOpacity>
    );
  }
}

DrinkListItem.defaultProps = {
  drinkData: null,
  drinkModalRef: null,
  updateModalDrink: null,
  logDrink: null,
  favourite: false,
};

DrinkListItem.propTypes = {
  drinkData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  drinkModalRef: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateModalDrink: PropTypes.func,
  logDrink: PropTypes.func,
  favourite: PropTypes.bool,
};

export default DrinkListItem;
