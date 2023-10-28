import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

const styles = StyleSheet.create({
  markAsComplete: {backgroundColor: colors.themeColor, width: 120, padding: 4, borderRadius: 4, ...commonStyles.fontSize13, textAlign: 'center', color: colors.white, marginTop: moderateScaleVertical(10)},

  messageImage: {width: 50, height: 50, borderRadius: 10, borderWidth: 1},
  matches: {width: 25, height: 25, borderRadius: 15, borderWidth: 2, borderColor: colors.white},
  otherMatches: {...commonStyles.fontSize12, fontFamily: fontFamily.medium, color: colors.grey_95},
  messageCount: {...commonStyles.fontSize10, color: colors.white, alignSelf: 'center', textAlignVertical: 'center'},
  dot: {width: 8, height: 8, borderRadius: 10, backgroundColor: colors.error},
  itemContainer: {backgroundColor: colors.white, marginTop: 7, paddingVertical: 15, paddingHorizontal: 10},
  flexContainer: {justifyContent: 'flex-start', flex: 1},
  flatList: {backgroundColor: colors.e5, flex: 1},
  headerPostImage: {width: 80, height: 80, borderRadius: 10, borderWidth: 1},
  descContainer: {flex: 1, marginHorizontal: moderateScale(10), justifyContent: 'center'},
});

export default styles;
