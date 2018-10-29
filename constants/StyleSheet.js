import { StyleSheet } from 'react-native';
import colors from './Colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 22,
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.defaultText,
    },
    button: {
        width: '50%',
        padding: 15,
    },
    input: {
        color: 'white',
    },
    eulaCheckbox: {
        backgroundColor: colors.background,
        borderColor: colors.background,
    },
    errorMsg: {
        color: colors.errorText,
    },
    defaultText: {
        fontSize: 18,
        color: colors.defaultText,
        lineHeight: 24,
        textAlign: 'center',
    },
});