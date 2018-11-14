import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import {
  Text,
} from 'react-native-elements';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';

const GameButton = (props) => {
  const {
    text,
    colour,
    onClick,
    customWidth,
    customHeight,
  } = props;

  return (
    <TouchableOpacity
      style={{ width: customWidth, height: customHeight, backgroundColor: colour }}
      onPress={onClick}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

GameButton.defaultProps = {
  text: '',
  customWidth: 40,
  customHeight: 40,
  colour: colors.accent,
  onClick: null,
};

GameButton.propTypes = {
  text: PropTypes.string,
  customWidth: PropTypes.number,
  customHeight: PropTypes.number,
  colour: PropTypes.string,
  onClick: PropTypes.func,
};

export default GameButton;
