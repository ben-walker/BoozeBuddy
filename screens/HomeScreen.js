import React from 'react';
import {
    Image,
    ScrollView,
    Text,
    View,
    Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import DrinkCard from '../components/DrinkCard.js';


export default class HomeScreen extends React.Component {
    static navigationOptions = { header: null };

    render() {
        return (
            <View style={style.container}>
                <ScrollView style={style.container} contentContainerStyle={style.secondaryContentContainer}>
                    <View style={style.secondaryContentContainer}>
                        <Image
                            source={
                                __DEV__
                                ? require('../assets/images/DrinkIcons/cheers.png')
                                : require('../assets/images/DrinkIcons/cheers.png')
                            }
                            style={style.imageIcon}
                        />
                    </View>

                    <Button
                        onPress={() => this.props.navigation.navigate('Calculator')}
                        style={style.button}
                        rounded
                        title='Start Drinking?'
                        backgroundColor={colors.accent}
                    />

                    <DrinkCard
                        title="Orange"
                        description="Vodka?"
                        image="https://picsum.photos/100/?random"
                        onPressFunction={() => Alert.alert("Looks like we ran out of alcohol. Try again later.")}>
                    </DrinkCard>

                    <Text style={style.defaultText}>Info about drinking here</Text>
                </ScrollView>
            </View>
        );
    }
}
