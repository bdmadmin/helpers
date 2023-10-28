import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import BackButton from '../../components/BackButton';
import colors from '../../theme/colors';

interface WebviewScreenProps {
  url: string;
}

const WebviewScreen = (props: WebviewScreenProps) => {
  const url = props?.route?.params?.url;
  return (
    <View style={styles.container}>
      <View style={{backgroundColor: colors.white, height: 80, justifyContent: 'center', paddingStart: 10}}>
        <BackButton />
      </View>
      <WebView allowFileAccess={true} source={{uri: url}} bounces={false} showsHorizontalScrollIndicator={false}/>
    </View>
  );
};

export default WebviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
