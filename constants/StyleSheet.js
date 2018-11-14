import { StyleSheet } from 'react-native';
import colors from './Colors';

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 22,
    borderColor: colors.background,
  },
  contentContainer: {
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: colors.background,
  },
  secondaryContentContainer: {

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
    fontSize: 12,
    color: colors.defaultText,
  },
  button: {
    borderRadius: 25,
    margin: 15,
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
  drinkModal: {
    backgroundColor: 'white',
    marginTop: 0,
    marginHorizontal: 0,
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  takePictureIcon: {
    position: 'absolute',
    bottom: 80,
    alignContent: 'center',
    paddingBottom: 25,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    flex: 0.12,
    flexDirection: 'row',
  },
});
