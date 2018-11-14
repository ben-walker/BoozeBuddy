import React from 'react';
import {
  AsyncStorage,
  ScrollView,
  View,
} from 'react-native';
import { Button,List, ListItem  } from 'react-native-elements';
import colors from '../constants/Colors';
import style from '../constants/StyleSheet';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
    headerTintColor: colors.defaultText,
    headerStyle: { backgroundColor: colors.dark },
  };
    constructor(props) {
        super(props);
        this.state = {
            userdata: ''
        };
    }

  logOut = async () => {
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

    async componentDidMount() {
        // parse out user data
        const userData = await AsyncStorage.getItem('userToken').then(userToken => JSON.parse(userToken));
        this.setState({userdata:userData});

    }

  render() {
      const { navigation } = this.props;
      const list = [
          {
              title: 'Username',
              subtitle: this.state.userdata.username,
              navigate: 'Profile'

          },
          {
              title: 'Email',
              subtitle: this.state.userdata.email,
              navigate: 'Profile'

          },
          {
              title: 'Gender',
              subtitle: this.state.userdata.gender,
              navigate: 'Profile'

          },
          {
              title: 'Weight',
              subtitle: this.state.userdata.weightKg,
              navigate: 'Profile'

          },
          {
              title: 'Theme',
              subtitle: 'Dark',
              navigate: 'Profile'

          },
          {
              title: 'Terms and Conditions',
              subtitle: 'legal',
              navigate: 'Legal'

          },


      ];

    return (
      <View style={style.container}>
        <ScrollView style={style.container}>
            <List>
                {
                    list.map((item) => (
                        <ListItem
                            key={item.title}
                            title={item.title}
                            subtitle={item.subtitle}
                            onPress={() => navigation.navigate(item.navigate)}

                        />
                    ))
                }
            </List>
          <Button
            onPress={this.logOut}
            containerViewStyle={style.button}
            rounded
            raised
            title="Log Out"
            backgroundColor={colors.errorBackground}
          />
        </ScrollView>
      </View>
    );
  }
}
