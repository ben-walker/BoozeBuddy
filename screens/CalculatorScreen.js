import React from 'react';
import moment from 'moment';
import url from 'url';
import {
    ScrollView,
    Text,
    View,
    AsyncStorage,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Card, Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import DropdownAlert from 'react-native-dropdownalert';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import DrinkCard from '../components/DrinkCard.js';

const beverageServingsML = {
    Wine: 148,
    Beer: 354,
    Spirits: 44,
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
            BAC: 0.0,
            SD: 0,
            BW: 0.0,
            MR: 0.0,
            Wt: 0.0,
            drinks: [],
            favourites: [],
            modalVisible: false,
            modalDrink: null,
        };
        this.calculateBAC = this.calculateBAC.bind(this);
        this.setBacConstants = this.setBacConstants.bind(this);
        this.getFirstPageOfDrinks = this.getFirstPageOfDrinks.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.addToFavourites = this.addToFavourites.bind(this);
        this.getFavourites = this.getFavourites.bind(this);
        this.logDrink = this.logDrink.bind(this);
    }

    async componentDidMount() {
        // parse out user data
        const userToken = await AsyncStorage.getItem('userToken');
        const userData = JSON.parse(userToken);
        this.setBacConstants(userData);

        // store started drinking moment
        const drinkTimestamp = new moment();
        await AsyncStorage.setItem('startedDrinkingMoment', drinkTimestamp);

        // get first page of drinks
        this.getFirstPageOfDrinks();
        this.getFavourites();
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

    async getFirstPageOfDrinks() {
        let URL = 'https://dr-robotnik.herokuapp.com/api/pageOfDrinks';
        const queryData = { page: 1, perPage: 20 };
        URL += url.format({ query: queryData });
        
        const rawResponse = await fetch(URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        if (!rawResponse.ok) return;
        const response = await rawResponse.json();
        this.setState({ drinks: response });
    }

    async getFavourites() {
        const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/favourites', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
        if (!rawResponse.ok) return;
        const response = await rawResponse.json();
        await this.setState({ favourites: response });
    }

    async logDrink(drink) {
        // calculate number of standard drinks
        const servingSize = beverageServingsML[drink.primary_category];
        const ethanolDensity = 0.789;
        const alcPercentage = drink.alcohol_content / 100;
        const standardDrinks = (servingSize / 1000) * alcPercentage * ethanolDensity;

        await this.setState({ SD: this.state.SD + standardDrinks });
        this.calculateBAC();
        this.dropdown.alertWithType(
            'info', // notif type
            'Hey, Listen!', // title of notif
            `That was ${parseFloat(standardDrinks.toFixed(2))} drinks; be safe and have fun!` // message
        );
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
        const EBAC = ((0.806 * SD * 1.2) / (BW * Wt)) - (MR * drinkingTime);
        await this.setState({ BAC: EBAC });
    }

    async addToFavourites(drink) {
        const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/addFavourite', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lcboId: drink.lcbo_id })
        });

        if (!rawResponse.ok) return await Alert.alert('Failed!', 'Add to Favourites failed.');
        this.getFavourites();
        return await Alert.alert('Success!',`Added ${drink.name} to your Favourites!`);
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    render() {

        return (
            <View style={style.container}>
                <Modal
                    isVisible={this.state.modalVisible}
                    onSwipe={() => this.setModalVisible(false)}
                    swipeDirection='down'
                >
                    <View style={{ flex: 1 }}>
                        <Card
                            title={this.state.modalDrink
                                ? this.state.modalDrink.name
                                : ''}
                            image={{uri: this.state.modalDrink
                                ? this.state.modalDrink.image_url
                                : ''}}
                        >
                            <Button
                                title='Add to Favourites'
                                onPress={() => {
                                    this.state.modalDrink
                                        ? this.addToFavourites(this.state.modalDrink)
                                        : null;
                                }}
                            />
                            <Button
                                title='Dismiss'
                                onPress={() => this.setModalVisible(false)}
                            />
                        </Card>
                    </View>
                </Modal>

                <View style={style.secondaryContentContainer}>
                    <Text style={style.titleText}>BAC: {parseFloat(this.state.BAC.toFixed(4))} g/dL</Text>
                </View>

                <View>
                    <Text style={style.smallText}>Drink display :</Text>
                </View>
                <ScrollView style={style.container}>
                    <Text style={style.titleText}>Favourites</Text>
                    <FlatList
                        data={this.state.favourites}
                        keyExtractor={(item) => item._id}
                        horizontal={true}
                        renderItem={(item) => <DrinkCard
                            title='I Drank This!'
                            image={item.item.image_url}
                            description={item.item.name}
                            drinkData={item.item}
                            onPressFunction={() => this.logDrink(item.item)}
                        />}
                    />

                    <Text style={style.titleText}>Drink List</Text>
                    <FlatList
                        data={this.state.drinks}
                        keyExtractor={(item) => item._id}
                        numColumns={2}
                        renderItem={(item) => <TouchableOpacity
                            onLongPress={async () => {
                                await this.setState({ modalDrink: item.item });
                                this.setModalVisible(true);
                            }}
                        >
                            <DrinkCard
                                title='I Drank This!'
                                image={item.item.image_url}
                                description={item.item.name}
                                drinkData={item.item}
                                onPressFunction={() => this.logDrink(item.item)}
                            />
                        </TouchableOpacity>}
                    />
                </ScrollView>
                <DropdownAlert ref={ref => this.dropdown = ref}/>
            </View>
        );
    }
}
