import React from 'react';
import {
  ScrollView,
  View,
  AsyncStorage,
  FlatList,
  Text,
} from 'react-native';
import {
  List,
  ListItem,
} from 'react-native-elements';
import PureChart from 'react-native-pure-chart';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import * as beerIcon from '../assets/images/DrinkIcons/beer.png';

export default class HistoryScreen extends React.Component {
  static navigationOptions = {
    title: 'History',
    headerTintColor: colors.defaultText,
    headerStyle: { backgroundColor: colors.dark },
  };

  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      loggedDrinks: [],
    };
  }

  async componentDidMount() {
    if (!this.poll) this.poll = setInterval(this.refreshData, 500);
  }

  refreshData = async () => {
    const newChartData = await AsyncStorage.getItem('chartData');
    const newLoggedDrinks = await AsyncStorage.getItem('loggedDrinks');
    const { chartData } = this.state;

    if (JSON.stringify(chartData) === newChartData) return;

    this.setState({
      chartData: JSON.parse(newChartData),
      loggedDrinks: JSON.parse(newLoggedDrinks),
    });
  }

  getAvatar = (drink) => {
    if (!drink) return ({ uri: '' });
    if (drink.picture) return ({ uri: `https://dr-robotnik.herokuapp.com/api/customDrinkImage?drinkName=${drink.name}` });
    return drink.image_thumb_url ? ({ uri: drink.image_thumb_url }) : beerIcon.default;
  };

  renderChart = () => {
    const { chartData } = this.state;
    return (
      <PureChart
        data={chartData}
        type="line"
        width="100%"
        height={200}
        numberOfYAxisGuideLine={4}
      />
    );
  }

  render() {
    const {
      chartData,
      loggedDrinks,
    } = this.state;

    return (
      <View style={style.container}>
        <ScrollView>
          <Text style={style.titleText}>BAC Over Time</Text>
          {chartData ? this.renderChart() : null}

          <View style={{ flex: 1 }}>
            <Text style={style.titleText}>What You Drank</Text>
            <List containerStyle={{ backgroundColor: colors.background }}>
              <FlatList
                data={loggedDrinks}
                extraData={this.state}
                // eslint-disable-next-line no-underscore-dangle
                keyExtractor={item => item._id + Math.random()}
                renderItem={item => (
                  <ListItem
                    roundAvatar
                    avatar={this.getAvatar(item.item)}
                    title={item.item.name}
                    containerStyle={{ backgroundColor: colors.background }}
                    titleStyle={{ color: 'white' }}
                    hideChevron
                  />
                )}
              />
            </List>
          </View>
        </ScrollView>
      </View>
    );
  }
}
