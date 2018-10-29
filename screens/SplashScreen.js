import React from 'react';
import {
    View,
} from 'react-native';
import {
    Button,
    Text
} from 'react-native-elements';
import style from '../constants/StyleSheet';
import colors from '../constants/Colors';

export default class SplashScreen extends React.Component {
    static navigationOptions = { header: null };

    render() {
        return (
            <View style={style.container}>
                <View style={{flex: 1 , flexDirection:'column'}}>
                    <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={style.titleText}> Booze Buddy </Text>
                    </View>
                    <View style={{flex: 2, flexDirection:'column', justifyContent: "space-around"}}>
                        <View>
                            <Button
                                style={style.button}
                                rounded
                                title='Sign Up'
                                backgroundColor={colors.actionButton}
                                onPress={() => this.props.navigation.navigate('Signup')}
                            />
                        </View>

                        <View>
                            <Button
                                style={style.button}
                                rounded
                                title='Log In'
                                backgroundColor={colors.actionButton}
                                onPress={() => this.props.navigation.navigate('Login')}
                            />
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                    </View>
                </View>
            </View>
        );
    }
}
