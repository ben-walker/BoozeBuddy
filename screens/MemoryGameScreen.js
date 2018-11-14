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
      memorizeTime: 5,
      gameState: 'Memorize', // Memorize, Guess
      timer: null,
      timerCounter: 0,
      playerGuessIndex: 0,
      numCorrectGuesses: 0,
      playerGuesses: [],
      generatedArrayOfColours: [],
    };
    this.colourListForRandomization = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  }

  componentDidMount() {
    let timer = setInterval(this.tick, 1000);

    this.setState({
      timer,
      generatedArrayOfColours: this.generateRandomSequenceOfColouredButtons(this.state.sequenceLength),
    });

    const sequence = [];

    for (let i = 0; i < this.state.sequenceLength; i += 1) {
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
      timerCounter: prev.timerCounter - 1,
    }));

    if (timerCounter <= 0) {
      clearInterval(timer);
      this.setState({
        gameState: 'Guess',
      });
    }
  }

  resetGameState = () => {
    timer = setInterval(this.tick, 1000);

    this.setState({
      timer,
      generatedArrayOfColours: this.generateRandomSequenceOfColouredButtons(this.state.sequenceLength),
    });

    const sequence = [];

    for (let i = 0; i < this.state.sequenceLength; i += 1) {
      sequence.push({ id: i, colour: colors.secondary });
    }

    const colourListArr = sequence.map(colourInfo => (
      <GameButton customWidth={20} key={colourInfo.id} colour={colourInfo.colour} />
    ));

    this.state.playerGuesses = colourListArr;

    this.setState({
      gameState: 'Memorize',
      timerCounter: this.state.memorizeTime,
      playerGuessIndex: 0,
      numCorrectGuesses: 0,
    });
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

  getColourFromGuessElement = (element) => {
    return element["props"]["colour"];
  }

  checkGameOver = async () => {
    if (this.state.playerGuessIndex >= this.state.sequenceLength - 1) {
      for (let i = 0; i < this.state.sequenceLength; i += 1) {
        if (this.getColourFromGuessElement(this.state.playerGuesses[i]) == (this.getColourFromGuessElement(this.state.generatedArrayOfColours[i]))) {
          await this.setState(prev => ({
            numCorrectGuesses: prev.numCorrectGuesses + 1,
          }));
        }
      }
      Alert.alert("You got " + ((this.state.numCorrectGuesses / this.state.sequenceLength).toFixed(2) * 100) + "% correct.");
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

  applyPlayerGuess = async (guess) => {
    const { playerGuesses, playerGuessIndex } = this.state;
    let playerGuessesCopy = this.state.playerGuesses;
    playerGuessesCopy[this.state.playerGuessIndex] = <GameButton customWidth={20} key={this.state.playerGuessIndex} colour={guess} />;
    await this.setState(prev => ({
      playerGuesses: playerGuessesCopy,
    }));

    this.checkGameOver();

    await this.setState(prev => ({
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
            <Text style={{fontSize: 40, fontWeight: 'bold'}}>
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
