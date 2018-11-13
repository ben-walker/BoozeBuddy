import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import colors from '../constants/Colors';
import * as beerIcon from '../assets/images/DrinkIcons/beer.png';

const DrinkListItem = (props) => {
  const {
    drinkData,
    drinkModalRef,
    updateModalDrink,
    logDrink,
    favourite,
  } = props;

  const getSubtitle = () => {
    const percentage = drinkData.alcohol_content / 100;
    return `${drinkData.package_unit_volume_in_milliliters} mL • ${drinkData.secondary_category} • ${percentage}%`;
  };

  const getFavouriteIcon = () => (favourite
    ? ({ name: 'favorite', color: colors.red })
    : null);

  const getAvatar = () => {
    if (drinkData) {
      return drinkData.image_thumb_url
        ? ({ uri: drinkData.image_thumb_url })
        : beerIcon.default;
    }
    return ({ uri: '' });
  };

  return (
    <TouchableOpacity
      onLongPress={() => {
        updateModalDrink(drinkData);
        drinkModalRef.current.toggleModal();
      }}
      delayLongPress={100}
    >
      <ListItem
        roundAvatar
        avatar={getAvatar()}
        title={drinkData.name}
        subtitle={getSubtitle()}
        rightIcon={{ name: 'add', color: colors.accent }}
        onPressRightIcon={() => logDrink(drinkData)}
        leftIcon={getFavouriteIcon()}
      />
    </TouchableOpacity>
  );
};

DrinkListItem.propTypes = {
  drinkData: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  drinkModalRef: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateModalDrink: PropTypes.func.isRequired,
  logDrink: PropTypes.func.isRequired,
  favourite: PropTypes.bool.isRequired,
};

export default DrinkListItem;
