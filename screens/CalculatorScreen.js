import React from 'react';
import {
    ScrollView,
    Text,
    View,
    Alert,
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

    render() {
        const date = new Date();
        const timestamp = date.getHours() + ":" + date.getMinutes();
        var bac;

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
