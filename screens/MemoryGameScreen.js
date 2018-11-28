import React from 'react';
import { View, Alert } from 'react-native';
import { Text } from 'react-native-elements';
import style from '../constants/StyleSheet';
import colors from '../constants/Colors';
import GameButton from '../components/GameButton';

export default class MemoryGameScreen extends React.Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      sequenceLength: 5,
      memorizeTime: 5, /* eslint-disable-line */ // False positive.
      gameState: 'Memorize', // Memorize, Guess
      timer: null,
      timerCounter: 0,
      playerGuessIndex: 0,
      numCorrectGuesses: 0,
      gamePaused: false,
      playerGuesses: [],
      generatedArrayOfColours: [],
    };
    this.colourListForRandomization = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  }

  componentDidMount() {
    const { sequenceLength } = this.state;

    const timer = setInterval(this.tick, 1000);

    this.setState(prev => ({
      timer,
      generatedArrayOfColours: this.generateRandomSequenceOfColouredButtons(prev.sequenceLength),
    }));

    const sequence = [];

    for (let i = 0; i < sequenceLength; i += 1) {
      sequence.push({ id: i, colour: colors.secondary });
    }

    const colourListArr = sequence.map(colourInfo => (
      <GameButton customWidth={20} key={colourInfo.id} colour={colourInfo.colour} />
    ));

    this.state.playerGuesses = colourListArr;

    this.resetGameState();
  }

  componentWillUnmount() {
    const { timer } = this.state;
    clearInterval(timer);
  }

  tick = () => {
    const {
      timer,
      gamePaused,
      gameState,
      timerCounter,
    } = this.state;

    if (!gamePaused) {
      if (gameState === 'Memorize') {
        this.setState(prev => ({
          timerCounter: prev.timerCounter - 1,
        }));
      }

      if ((timerCounter <= 0) && (gameState === 'Memorize')) {
        clearInterval(timer);
        this.setState({
          gameState: 'Guess',
          playerGuessIndex: 0,
        });
      }
    }
  }

  resetGameState = () => {
    const {
      timer,
      sequenceLength,
    } = this.state;

    this.setState(prev => ({
      timer,
      generatedArrayOfColours: this.generateRandomSequenceOfColouredButtons(prev.sequenceLength),
    }));

    const sequence = [];

    for (let i = 0; i < sequenceLength; i += 1) {
      sequence.push({ id: i, colour: colors.secondary });
    }

    const colourListArr = sequence.map(colourInfo => (
      <GameButton customWidth={20} key={colourInfo.id} colour={colourInfo.colour} />
    ));

    this.setState({
      playerGuesses: colourListArr,
    });

    this.setState(prev => ({
      gameState: 'Memorize',
      timerCounter: prev.memorizeTime,
      playerGuessIndex: 0,
      numCorrectGuesses: 0,
    }));
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

  getColourFromGuessElement = element => element.props.colour

  unpauseGame = () => {
    this.state.gamePaused = false;
  }

  checkGameOver = () => {
    const {
      playerGuessIndex,
      sequenceLength,
      playerGuesses,
      generatedArrayOfColours,
    } = this.state;

    let playerGuessColour = null;
    let actualColour = null;

    if (playerGuessIndex >= sequenceLength - 1) {
      for (let i = 0; i < sequenceLength; i += 1) {
        playerGuessColour = this.getColourFromGuessElement(playerGuesses[i]);
        actualColour = this.getColourFromGuessElement(generatedArrayOfColours[i]);
        if (playerGuessColour === actualColour) {
          this.setState(prev => ({
            numCorrectGuesses: prev.numCorrectGuesses + 1,
          }));
        }
      }
      this.state.gamePaused = true;

      const { numCorrectGuesses } = this.state;

      Alert.alert(
        'Game Over',
        `You got ${(numCorrectGuesses / sequenceLength).toFixed(2) * 100}% correct.`,
        [
          { text: 'OK', onPress: this.unpauseGame },
        ],
        { cancelable: false },
      );
      this.resetGameState();
    }
  }

  generateRandomSequenceOfColouredButtons = (length) => {
    const initialArr = this.generateRandomColourSequence(length);
    const colourListArr = initialArr.map(colourInfo => (
      <GameButton customWidth={20} key={colourInfo.id} colour={colourInfo.colour} />
    ));
    return colourListArr;
  }

  applyPlayerGuess = (guess) => {
    const {
      playerGuesses,
      playerGuessIndex,
    } = this.state;

    const playerGuessesCopy = playerGuesses;
    const newButton = <GameButton customWidth={20} key={playerGuessIndex} colour={guess} />;
    playerGuessesCopy[playerGuessIndex] = newButton;
    this.setState({
      playerGuesses: playerGuessesCopy,
    });

    this.checkGameOver();

    this.setState(prev => ({
      playerGuessIndex: prev.playerGuessIndex + 1,
    }));
  }

  generateColouredButtonsForGuessing = () => {
    const sequence = [];

    for (let i = 0; i < this.colourListForRandomization.length; i += 1) {
      sequence.push({ id: i, colour: this.colourListForRandomization[i] });
    }

    const colourListArr = sequence.map(colourInfo => (
      <GameButton
        customWidth={40}
        key={colourInfo.id}
        colour={colourInfo.colour}
        onClick={() => this.applyPlayerGuess(colourInfo.colour)}
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
          <View style={{ flex: 1 }} />

          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 40, fontWeight: 'bold' }}>
              {gameState === 'Memorize' ? timerCounter : 'Time to Guess!'}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            {gameState === 'Memorize' ? null : playerGuesses}
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            {gameState === 'Memorize' ? generatedArrayOfColours : this.generateColouredButtonsForGuessing() }
          </View>
          <View style={{ flex: 2 }} />
        </View>
      </View>
    );
  }
}
