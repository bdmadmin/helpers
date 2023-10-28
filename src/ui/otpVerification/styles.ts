import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: colors.darkOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnContainer: {justifyContent: 'flex-end', margin: 20},
});

export default styles;
