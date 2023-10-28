import {StyleSheet} from 'react-native';
import colors from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import {textScale} from '../theme/responsiveSize';

export const hitSlopProp = {
  top: 12,
  right: 12,
  left: 12,
  bottom: 12,
};
export default StyleSheet.create({
  fontSize10: {
    fontSize: textScale(10),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },

  fontSize12: {
    fontSize: textScale(12),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontSize13: {
    fontSize: textScale(13),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },

  fontSize13Italic: {
    fontSize: textScale(13),
    color: colors.black,
    fontFamily: fontFamily.italic,
  },

  fontSize15: {
    fontSize: textScale(15),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },

  fontSize15Medium: {
    fontSize: textScale(15),
    color: colors.black,
    fontFamily: fontFamily.medium,
  },

  fontSize14: {
    fontSize: textScale(14),
    color: colors.grey,
    fontFamily: fontFamily.regular,
  },

  fontSize14Black: {
    fontSize: textScale(15),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },

  fontSize15Blue: {
    fontSize: textScale(15),
    color: colors.blue_light,
    fontFamily: fontFamily.regular,
  },

  fontSize15BlueBold: {
    fontSize: textScale(15),
    color: colors.themeColor,
    fontFamily: fontFamily.bold,
  },

  fontSize16: {
    fontSize: textScale(16),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },

  fontBold28: {
    fontSize: textScale(28),
    color: colors.light_black,
    fontFamily: fontFamily.bold,
  },
  fontBold32: {
    fontSize: textScale(32),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontSize18: {
    fontSize: textScale(18),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontSize20: {
    fontSize: textScale(20),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontBold20: {
    fontSize: textScale(20),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontSize24: {
    fontSize: textScale(24),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontSize25: {
    fontSize: textScale(25),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontSize26: {
    fontSize: textScale(26),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontBold16: {
    fontSize: textScale(16),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontBold18: {
    fontSize: textScale(18),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontBold24: {
    fontSize: textScale(24),
    color: colors.light_black,
    fontFamily: fontFamily.bold,
  },
  fontBold36: {
    fontSize: textScale(36),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontBold38: {
    fontSize: textScale(38),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontSize35: {
    fontSize: textScale(35),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontSize38: {
    fontSize: textScale(38),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontBold21: {
    fontSize: textScale(21),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontSemiBold15: {
    fontSize: textScale(15),
    color: colors.black,
    fontFamily: fontFamily.semibold,
  },
  fontSemiBold16: {
    fontSize: textScale(16),
    color: colors.black,
    fontFamily: fontFamily.semibold,
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clip: {
    fontFamily: fontFamily.regular,
    marginEnd: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    overflow: 'hidden',
    color: colors.textColor,
    backgroundColor: colors.clipBg,
    fontSize: textScale(13),
  },
  flexGrowContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
    flex: 1,
  },
});
