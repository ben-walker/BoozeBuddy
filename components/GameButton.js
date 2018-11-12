import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import {
  Button,
  Text,
} from 'react-native-elements';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';

class GameButton extends Component {

  render() {
    const {
      text,
      colour,
      onClick,
      customWidth,
      customHeight
    } = this.props;

    return (
      <TouchableOpacity style={{width: this.props.customWidth, height: this.props.customHeight, backgroundColor: this.props.colour}}
			   onPress={() => this.props.onClick}
		  >
      <Text>{text}</Text>
      </TouchableOpacity>
    );
  }
}

GameButton.defaultProps = {
  text: "",
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
