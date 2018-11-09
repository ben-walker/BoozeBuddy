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
import DropdownAlert from 'react-native-dropdownalert';
import DrinkModal from '../components/DrinkModal';
import DrinkListItem from '../components/DrinkListItem';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';

const beverageServingsML = {
  Wine: 148,
  Beer: 354,
  Spirits: 44,
  Ciders: 354,
};

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
      SD: 0,
      BW: 0.0,
      MR: 0.0,
      Wt: 0.0,
      drinks: [],
      favourites: [],
      loggedDrinks: [],
      modalDrink: null,
      numDrinks: 0,
    };
    this.drinkModalRef = React.createRef();
  }

  async componentDidMount() {
    // parse out user data
    const userToken = await AsyncStorage.getItem('userToken');
    const userData = JSON.parse(userToken);
    this.setBacConstants(userData);

    // store started drinking moment, remove stopped drinking moment
    const drinkTimestamp = new Moment();
    await AsyncStorage.setItem('startedDrinkingMoment', drinkTimestamp);
    await AsyncStorage.removeItem('stoppedDrinkingMoment');

    // get first page of drinks
    this.getPageOfDrinks();
    this.getFavourites();
  }

  componentWillUnmount() {
    clearInterval(this.recalculating);
  }

  setBacConstants = (userData) => {
    let BW = 0.0;
    let MR = 0.0;
    const Wt = userData.weightKg;
    switch (userData.gender) {
      case 'Male':
        BW = 0.58;
        MR = 0.015;
        break;
      case 'Female': case 'Other': default:
        BW = 0.49;
        MR = 0.017;
        break;
    }
    this.setState({
      BW,
      MR,
      Wt,
    });
  }

  getPageOfDrinks = async () => {
    const {
      drinkPage,
      drinks,
    } = this.state;

    this.setState({ drinkListLoading: true });
    let URL = 'https://dr-robotnik.herokuapp.com/api/pageOfDrinks';
    const queryData = { page: drinkPage, perPage: 20, showUserCreated: 'y' };
    URL += url.format({ query: queryData });

    const rawResponse = await fetch(URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    this.setState({ drinkListLoading: false });
    if (!rawResponse.ok) return;
    let response = await rawResponse.json();
    response = this.convertJsonNulls(response);
    await this.setState({
      drinks: drinks.concat(response),
      drinkPage: drinkPage + 1,
    });
  }

  convertJsonNulls = (jsonArray) => {
    const stringified = JSON.stringify(jsonArray, (key, value) => (value == null ? '' : value));
    return JSON.parse(stringified);
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
    response.forEach((part, index) => {
      response[index].favourite = true;
    });
    await this.setState({ favourites: response });
  }

  logDrink = async (drink) => {
    const {
      SD,
      loggedDrinks,
      numDrinks,
    } = this.state;

    // calculate number of standard drinks
    const servingSize = drink.primary_category
      ? beverageServingsML[drink.primary_category]
      : drink.package_unit_volume_in_milliliters;

    const ethanolDensity = 0.789;
    const alcPercentage = drink.alcohol_content / 100;
    const standardDrinks = (servingSize / 1000) * alcPercentage * ethanolDensity;

    await this.setState({
      SD: SD + standardDrinks,
      loggedDrinks: [...loggedDrinks, drink],
    });
    await this.calculateBAC();
    this.dropdown.alertWithType(
      'info', // notif type
      'Hey, Listen!', // title of notif
      `That was ${parseFloat(standardDrinks.toFixed(2))} standard drinks; be safe and have fun!`, // message
    );
    this.state.numDrinks = numDrinks + parseFloat(standardDrinks.toFixed(2));

    // only start recalculating BAC once first drink logged
    if (!this.recalculating) this.recalculating = setInterval(this.calculateBAC, 5000);
  }

  calculateBAC = async () => {
    const { numDrinks } = this.state;
    const startedDrinkingMoment = await AsyncStorage.getItem('startedDrinkingMoment');
    const currentMoment = new Moment();
    const drinkingTime = Moment.duration(currentMoment.diff(startedDrinkingMoment)).asHours();

    const {
      SD,
      BW,
      Wt,
      MR,
    } = this.state;
    const EBAC = ((0.806 * SD * 1.2) / (BW * Wt)) - (MR * drinkingTime);
    await this.setState({ BAC: EBAC });

    // determine stopped drinking state
    if (EBAC < 0.001) {
      const stoppedDrinkingMoment = new Moment();
      await AsyncStorage.setItem('stoppedDrinkingMoment', stoppedDrinkingMoment);

      this.dropdown.alertWithType(
        'info', // notif type
        'It looks like you\'ve sobered up!', // title of notif
        `You had ${parseFloat(numDrinks.toFixed(2))} standard drinks over ${parseFloat(drinkingTime.toFixed(2))} hour(s).`, // message
      );
    }
  }

  fakeStoppedDrinking = async () => {
    const { numDrinks } = this.state;
    const startedDrinkingMoment = await AsyncStorage.getItem('startedDrinkingMoment');
    const currentMoment = new Moment();
    const drinkingTime = Moment.duration(currentMoment.diff(startedDrinkingMoment)).asHours();

    this.dropdown.alertWithType(
      'info', // notif type
      'It looks like you\'ve sobered up!', // title of notif
      `You had ${parseFloat(numDrinks.toFixed(2))} standard drinks over ${parseFloat(drinkingTime.toFixed(2))} hour(s).`, // message
    );
  }

  updateModalDrink = (drink) => {
    this.setState({ modalDrink: drink });
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

  render() {
    const {
      modalDrink,
      BAC,
      numDrinks,
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
        />

        <View style={style.secondaryContentContainer}>
          <Text style={style.titleText}>
BAC:
            {parseFloat(BAC.toFixed(4))}
            {' '}
g/dL
          </Text>
          <Text style={style.smallText}>
Drinks :
            {Number(numDrinks).toFixed(1)}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <List>
            <FlatList
              data={favourites.concat(drinks)}
              keyExtractor={item => item._id /* eslint-disable-line no-underscore-dangle */}
              ListHeaderComponent={drinkListHeader}
              ListFooterComponent={this.renderFooter}
              // onEndReached={this.getPageOfDrinks}
              // onEndReachedThreshold={0.1}
              renderItem={item => (
                <DrinkListItem
                  drinkData={item.item}
                  drinkModalRef={this.drinkModalRef}
                  updateModalDrink={this.updateModalDrink}
                  logDrink={this.logDrink}
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
