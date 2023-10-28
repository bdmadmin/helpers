import * as React from "react";
import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";
import BackButton from "../../components/BackButton";
import colors from "../../theme/colors";

interface WebviewScreenProps {}

const WebPermotion = (props: WebviewScreenProps) => {
  const { url, id } = props?.route?.params;

  return (
    <View style={styles.container}>
      <View style={[styles.backContainer]}>
        <TouchableOpacity onPress={()=>props.navigation.goBack()} style={styles.backButton}>
          <BackButton />
        </TouchableOpacity>
      </View>
      <WebView
        useWebView2
        allowFileAccess={true}
        allowsInlineMediaPlayback
        sharedCookiesEnabled={true}
        javaScriptEnabled
        mixedContentMode="compatibility"
        mediaPlaybackRequiresUserAction={false}
        allowUniversalAccessFromFileURLs
        allowFileAccessFromFileURLs
        originWhitelist={["*"]}
        mediaCapturePermissionGrantType="prompt"
        bounces={false} 
        showsHorizontalScrollIndicator={false}
        onLoad={(e) => {
          if (e.nativeEvent.canGoBack) {
            setTimeout(() => {
              props?.navigation.goBack();
            }, 2000);
          }
        }}
        source={{ uri: url + "?userId=" + id }}
      />
    </View>
  );
};

export default WebPermotion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backContainer: {
    backgroundColor: colors.white,
    height: Platform.OS === "ios" ? 80 : 30,
    justifyContent: "flex-end",
    paddingStart: 10,

  },
  backButton:{height:Platform.OS === "ios"?"50%":"100%",width:"20%",justifyContent:"center"}
});
