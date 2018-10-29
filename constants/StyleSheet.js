import { StyleSheet } from 'react-native';
import colors from './Colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 22,
    },
    contentContainer: {
        marginTop: 1,
        marginBottom: 1,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: colors.background,
    },
    secondaryContentContainer: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: colors.secondary,
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.defaultText,
    },
    smallText: {
        fontSize: 10,
        color: colors.defaultText,
    },
    button: {
        width: '50%',
        padding: 15,
    },
    input: {
        color: 'white',
    },
    favouritesBar: {
        height: 100,
        backgroundColor: colors.secondary,
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
    imageIcon: {
        width: 100,
        height: 80,
        marginTop: 3,
        marginLeft: -10,
        resizeMode: 'contain',
    },
});
