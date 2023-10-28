import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import navigationString from '../../config/navigationString';

interface Props {}

const GuestLogin = (props: Props) => {
  React.useEffect(() => {
    props?.navigation.navigate(navigationString.LOGIN_GUEST);
  }, [props]);

  return <></>;
};

export default GuestLogin;

const styles = StyleSheet.create({
  container: {},
});
