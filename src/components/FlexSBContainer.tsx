/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {ReactNode} from 'react';
import {Pressable, StyleProp, ViewStyle} from 'react-native';

const FlexSBContainer = ({children, containerStyle, ...any}: {children: ReactNode; containerStyle?: StyleProp<ViewStyle>}) => {
  return (
    <Pressable
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        containerStyle,
      ]}
      {...any}
    >
      {children}
    </Pressable>
  );
};

export default FlexSBContainer;
