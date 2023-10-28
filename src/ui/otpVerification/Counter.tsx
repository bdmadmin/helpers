/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import {Text} from 'react-native';
import {useState} from 'react';
import commonStyles from '../../utils/commonStyles';
import {moderateScaleVertical} from '../../theme/responsiveSize';
import BackgroundTimer from 'react-native-background-timer';
interface codeFiledInputProps {}

const Counter = React.forwardRef<codeFiledInputProps, any>((props, ref) => {
  const [timer, setTimer] = useState(30);

  React.useEffect(() => {
    if (props?.start) {
      setTimer(30);
    }
  }, [props]);

  React.useEffect(() => {
    BackgroundTimer.runBackgroundTimer(() => {
      if (timer !== 0) {
        setTimer(state => state - 1);
      }
      if (timer === 0) {
        ref.current?.timeStop();
      }
    }, 1000);

    return () => {
      BackgroundTimer?.stopBackgroundTimer();
    };
  }, [timer]);

  return (
    <>
      <Text style={{...commonStyles.fontSize15, marginTop: moderateScaleVertical(20)}}>{`00:${timer < 10 ? '0' : ''}${timer.toString()}`}</Text>
    </>
  );
});

export default Counter;
