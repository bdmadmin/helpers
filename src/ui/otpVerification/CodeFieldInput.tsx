/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import {Text, StyleSheet, Platform, ViewStyle, ViewProps} from 'react-native';
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from 'react-native-confirmation-code-field';
import {useState} from 'react';
import commonStyles from '../../utils/commonStyles';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {DataHandler} from './OtpVerification';

interface codeFiledInputProps {
  containerStyle?: ViewProps;
}

const CodeFiledInput = React.forwardRef<codeFiledInputProps, DataHandler>((props, handelRef) => {
  const {containerStyle} = props;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const [restProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  return (
    <>
      <CodeField
        ref={ref}
        {...restProps}
        value={value}
        onChangeText={x => {
          handelRef!!.current!!.getValue(x);
          setValue(x);
        }}
        cellCount={4}
        autoComplete="sms-otp"
        rootStyle={[styles.rootContainer, containerStyle]}
        textInputStyle={{...commonStyles.fontBold18}}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text style={[styles.inputContainer, isFocused && styles.focused, {height: 56}]} onLayout={getCellOnLayoutHandler(index)} key={index}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
    </>
  );
});
export default React.memo(CodeFiledInput);

const styles = StyleSheet.create({
  inputContainer: {
    width: 48,
    lineHeight: 38,
    borderWidth: 2,
    borderColor: colors.textInputBg,
    textAlign: 'center',
    ...commonStyles.fontSize15,
    textAlignVertical: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    ...commonStyles.fontBold28,
    fontFamily: fontFamily.regular,
  },

  focused: {
    borderColor: colors.themeColor,
    borderBottomWidth: 2,
  },
  rootContainer: {marginTop: moderateScaleVertical(35), marginEnd: moderateScale(60)},
});
