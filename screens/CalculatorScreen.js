import React from 'react';
import moment from 'moment';
import url from 'url';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
    AsyncStorage,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {
    Card,
    Button,
    List,
    ListItem,
} from 'react-native-elements';
import Modal from 'react-native-modal';
import DropdownAlert from 'react-native-dropdownalert';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';
import DrinkCard from '../components/DrinkCard.js';

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
            modalVisible: false,
            modalDrink: null,
            numDrinks: 0
        };
        this.calculateBAC = this.calculateBAC.bind(this);
        this.setBacConstants = this.setBacConstants.bind(this);
        this.getPageOfDrinks = this.getPageOfDrinks.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.addToFavourites = this.addToFavourites.bind(this);
        this.getFavourites = this.getFavourites.bind(this);
        this.logDrink = this.logDrink.bind(this);
        this.convertJsonNulls = this.convertJsonNulls.bind(this);
    }

    async componentDidMount() {
        // parse out user data
        const userToken = await AsyncStorage.getItem('userToken');
        const userData = JSON.parse(userToken);
        this.setBacConstants(userData);

        // store started drinking moment, remove stopped drinking moment
        const drinkTimestamp = new moment();
        await AsyncStorage.setItem('startedDrinkingMoment', drinkTimestamp);
        await AsyncStorage.removeItem('stoppedDrinkingMoment');

        // get first page of drinks
        this.getPageOfDrinks();
        this.getFavourites();
    }

    componentWillUnmount() {
        clearInterval(this.recalculating);
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

    async getPageOfDrinks() {
        this.setState({ drinkListLoading: true });
        let URL = 'https://dr-robotnik.herokuapp.com/api/pageOfDrinks';
        const queryData = { page: this.state.drinkPage, perPage: 20 };
        URL += url.format({ query: queryData });

        const rawResponse = await fetch(URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        this.setState({ drinkListLoading: false });
        if (!rawResponse.ok) return;
        let response = await rawResponse.json();
        response = this.convertJsonNulls(response);
        await this.setState({
            drinks: this.state.drinks.concat(response),
            drinkPage: this.state.drinkPage + 1,
        });
    }

    convertJsonNulls(jsonArray) {
        const stringified = JSON.stringify(jsonArray, (key, value) => value == null ? '' : value);
        return JSON.parse(stringified);
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

        await this.setState({
            SD: this.state.SD + standardDrinks,
            loggedDrinks: [...this.state.loggedDrinks, drink],
        });
        await this.calculateBAC();
        this.dropdown.alertWithType(
            'info', // notif type
            'Hey, Listen!', // title of notif
            `That was ${parseFloat(standardDrinks.toFixed(2))} standard drinks; be safe and have fun!` // message
        );
        this.state.numDrinks = this.state.numDrinks + parseFloat(standardDrinks.toFixed(2));

        // only start recalculating BAC once first drink logged
        if (!this.recalculating) this.recalculating = setInterval(this.calculateBAC, 5000);
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

        // determine stopped drinking state
        if (EBAC < 0.001) {
            const stoppedDrinkingMoment = new moment();
            await AsyncStorage.setItem('stoppedDrinkingMoment', stoppedDrinkingMoment);
        }
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

    renderFooter = () => {
        if (!this.state.drinkListLoading) return null;

        return (
            <View style={{
                paddingVertical: 20,
                borderTopWidth: 1,
                borderColor: '#CED0CE',
            }}
            >
                <ActivityIndicator animating size='large'/>
            </View>
        );
    }

    render() {

        const drinkListHeader = <View style={style.container}>
            <Text style={style.titleText}>Drink List</Text>
        </View>;

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
                    <Text style={style.smallText} >Drinks : {Number(this.state.numDrinks).toFixed(1)}</Text>
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

                    <List>
                        <FlatList
                            data={this.state.drinks}
                            keyExtractor={item => item._id}
                            ListHeaderComponent={drinkListHeader}
                            ListFooterComponent={this.renderFooter}
                            renderItem={(item) => (
                                <TouchableOpacity
                                    onLongPress={async () => {
                                        await this.setState({ modalDrink: item.item });
                                        this.setModalVisible(true);
                                    }}
                                >
                                    <ListItem
                                        roundAvatar
                                        title={item.item.name}
                                        rightIcon={{ name: 'add-circle', color: colors.accent }}
                                        onPressRightIcon={() => this.logDrink(item.item)}
                                        subtitle={`${item.item.package_unit_volume_in_milliliters} mL • ${item.item.secondary_category} • ${item.item.alcohol_content / 100}%`}
                                        avatar={{ uri: item.item.image_url }}
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    </List>
                </ScrollView>
                <DropdownAlert ref={ref => this.dropdown = ref}/>
            </View>
        );
    }
}
