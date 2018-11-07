import React from 'react';
import moment from 'moment';
import url from 'url';
import {
  ActivityIndicator,
  View,
  AsyncStorage,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  List,
  ListItem,
  Text,
} from 'react-native-elements';
import DropdownAlert from 'react-native-dropdownalert';
import DrinkModal from '../components/DrinkModal';
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
    }

    async componentDidMount() {
      // parse out user data
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = JSON.parse(userToken);
      this._setBacConstants(userData);

      // store started drinking moment, remove stopped drinking moment
      const drinkTimestamp = new moment();
      await AsyncStorage.setItem('startedDrinkingMoment', drinkTimestamp);
      await AsyncStorage.removeItem('stoppedDrinkingMoment');

      // get first page of drinks
      this._getPageOfDrinks();
      this._getFavourites();
    }

    componentWillUnmount() {
      clearInterval(this.recalculating);
    }

    _setBacConstants = (userData) => {
      let BW = 0.0;
      let MR = 0.0;
      const Wt = userData.weightKg;
      switch (userData.gender) {
        case 'Male':
          BW = 0.58;
          MR = 0.015;
          break;
        case 'Female':
          BW = 0.49;
          MR = 0.017;
          break;
        case 'Other':
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

    _getPageOfDrinks = async () => {
      this.setState({ drinkListLoading: true });
      let URL = 'https://dr-robotnik.herokuapp.com/api/pageOfDrinks';
      const queryData = { page: this.state.drinkPage, perPage: 20, showUserCreated: 'y' };
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
      response = this._convertJsonNulls(response);
      await this.setState({
        drinks: this.state.drinks.concat(response),
        drinkPage: this.state.drinkPage + 1,
      });
    }

    _convertJsonNulls = (jsonArray) => {
      const stringified = JSON.stringify(jsonArray, (key, value) => (value == null ? '' : value));
      return JSON.parse(stringified);
    }

    _getFavourites = async () => {
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
      response.forEach((part, index, array) => {
        array[index].favourite = true;
      });
      await this.setState({ favourites: response });
    }

    _logDrink = async (drink) => {
      // calculate number of standard drinks
      const servingSize = drink.primary_category
        ? beverageServingsML[drink.primary_category]
        : drink.package_unit_volume_in_milliliters;

      const ethanolDensity = 0.789;
      const alcPercentage = drink.alcohol_content / 100;
      const standardDrinks = (servingSize / 1000) * alcPercentage * ethanolDensity;

      await this.setState({
        SD: this.state.SD + standardDrinks,
        loggedDrinks: [...this.state.loggedDrinks, drink],
      });
      await this._calculateBAC();
      this.dropdown.alertWithType(
        'info', // notif type
        'Hey, Listen!', // title of notif
        `That was ${parseFloat(standardDrinks.toFixed(2))} standard drinks; be safe and have fun!`, // message
      );
      this.state.numDrinks = this.state.numDrinks + parseFloat(standardDrinks.toFixed(2));

      // only start recalculating BAC once first drink logged
      if (!this.recalculating) this.recalculating = setInterval(this._calculateBAC, 5000);
    }

    _calculateBAC = async () => {
      const startedDrinkingMoment = await AsyncStorage.getItem('startedDrinkingMoment');
      const currentMoment = new moment();
      const drinkingTime = moment.duration(currentMoment.diff(startedDrinkingMoment)).asHours();

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
        const stoppedDrinkingMoment = new moment();
        await AsyncStorage.setItem('stoppedDrinkingMoment', stoppedDrinkingMoment);

        this.dropdown.alertWithType(
          'info', // notif type
          'It looks like you\'ve sobered up!', // title of notif
          `You had ${parseFloat(this.state.numDrinks.toFixed(2))} standard drinks over ${parseFloat(drinkingTime.toFixed(2))} hour(s).`, // message
        );
      }
    }

    _fakeStoppedDrinking = async () => {
      const startedDrinkingMoment = await AsyncStorage.getItem('startedDrinkingMoment');
      const currentMoment = new moment();
      const drinkingTime = moment.duration(currentMoment.diff(startedDrinkingMoment)).asHours();

      this.dropdown.alertWithType(
        'info', // notif type
        'It looks like you\'ve sobered up!', // title of notif
        `You had ${parseFloat(this.state.numDrinks.toFixed(2))} standard drinks over ${parseFloat(drinkingTime.toFixed(2))} hour(s).`, // message
      );
    }

    _renderFooter = () => {
      if (!this.state.drinkListLoading) return null;

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
      const drinkListHeader = (
        <View style={style.container}>
          <Text style={style.titleText}>Drink List</Text>
        </View>
      );

      return (
        <View style={style.container}>
          <Button
            title="[DEMO] Simulate Stop Drinking"
            onPress={this._fakeStoppedDrinking}
          />

          <DrinkModal
            ref="drinkModal"
            drinkData={this.state.modalDrink}
          />

          <View style={style.secondaryContentContainer}>
            <Text style={style.titleText}>
BAC:
              {parseFloat(this.state.BAC.toFixed(4))}
              {' '}
g/dL
            </Text>
            <Text style={style.smallText}>
Drinks :
              {Number(this.state.numDrinks).toFixed(1)}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <List>
              <FlatList
                data={this.state.favourites.concat(this.state.drinks)}
                keyExtractor={item => item._id}
                ListHeaderComponent={drinkListHeader}
                ListFooterComponent={this._renderFooter}
                            // onEndReached={this._getPageOfDrinks}
                onEndReachedThreshold={0.1}
                renderItem={item => (
                  <TouchableOpacity
                    onLongPress={async () => {
                      await this.setState({ modalDrink: item.item });
                      this.refs.drinkModal._toggleModal();
                    }}
                  >
                    <ListItem
                      roundAvatar
                      title={item.item.name}
                      rightIcon={{ name: 'add-circle', color: colors.accent }}
                      leftIcon={item.item.favourite
                        ? { name: 'favorite', color: colors.red }
                        : null
                                        }
                      onPressRightIcon={() => this._logDrink(item.item)}
                      subtitle={`${item.item.package_unit_volume_in_milliliters} mL • ${item.item.secondary_category} • ${item.item.alcohol_content / 100}%`}
                      avatar={item.item.image_thumb_url
                        ? { uri: item.item.image_thumb_url }
                        : require('../assets/images/DrinkIcons/beer.png')}
                    />
                  </TouchableOpacity>
                )}
              />
            </List>
          </View>
          <DropdownAlert ref={ref => this.dropdown = ref} />
        </View>
      );
    }
}
