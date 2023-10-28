import { View, Text, Pressable } from "react-native";
import React, { memo, useState } from "react";
import FastImage from "react-native-fast-image";
import imagePath from "../../config/imagePath";
import colors from "../../theme/colors";
import WebView from "react-native-webview";

const ChatBot = () => {
  const [chatBoxShow, setchatBoxShow] = useState(false);
  return (
    <View>
      {chatBoxShow && (
        <View
        accessibilityViewIsModal={false}
          style={{
            backgroundColor: colors.themeColor,
            height: 400,
            width: "80%",
            position: "absolute",
            bottom: 90,
            right: 15,
            borderRadius: 10,
          }}
        >
          <WebView
            allowFileAccess={true}
            source={{ uri: "https://tawk.to/chat/5ca0b80d6bba4605280089c0/default" }}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            style={{borderRadius: 10,}}
          />
        </View>
      )}
      <Pressable
        onPress={() => setchatBoxShow(!chatBoxShow)}
        style={{
          backgroundColor: "rgb(0,159,75)",
          height: 55,
          width: 55,
          position: "absolute",
          bottom: 15,
          right: 15,
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FastImage
          source={chatBoxShow ? imagePath.closex : imagePath?.app_icon}
          style={{
            width: chatBoxShow ? "80%" : "100%",
            height: chatBoxShow ? "80%" : "100%",
          }}
        />
      </Pressable>
    </View>
  );
};

export default memo(ChatBot);
