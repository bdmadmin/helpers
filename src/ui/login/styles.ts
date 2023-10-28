import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {moderateScale, moderateScaleVertical, textScale} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

const styles = StyleSheet.create({
  socialBtContainer: {borderWidth: 0.5, borderColor: colors.d9, borderRadius: 8, flexDirection: 'row', height: 50, alignItems: 'center', marginTop: moderateScaleVertical(15)},
  imageStyle: {width: 20, height: 20, marginStart: moderateScale(20)},
  socialTextStyle: {...commonStyles.fontSize14, color: colors.light_black, fontFamily: fontFamily.medium, alignSelf: 'center', position: 'absolute', width: '90%', textAlign: 'center'},
  tappingDetail: {...commonStyles.fontSize10, color: colors.grey_072, marginTop: moderateScaleVertical(15), marginEnd: moderateScale(20), lineHeight: 20, fontSize : textScale(11)},
  socialContainer: {marginTop: moderateScaleVertical(40), justifyContent: 'center'},
  guestText: {...commonStyles.fontSize14, color: colors.grey_072, alignSelf: 'center', marginTop: moderateScaleVertical(25)},
});

export default styles;
