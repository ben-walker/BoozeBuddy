import React from 'react';
import PropTypes from 'prop-types';
import {
  AsyncStorage,
  ScrollView,
  View,
} from 'react-native';
import {
  Button, FormInput, FormLabel,
} from 'react-native-elements';
import PickerSelect from 'react-native-picker-select';
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
        gender: '',
        weightKg: '',
        loading: false,
      };
    }

    async componentDidMount() {
      // parse out user data
      const userData = await AsyncStorage.getItem('userToken').then(userToken => JSON.parse(userToken));
      this.setState({ userdata: userData });
      this.setState({
        gender: userData.gender,
        weightKg: userData.weightKg.toString(),
      });
    }

    save = async () => {
      const {
        gender,
        weightKg,
      } = this.state;
      const { navigation } = this.props;

      this.setState({ loading: true });
      const rawResponse = await fetch('https://dr-robotnik.herokuapp.com/api/updateData', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gender, weightKg: weightKg * 1 }),
      });
      this.setState({ loading: false });

      if (!rawResponse.ok) return alert('There was an error updating your information');
      const response = await rawResponse.json();
      await AsyncStorage.setItem('userToken', JSON.stringify(response));
      navigation.state.params.onProfileDataChange(this.state);
      return navigation.goBack();
    };

    render() {
      const { navigation } = this.props;
      const {
        userdata,
        gender,
        theme,
        weightKg,
        loading,
      } = this.state;

      return (
        <View style={style.container}>
          <ScrollView style={style.container}>
            <FormLabel>GENDER</FormLabel>
            <PickerSelect
              items={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' },
              ]}

              onValueChange={async (value) => {
                await this.setState({ gender: value });
                userdata.gender = value;
              }}
              hideDoneBar
            >
              <FormInput
                value={gender}
                inputStyle={style.input}
              />
            </PickerSelect>


            <FormLabel>WEIGHT (KG)</FormLabel>
            <FormInput
              onChangeText={async (weightKgInput) => {
                this.setState({ weightKg: weightKgInput });
              }}
              value={weightKg}
              keyboardType="decimal-pad"
              inputAccessoryViewID="accessoryView"
              inputStyle={style.input}
            />

            <FormLabel>Theme</FormLabel>
            <PickerSelect
              items={[
                { label: 'Dark', value: 'Dark' },
                { label: 'Light', value: 'Light' },
              ]}
              onValueChange={async (value) => {
                await this.setState({ theme: value });
              }}
              hideDoneBar
            >
              <FormInput
                value={theme}
                inputStyle={style.input}
              />
            </PickerSelect>

            <Button
              onPress={this.save}
              containerViewStyle={style.button}
              rounded
              raised
              title="Save"
              backgroundColor={colors.errorBackground}
              loading={loading}
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
