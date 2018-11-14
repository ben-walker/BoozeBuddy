import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import style from '../constants/StyleSheet';
import colors from '../constants/Colors';
import GameButton from '../components/GameButton';

export default class MemoryGameScreen extends React.Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      gameState: 'Memorize', // Memorize, Guess
      timer: null,
      timerCounter: 0,
      playerGuessIndex: 0,
      playerGuesses: [],
      generatedArrayOfColours: [],
    };
    this.colourListForRandomization = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  }

  componentDidMount() {
    const sequenceLength = 10;
    const timer = setInterval(this.tick, 1000);

    this.setState({
      timer,
      generatedArrayOfColours: this.generateRandomSequenceOfColouredButtons(sequenceLength),
    });

    const sequence = [];

    for (let i = 0; i < sequenceLength; i += 1) {
      sequence.push({ id: i, colour: colors.secondary });
    }

    const colourListArr = sequence.map(colourInfo => (
      <GameButton customWidth={20} key={colourInfo.id} colour={colourInfo.colour} />
    ));

    this.state.playerGuesses = colourListArr;
  }

  componentWillUnmount() {
    const { timer } = this.state;
    this.clearInterval(timer);
  }

  tick = async () => {
    const {
      timerCounter,
      timer,
    } = this.state;
    await this.setState(prev => ({
      timerCounter: prev.timerCounter + 1,
    }));

    if (timerCounter >= 2) {
      clearInterval(timer);
      this.setState({
        gameState: 'Guess',
      });
    }
  }

  randomColour = () => this.colourListForRandomization[
    Math.floor(Math.random() * this.colourListForRandomization.length)
  ];

  generateRandomColourSequence = (length) => {
    const sequence = [];

    for (let i = 0; i < length; i += 1) {
      sequence.push({ id: i, colour: this.randomColour() });
    }

    return sequence;
  }
<<<<<<< HEAD

  generateRandomSequenceOfColouredButtons = (length) => {
    const initialArr = this.generateRandomColourSequence(length);
    const colourListArr = initialArr.map(colourInfo => (
      <GameButton customWidth={20} key={colourInfo.id} colour={colourInfo.colour} />
    ));
    return colourListArr;
  }

  applyPlayerGuess = async (guess) => {
    // Somehow apply the colour change here.
    console.log(this.state.playerGuesses[this.state.playerGuessIndex]);
    await this.setState(prev => ({
      playerGuessIndex: this.state.playerGuessIndex + 1,
    }));
  }

  generateColouredButtonsForGuessing = () => {
    const sequence = [];

    for (let i = 0; i < this.colourListForRandomization.length; i += 1) {
      sequence.push({ id: i, colour: this.colourListForRandomization[i] });
    }

=======

  generateRandomSequenceOfColouredButtons = (length) => {
    const initialArr = this.generateRandomColourSequence(length);
    const colourListArr = initialArr.map(colourInfo => (
      <GameButton customWidth={20} key={colourInfo.id} colour={colourInfo.colour} />
    ));
    return colourListArr;
  }

  applyPlayerGuess = (guess) => {
    console.log('thinekf');
  }

  generateColouredButtonsForGuessing = () => {
    const sequence = [];

    for (let i = 0; i < this.colourListForRandomization.length; i += 1) {
      sequence.push({ id: i, colour: this.colourListForRandomization[i] });
    }

>>>>>>> 2de100609bd3ef1f4dc48d83fed55aa632a2299e
    const colourListArr = sequence.map(colourInfo => (
      <GameButton
        customWidth={40}
        key={colourInfo.id}
        colour={colourInfo.colour}
<<<<<<< HEAD
        onClick={() => this.applyPlayerGuess(colourInfo.colour)}
=======
        onClick={this.applyPlayerGuess}
>>>>>>> 2de100609bd3ef1f4dc48d83fed55aa632a2299e
      />
    ));
    return colourListArr;
  }

  render() {
    const {
      gameState,
      timerCounter,
      playerGuesses,
      generatedArrayOfColours,
    } = this.state;
    return (
      <View style={style.container}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
          <View style={{ flex: 1}}></View>

          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Text>
              {gameState === 'Memorize' ? timerCounter : 'Time to Guess!'}
            </Text>
<<<<<<< HEAD
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            {gameState === 'Memorize' ? null : playerGuesses}
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            {gameState === 'Memorize' ? generatedArrayOfColours : this.generateColouredButtonsForGuessing() }
          </View>
          <View style={{ flex: 2}}>
=======
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            {gameState === 'Memorize' ? null : playerGuesses}
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            {gameState === 'Memorize' ? generatedArrayOfColours : this.generateColouredButtonsForGuessing()}
          </View>
          <View style={{ flex: 2}}></View>
>>>>>>> 2de100609bd3ef1f4dc48d83fed55aa632a2299e
        </View>
      </View>
    );
  }
}

MemoryGameScreen.propTypes = {
  navigation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
