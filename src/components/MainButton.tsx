import * as React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';
import colors from '../theme/colors';
import commonStyles from '../utils/commonStyles';

interface MainButtonProps {
  btnText: string;
  btnStyle?: ViewStyle;
  onPress: () => void;
}

const MainButton = (props: MainButtonProps) => {
  const {btnText, btnStyle, onPress, ...rest} = props;
  return (
    <Button onPress={onPress} labelStyle={styles.labelStyle} mode="contained" style={[styles.container, btnStyle]} {...rest}>
      {btnText}
    </Button>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.themeColor,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
  },
  labelStyle: {...commonStyles.fontBold18, color: colors.white, textAlignVertical: 'center',padding:5},
});
