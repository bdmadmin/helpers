import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import {moderateScaleVertical} from '../../theme/responsiveSize';

const styles = StyleSheet.create({
  notificationItemContainer: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: moderateScaleVertical(5),
  },
  userImage: {width: 60, height: 60, borderRadius: 10},
  notificationTextContainer: {padding: 20, backgroundColor: colors.white},
});

export default styles;
