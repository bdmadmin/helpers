import {StyleSheet} from 'react-native';
import {color} from 'react-native-reanimated';
import colors from '../../theme/colors';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

const styles = StyleSheet.create({
  container: {flex: 0, width: '100%'},
  textInput: {...commonStyles.fontSize14, flex: 1, textAlignVertical: 'top', color: colors.light_black, padding: 20, lineHeight: 60},
  continueButton: {backgroundColor: colors.themeColor, paddingHorizontal: moderateScale(20), paddingVertical: moderateScaleVertical(10), borderRadius: 10},

  sheetContainer: {
    backgroundColor: 'white',
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    shadowOffset: {
      width: 0,
      height: 2122,
    },
    shadowOpacity: 0.75,
    shadowRadius: 16.0,
    elevation: 24,
    color: colors.error,
  },
  videoContainer : {
    width: 400,
    height: 300,
    borderWidth: 1,
  }
});

export default styles;
