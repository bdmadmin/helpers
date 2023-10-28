import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {splashLogo} from '../../redux/actions/auth';
import commonStyles from '../../utils/commonStyles';

interface SplashProps {}

const Splash = (props: SplashProps) => {
  const [data, setData] = React.useState();
  React.useEffect(() => {
    getIcon();
  }, []);

  const getIcon = async () => {
    const a = await splashLogo();
    setData(a);
  };

  return (
    <View style={styles.container}>
      <FastImage style={{width: 100, height: 100}} source={{uri: data?.logo, cache: 'cacheOnly', priority: 'high'}} />
      <Text style={{...commonStyles.fontBold16}}>{data?.description}</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
