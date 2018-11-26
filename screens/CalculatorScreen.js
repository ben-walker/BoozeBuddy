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
  SearchBar,
} from 'react-native-elements';
import {
  uniqBy,
  debounce,
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
      startedDrinkingMoment: null,
      lastSeenId: null,
      BAC: 0.0,
      SD: 0.0,
      BW: 0.0,
      MR: 0.0,
      Wt: 0.0,
      drinks: [],
      loggedDrinks: [],
      chartData: [],
      query: '',
      modalDrink: null,
    };
    this.drinkModalRef = React.createRef();
    this.debounceSearch = debounce(this.searchDrinks, 500);
  }

  async componentDidMount() {
    // parse out user data
    const userData = await AsyncStorage.getItem('userToken').then(userToken => JSON.parse(userToken));
    this.setBacConstants(userData);
    this.initializeStartDrinkingState();
    this.getPageOfDrinks();
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
  };

  // store started drinking moment, remove stopped drinking moment
  initializeStartDrinkingState = () => {
    const drinkTimestamp = new Moment();
    this.setState({ startedDrinkingMoment: drinkTimestamp });
    AsyncStorage.removeItem('stoppedDrinkingMoment');
  };

  updateDrinkState = async (newDrinks) => {
    await this.setState(prev => ({
      drinks: uniqBy(prev.drinks.concat(newDrinks), '_id'),
      // eslint-disable-next-line no-underscore-dangle
      lastSeenId: newDrinks.length > 0 ? newDrinks[newDrinks.length - 1]._id : prev.lastSeenId,
    }));
  };

  getPageOfDrinks = async () => {
    const {
      lastSeenId,
      drinkListLoading,
    } = this.state;
    if (drinkListLoading) return;

    this.setState({ drinkListLoading: true });
    let URL = 'https://dr-robotnik.herokuapp.com/api/pageOfDrinks';
    URL += url.format({
      query: { lastSeenId, perPage: 20, showUserCreated: 'y' },
    });

    const rawResponse = await fetch(URL, { method: 'GET', credentials: 'include' });
    this.setState({ drinkListLoading: false });
    if (!rawResponse.ok) return;
    const response = await rawResponse.json();
    await this.updateDrinkState(response);
  };

  searchDrinks = async () => {
    const {
      lastSeenId,
      query,
    } = this.state;
    if (!query) return;

    let URL = 'https://dr-robotnik.herokuapp.com/api/drinkSearch';
    URL += url.format({
      query: { lastSeenId, perPage: 20, drinkQuery: query },
    });

    const rawResponse = await fetch(URL, { method: 'GET', credentials: 'include' });
    this.setState({ drinkListLoading: false });
    if (!rawResponse.ok) return;
    const response = await rawResponse.json();
    await this.updateDrinkState(response);
  };

  logDrink = async (drink) => {
    const standardDrinks = bacUtilities.calculateStandardDrinks(
      drink.primary_category,
      drink.alcohol_content,
      drink.package_unit_volume_in_milliliters,
    );

    this.setState(prev => ({
      SD: prev.SD + standardDrinks,
      loggedDrinks: [...prev.loggedDrinks, drink],
    }));

    const EBAC = await this.calculateBAC();
    this.setState(prev => ({
      chartData: [
        ...prev.chartData,
        {
          x: `${parseFloat(this.getDrinkingTime().toFixed(2))} H`,
          y: parseFloat(EBAC.toFixed(4)),
        },
      ],
    }));
    this.persistBACOverTime();

    this.dropdown.alertWithType(
      'info', // notif type
      'Hey, Listen!', // title of notif
      `That was ${parseFloat(standardDrinks.toFixed(2))} standard drinks; be safe and have fun!`, // message
    );

    // only start recalculating BAC once first drink logged
    if (!this.recalculating) this.recalculating = setInterval(this.calculateBAC, 5000);
  };

  persistBACOverTime = () => {
    const { chartData } = this.state;
    AsyncStorage.setItem('chartData', JSON.stringify(chartData));
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
    this.setState({ BAC: EBAC });

    // determine stopped drinking state
    if (EBAC < 0.001) {
      await AsyncStorage.setItem('stoppedDrinkingMoment', new Moment());
      this.dropdown.alertWithType(
        'info', // notif type
        'It looks like you\'ve sobered up!', // title of notif
        `You had ${parseFloat(SD.toFixed(2))} standard drinks over ${parseFloat(drinkingTime.toFixed(2))} hour(s).`, // message
      );
    }
    return EBAC;
  };

  fakeStoppedDrinking = async () => {
    const { SD } = this.state;
    const drinkingTime = await this.getDrinkingTime();

    this.dropdown.alertWithType(
      'info', // notif type
      'It looks like you\'ve sobered up!', // title of notif
      `You had ${parseFloat(SD.toFixed(2))} standard drinks over ${parseFloat(drinkingTime.toFixed(2))} hour(s).`, // message
    );
  };

  updateModalDrink = drink => this.setState({ modalDrink: drink });

  isFavourite = drink => (drink ? !!drink.favourite : false);

  setDrinkAsFavourite = (drink) => {
    const { drinks } = this.state;
    const drinksCopy = drinks;
    const index = drinks.indexOf(drink);
    drinksCopy[index].favourite = true;
    this.setState({ drinks: drinksCopy });
  };

  renderFooter = () => {
    const { drinkListLoading } = this.state;
    if (!drinkListLoading) return null;

    return (
      <View style={{
        paddingVertical: 20,
        backgroundColor: colors.background,
      }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  resetSearch = async (text, loading, action) => {
    await this.setState({
      drinks: [],
      lastSeenId: null,
      query: text,
      drinkListLoading: loading,
    });
    action();
  };

  renderHeader = () => {
    const { query } = this.state;

    return (
      <SearchBar
        placeholder="Search for a drink..."
        round
        clearIcon={{ name: 'close' }}
        onChangeText={text => this.resetSearch(text, true, this.debounceSearch)}
        onClearText={text => this.resetSearch(text, false, this.getPageOfDrinks)}
        value={query}
        containerStyle={{ backgroundColor: colors.background }}
      />
    );
  };

  getDrinkingTime = () => {
    const { startedDrinkingMoment } = this.state;
    const currentMoment = new Moment();
    return Moment.duration(currentMoment.diff(startedDrinkingMoment)).asHours();
  };

  render() {
    const {
      modalDrink,
      BAC,
      SD,
      drinks,
    } = this.state;

    const currentDrinkingTime = this.getDrinkingTime();

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
          onAddToFavourites={this.setDrinkAsFavourite}
        />

        <View style={style.secondaryContentContainer}>
          <Text style={style.titleText}>
BAC:
            {' '}
            {parseFloat(BAC.toFixed(4))}
g/dL
          </Text>
          <Text style={style.smallText}>
            {parseFloat(SD.toFixed(2))}
            {' '}
            drinks over
            {' '}
            {parseFloat(currentDrinkingTime.toFixed(2))}
            {' '}
            hours
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <List containerStyle={{ backgroundColor: colors.background }}>
            <FlatList
              data={drinks}
              extraData={this.state}
              keyExtractor={item => item._id /* eslint-disable-line no-underscore-dangle */}
              ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
              onEndReached={() => {
                const { query } = this.state;
                return query ? this.debounceSearch() : this.getPageOfDrinks();
              }}
              onEndReachedThreshold={0.05}
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
