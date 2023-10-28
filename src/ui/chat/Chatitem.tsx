import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { memo, useEffect, useState } from "react";
import colors from "../../theme/colors";
import FastImage from "react-native-fast-image";
import imagePath from "../../config/imagePath";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { height, width } from "../../theme/responsiveSize";
import { useSelector } from "react-redux";
import moment from "moment";
import TextItem from "./TextItem";
import { LayoutAnimation } from "react-native";
import ImageItem from "./ImageItem";
import ReplyItem from "./ReplyItem";
import Sliders from "../../components/Sliders";

type props = {
  item: any;
  AnimIndex: any;
  scrollToIndexRef: any;
};

const ChatItem = ({ item, AnimIndex, scrollToIndexRef }: props) => {
  // console.log("item=---=-=-=-=-=-=-=",item)
  const animation = useSharedValue(0);
  const userData = useSelector((state: any) => state?.authUser.authUser);
  const canRply = useSharedValue(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animation.value }],
    };
  });

  const replyText = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    AnimIndex(item);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx: any) => {
      // runOnJS(checkCanReply)();
      ctx.startX = animation.value;
    },
    onActive: (event, ctx) => {
      if (
        canRply.value &&
        event.translationX > 0 &&
        ctx.startX + event.translationX <= 100
      ) {
        animation.value = ctx.startX + event.translationX;
      }
    },

    onEnd: (event, ctx) => {
      if (animation.value < 60) {
        animation.value = withTiming(0);
      }
      if (animation.value >= 60) {
        animation.value = withTiming(0);
        runOnJS(replyText)();
      }
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} activeOffsetX={[-5, 5]}>
      <Animated.View
        style={[
          {
            borderRadius: 15,
            alignItems:
              item?.userId == userData?.id ? "flex-end" : "flex-start",
            flexDirection: "row",
            marginVertical: item?.userId == userData?.id ? 2 : 5,
          },
          animatedStyle,
        ]}
      >
        <View style={styles.mainView}>
          <FastImage source={imagePath.replyicon} style={styles.replyIcon} />
        </View>
        <Pressable
       
          style={{
            ...styles.subView,
            // backgroundColor:"#000",
            alignItems:
              item?.userId == userData?.id ? "flex-end" : "flex-start",
          }}
        >
          <View
            style={{
              ...styles.contentView,
              // opacity:0.5,
              backgroundColor:
                item?.userId == userData?.id ? "#bdcfff" : colors.white, //"#F0F8FF"
            }}
          >
            {item?.replyText != null && (
              <ReplyItem item={item} scrollToIndexRef={scrollToIndexRef} />
            )}
            {Array.isArray(item?.media) && item?.media[0]?.image && (
              <ImageItem media={item?.media} />
            )}
            {Array.isArray(item?.media) && item?.media[0]?.audio && (
              <View
                style={{
                  height: 35,
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                }}
              >
                <Sliders url={item?.media[0]?.audio} chat={true} />
              </View>
            )}
            {<TextItem item={item} />}
          </View>
        </Pressable>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default memo(ChatItem);

const styles = StyleSheet.create({
  mainView: {
    marginLeft: -100,
    paddingHorizontal: 30,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  replyIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 4,
  },
  subView: {
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 10,
   
  },
  contentView: {
    backgroundColor: colors.white,
    borderRadius: 8,
    maxWidth: "85%",
  
  },
});
