import * as React from 'react';
import {StyleProp, TextInput, TextStyle, TextInputProps} from 'react-native';
import colors from '../theme/colors';
import commonStyles from '../utils/commonStyles';
// import AnimatedInput from 'react-native-animated-input';
interface componentNameProps {
  textInputStyle?: StyleProp<TextStyle>;
  placeHolderString: string;
  onChangeText?: (text: string) => void;
}

type Props = componentNameProps & TextInputProps;

const TextInputCustom = (props: Props) => {
  const {textInputStyle, placeHolderString, onChangeText, ...rest} = props;
  return <TextInput placeholderTextColor={colors.grey} placeholder={placeHolderString} onChangeText={onChangeText} style={[{...commonStyles.fontSize16, borderBottomWidth: 0.7}, textInputStyle]} {...rest} />;
};

export default TextInputCustom;
