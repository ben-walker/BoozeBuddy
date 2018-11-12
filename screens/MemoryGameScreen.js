import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Alert,
} from 'react-native';
import {
  Button,
  Text,
} from 'react-native-elements';
import style from '../constants/StyleSheet';
import colors from '../constants/Colors';
import GameButton from '../components/GameButton'

export default class MemoryGameScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            gameState: 'Memorize', // Memorize, Guess
            timer: null,
            timerCounter: 0,
            playerGuessIndex: 0,
            playerGuesses: [],
            generatedArrayOfColours: [],
        }
        this.colourListForRandomization = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
        this.tick = this.tick.bind(this);
        this.randomColour = this.randomColour.bind(this);
        this.generateColouredButtonsForGuessing = this.generateColouredButtonsForGuessing.bind(this);
        this.applyPlayerGuess = this.applyPlayerGuess.bind(this);
    }

    static navigationOptions = { header: null };

    componentDidMount() {
      let sequenceLength = 10;

      let timer = setInterval(this.tick, 1000);
      this.setState({timer});
      this.setState({
        generatedArrayOfColours: this.generateRandomSequenceOfColouredButtons(sequenceLength)
      });

      sequence = [];

      for (let i = 0; i < sequenceLength; i++) {
          sequence.push({id: i, colour: colors.secondary});
      }

      colourListArr = sequence.map(colourInfo => (
        <GameButton customWidth={20} key={colourInfo.id} colour={colourInfo.colour} />
      ));

      this.state.playerGuesses = colourListArr;

    }

    componentWillUnmount() {
      this.clearInterval(this.state.timer);
    }

    tick() {
      this.setState({
        timerCounter: this.state.timerCounter + 1
      });
      if (this.state.timerCounter >= 2) {
        clearInterval(this.state.timer);
        this.setState({
          gameState: 'Guess'
        });
      }

    }



    randomColour() {
        var colourToReturn = this.colourListForRandomization[Math.floor(Math.random() * this.colourListForRandomization.length)];
        return colourToReturn;
    };

    generateRandomColourSequence(length) {
        let sequence = []

        for (let i = 0; i < length; i++) {
            sequence.push({id: i, colour: this.randomColour()});
        }

        return sequence;
    }

    generateRandomSequenceOfColouredButtons(length) {
      var initialArr = this.generateRandomColourSequence(length);
      colourListArr = initialArr.map(colourInfo => (
        <GameButton customWidth={20} key={colourInfo.id} colour={colourInfo.colour} />
      ));
      return colourListArr;
    }

    applyPlayerGuess(guess) {
        console.log("thinekf");
    }

    generateColouredButtonsForGuessing() {
      let sequence = []

      for (let i = 0; i < this.colourListForRandomization.length; i++) {
          sequence.push({id: i, colour: this.colourListForRandomization[i]});
      }

      colourListArr = sequence.map(colourInfo => (
        <GameButton customWidth={40} key={colourInfo.id} colour={colourInfo.colour} onClick = {this.applyPlayerGuess} />
      ));

      return colourListArr;
    }



    render() {
      const { navigation } = this.props;
      return (
        <View style={style.container}>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={{ flex: 1}}></View>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <Text> {this.state.gameState == 'Memorize' ? this.state.timerCounter : 'Time to Guess!'} </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
              {this.state.gameState == 'Memorize' ? null : this.state.playerGuesses}
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
              {this.state.gameState == 'Memorize' ? this.state.generatedArrayOfColours : this.generateColouredButtonsForGuessing()}
            </View>
            <View style={{ flex: 2}}></View>
          </View>
        </View>
      );
    }
}

MemoryGameScreen.propTypes = {
  navigation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
