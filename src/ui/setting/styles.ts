import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import {moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

const styles = StyleSheet.create({
  settingText: {...commonStyles.fontBold24, marginTop: moderateScaleVertical(40)},
});

export default styles;
