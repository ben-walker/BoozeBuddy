import React from 'react';
import {
  ScrollView,
  View,
  AsyncStorage,
} from 'react-native';
import PureChart from 'react-native-pure-chart';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';

export default class HistoryScreen extends React.Component {
  static navigationOptions = {
    title: 'History',
    headerTintColor: colors.defaultText,
    headerStyle: { backgroundColor: colors.dark },
  };

  constructor(props) {
    super(props);
    this.state = { chartData: [] };
  }

  async componentDidMount() {
    const dataFromStorage = await AsyncStorage.getItem('chartData');
    this.setState({ chartData: JSON.parse(dataFromStorage) });
  }

  render() {
    const { chartData } = this.state;

    return (
      <View style={style.container}>
        <ScrollView style={style.container}>
          <PureChart
            data={chartData}
            type="line"
            width="100%"
            height={200}
            numberOfYAxisGuideLine={4}
          />
        </ScrollView>
      </View>
    );
  }
}
