import React from 'react';
import moment from 'moment';
import {
    ScrollView,
    Text,
    View,
    Alert,
    AsyncStorage,
} from 'react-native';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import DrinkCard from '../components/DrinkCard.js';

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
            BAC: 0.0,
            SD: 0,
            BW: 0.0,
            MR: 0.0,
            Wt: 0.0,
        };
        this.calculateBAC = this.calculateBAC.bind(this);
        this.setBacConstants = this.setBacConstants.bind(this);
    }

    setBacConstants(userData) {
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
                BW = 0.58;
                MR = 0.015;
                break;
        }
        this.setState({
            BW,
            MR,
            Wt,
        });
    }

    async componentDidMount() {
        // parse out user data
        const userToken = await AsyncStorage.getItem('userToken');
        const userData = JSON.parse(userToken);
        this.setBacConstants(userData);

        // store started drinking moment
        const drinkTimestamp = new moment();
        await AsyncStorage.setItem('startedDrinkingMoment', drinkTimestamp);
    }

    async calculateBAC() {
        const startedDrinkingMoment = await AsyncStorage.getItem('startedDrinkingMoment');
        const currentMoment = new moment();
        const drinkingTime = moment.duration(currentMoment.diff(startedDrinkingMoment)).asHours();

        const {
            SD,
            BW,
            Wt,
            MR,
        } = this.state;
        const EBAC = (0.806 * SD * 1.2) / (BW * Wt) - (MR * drinkingTime);
        this.setState({ BAC: EBAC });
    }

    render() {
        return (
            <ScrollView style={style.container}>
                <View style={style.secondaryContentContainer}>
                    <Text style={style.titleText}>BAC:</Text>
                </View>

                <View>
                    <Text style={style.smallText}>Drink display : X X X X X X X X X  </Text>
                    <Text style={style.defaultText}>Started Drinking : </Text>
                </View>

                <View style={style.favouritesBar}>
                    <Text style={style.smallText}>Favourites</Text>
                    <DrinkCard
                        title="Red"
                        onPress={() => Alert.alert("Looks like we ran out of alcohol. Try again later.")}>
                    </DrinkCard>
                </View>

                <ScrollView style={style.container}>
                    <Text style={style.smallText}>Drink List</Text>
                    <DrinkCard
                        title="Blue"
                        onPress={() => Alert.alert("Looks like we ran out of alcohol. Try again later.")}>
                    </DrinkCard>
                </ScrollView>
            </ScrollView>
        );
    }
}
