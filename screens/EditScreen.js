import React from 'react';
import PropTypes from 'prop-types';
import {
  AsyncStorage,
  ScrollView,
  View,
} from 'react-native';
import { Button, List, ListItem } from 'react-native-elements';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';

export default class EditScreen extends React.Component {
  static navigationOptions = {
    title: 'Edit',
    headerTintColor: colors.defaultText,
    headerStyle: { backgroundColor: colors.dark },
  };

  constructor(props) {
    super(props);
    this.state = {
      userdata: '',
    };
  }

  async componentDidMount() {
    // parse out user data
    const userData = await AsyncStorage.getItem('userToken').then(userToken => JSON.parse(userToken));
    this.setState({ userdata: userData });
  }

  save = async () => {
    const { navigation } = this.props;
    await fetch('https://dr-robotnik.herokuapp.com/api/logOut', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('Auth');
  };

  render() {
    const { navigation } = this.props;
    const { userdata } = this.state;
    const list = [
      {
        title: 'Gender',
        subtitle: userdata.gender,


      },
      {
        title: 'Weight',
        subtitle: userdata.weightKg,


      },
      {
        title: 'Theme',
        subtitle: 'Dark',


      },


    ];

    return (
      <View style={style.container}>
        <ScrollView style={style.container}>
          <List>
            {
                    list.map(item => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        subtitle={item.subtitle}
                      />
                    ))
                }
          </List>
            <Button
                onPress={this.save}
                containerViewStyle={style.button}
                rounded
                raised
                title="Save"
                backgroundColor={colors.errorBackground}
            />
            <Button
                onPress={() => navigation.navigate('Profile')}
                containerViewStyle={style.button}
                rounded
                raised
                title="Cancel"
                backgroundColor={colors.accent}
            />
        </ScrollView>
      </View>
    );
  }
}

EditScreen.propTypes = {
  navigation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
