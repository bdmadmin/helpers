import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {StatusBar} from 'react-native';

interface FocusAwareStatusBarProps {}

function FocusAwareStatusBar(props: FocusAwareStatusBarProps) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar translucent backgroundColor="transparent" {...props} /> : null;
}

export default FocusAwareStatusBar;
