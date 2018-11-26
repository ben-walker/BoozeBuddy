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
    toggleFavourite,
  } = props;

  const addToFavourites = async (drinkData) => {
    let rawResponse;
    if (drinkData.favourite) {
      rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/removeFavourite', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        // eslint-disable-next-line no-underscore-dangle
        body: JSON.stringify({ id: drinkData._id }),
      });
    } else {
      rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/addFavourite', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        // eslint-disable-next-line no-underscore-dangle
        body: JSON.stringify({ id: drinkData._id }),
      });
    }

    if (rawResponse.ok) toggleFavourite(drinkData);
  };


  const getSubtitle = () => {
    const percentage = drinkData.alcohol_content / 100;
    return `${drinkData.package_unit_volume_in_milliliters} mL • ${drinkData.secondary_category} • ${percentage}%`;
  };

  const getFavouriteIcon = () => (favourite
    ? ({ name: 'favorite', color: colors.red })
    : ({ name: 'favorite', color: colors.secondary }));

  const getAvatar = () => {
    if (!drinkData) return ({ uri: '' });
    if (drinkData.picture) return ({ uri: `https://dr-robotnik.herokuapp.com/api/customDrinkImage?drinkName=${drinkData.name}` });
    return drinkData.image_thumb_url ? ({ uri: drinkData.image_thumb_url }) : beerIcon.default;
  };

  return (
    <TouchableOpacity
      onLongPress={() => {
        updateModalDrink(drinkData);
        drinkModalRef.current.toggleModal();
      }}
    >
      <ListItem
        roundAvatar
        avatar={getAvatar()}
        title={drinkData.name}
        subtitle={getSubtitle()}
        rightIcon={{ name: 'add', color: colors.accent }}
        onPressRightIcon={() => logDrink(drinkData)}
        leftIcon={getFavouriteIcon()}
        leftIconOnPress={() => addToFavourites(drinkData)}
        containerStyle={{ backgroundColor: colors.background }}
        titleStyle={{ color: 'white' }}
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
  toggleFavourite: PropTypes.func.isRequired,
};

export default DrinkListItem;
