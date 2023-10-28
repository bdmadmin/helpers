import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

const styles = StyleSheet.create({
  penBackground: {
    backgroundColor: colors.themeColor,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
    marginTop: -20,
  },
  imageContainer: {
    marginTop: moderateScaleVertical(20),
    width: 120,
    height: 120,
    alignItems: 'center',
  },

  userImage: {width: 120, height: 120, borderRadius: 20},
  penIcon: {width: 20, height: 20, resizeMode: 'contain'},
  genderContainer: { borderWidth: 1, flex: 1, padding: 15, borderRadius: 10, borderColor: colors.grey, justifyContent: 'center' },
  genderIcon : {width: 20, height: 20}
});

export default styles;
