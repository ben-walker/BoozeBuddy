import React from 'react';
import Moment from 'moment';
import url from 'url';
import {
  ActivityIndicator,
  View,
  AsyncStorage,
  FlatList,
} from 'react-native';
import {
  Button,
  List,
  Text,
} from 'react-native-elements';
import {
  includes,
  differenceWith,
  isEqual,
} from 'lodash-es';
import DropdownAlert from 'react-native-dropdownalert';
import DrinkModal from '../components/DrinkModal';
import DrinkListItem from '../components/DrinkListItem';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import * as bacUtilities from '../utilities/bloodAlcoholCalculations';

export default class CalculatorScreen extends React.Component {
  static navigationOptions = {
    title: 'Calculator',
    headerTintColor: colors.defaultText,
    headerStyle: { backgroundColor: colors.dark },
    headerLeft: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      drinkListLoading: false,
      drinkPage: 1,
      BAC: 0.0,
      SD: 0.0,
      BW: 0.0,
      MR: 0.0,
      Wt: 0.0,
      drinks: [],
      favourites: [],
      loggedDrinks: [],
      modalDrink: null,
    };
    this.drinkModalRef = React.createRef();
  }

  async componentDidMount() {
    // parse out user data
    const userData = await AsyncStorage.getItem('userToken').then(userToken => JSON.parse(userToken));
    this.setBacConstants(userData);
    this.initializeStartDrinkingState();
    this.getPageOfDrinks();
    this.getFavourites();
  }

  componentWillUnmount() {
    clearInterval(this.recalculating);
  }

  // calculate body water constant and metabolism constant (derived from gender)
  setBacConstants = (userData) => {
    const {
      gender,
      weightKg,
    } = userData;
    this.setState({
      BW: bacUtilities.getBodyWaterConstant(gender),
      MR: bacUtilities.getMetabolismConstant(gender),
      Wt: weightKg,
    });
  }

  // store started drinking moment, remove stopped drinking moment
  initializeStartDrinkingState = () => {
    const drinkTimestamp = new Moment();
    AsyncStorage.setItem('startedDrinkingMoment', drinkTimestamp);
    AsyncStorage.removeItem('stoppedDrinkingMoment');
  }

  getPageOfDrinks = async () => {
    const { drinkPage } = this.state;
    this.setState({ drinkListLoading: true });
    let URL = 'https://dr-robotnik.herokuapp.com/api/pageOfDrinks';
    URL += url.format({
      query: {
        page: drinkPage,
        perPage: 20,
        showUserCreated: 'y',
      },
    });

    const rawResponse = await fetch(URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    this.setState({ drinkListLoading: false });
    if (!rawResponse.ok) return;
    const response = await rawResponse.json();
    await this.setState(prev => ({
      drinks: prev.drinks.concat(response),
      drinkPage: prev.drinkPage + 1,
    }));
  }

  getFavourites = async () => {
    const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/favourites', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!rawResponse.ok) return;
    const response = await rawResponse.json();
    await this.setState(prev => ({
      favourites: response,
      drinks: differenceWith(prev.drinks, response, isEqual),
    }));
  }

  logDrink = async (drink) => {
    const standardDrinks = bacUtilities.calculateStandardDrinks(
      drink.primary_category,
      drink.alcohol_content,
      drink.package_unit_volume_in_milliliters,
    );

    await this.setState(prev => ({
      SD: prev.SD + standardDrinks,
      loggedDrinks: [...prev.loggedDrinks, drink],
    }));

    await this.calculateBAC();
    this.dropdown.alertWithType(
      'info', // notif type
      'Hey, Listen!', // title of notif
      `That was ${parseFloat(standardDrinks.toFixed(2))} standard drinks; be safe and have fun!`, // message
    );

    // only start recalculating BAC once first drink logged
    if (!this.recalculating) this.recalculating = setInterval(this.calculateBAC, 5000);
  }

  calculateBAC = async () => {
    const drinkingTime = await this.getDrinkingTime();
    const {
      SD,
      BW,
      Wt,
      MR,
    } = this.state;
    const EBAC = bacUtilities.calculateBAC(SD, BW, Wt, MR, drinkingTime);
    await this.setState({ BAC: EBAC });

    // determine stopped drinking state
    if (EBAC < 0.001) {
      await AsyncStorage.setItem('stoppedDrinkingMoment', new Moment());
      this.dropdown.alertWithType(
        'info', // notif type
        'It looks like you\'ve sobered up!', // title of notif
        `You had ${parseFloat(SD.toFixed(2))} standard drinks over ${parseFloat(drinkingTime.toFixed(2))} hour(s).`, // message
      );
    }
  }

  fakeStoppedDrinking = async () => {
    const { SD } = this.state;
    const drinkingTime = await this.getDrinkingTime();

    this.dropdown.alertWithType(
      'info', // notif type
      'It looks like you\'ve sobered up!', // title of notif
      `You had ${parseFloat(SD.toFixed(2))} standard drinks over ${parseFloat(drinkingTime.toFixed(2))} hour(s).`, // message
    );
  }

  updateModalDrink = (drink) => {
    this.setState({ modalDrink: drink });
  }

  isFavourite = (drink) => {
    const { favourites } = this.state;
    return includes(favourites, drink);
  }

  renderFooter = () => {
    const { drinkListLoading } = this.state;
    if (!drinkListLoading) return null;

    return (
      <View style={{
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: '#CED0CE',
      }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  getDrinkingTime = async () => {
    const startedDrinkingMoment = await AsyncStorage.getItem('startedDrinkingMoment');
    const currentMoment = new Moment();
    return Moment.duration(currentMoment.diff(startedDrinkingMoment)).asHours();
  }

  render() {
    const {
      modalDrink,
      BAC,
      SD,
      favourites,
      drinks,
    } = this.state;

    const drinkListHeader = (
      <View style={style.container}>
        <Text style={style.titleText}>Drink List</Text>
      </View>
    );

    return (
      <View style={style.container}>
        <Button
          title="[DEMO] Simulate Stop Drinking"
          onPress={this.fakeStoppedDrinking}
        />

        <DrinkModal
          ref={this.drinkModalRef}
          drinkData={modalDrink}
          favourite={this.isFavourite(modalDrink)}
          getFavourites={this.getFavourites}
        />

        <View style={style.secondaryContentContainer}>
          <Text style={style.titleText}>
BAC:
            {' '}
            {parseFloat(BAC.toFixed(4))}
g/dL
          </Text>
          <Text style={style.smallText}>
Drinks:
            {' '}
            {Number(SD).toFixed(1)}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <List>
            <FlatList
              data={favourites.concat(drinks)}
              keyExtractor={item => item._id /* eslint-disable-line no-underscore-dangle */}
              ListHeaderComponent={drinkListHeader}
              ListFooterComponent={this.renderFooter}
              onEndReached={this.getPageOfDrinks}
              onEndReachedThreshold={0.1}
              renderItem={item => (
                <DrinkListItem
                  drinkData={item.item}
                  drinkModalRef={this.drinkModalRef}
                  updateModalDrink={this.updateModalDrink}
                  logDrink={this.logDrink}
                  favourite={this.isFavourite(item.item)}
                />
              )}
            />
          </List>
        </View>
        <DropdownAlert ref={(ref) => { this.dropdown = ref; }} />
      </View>
    );
  }
}
