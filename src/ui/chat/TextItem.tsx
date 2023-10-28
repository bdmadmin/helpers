import {
  Alert,
  Animated,
  Easing,
  Keyboard,
  LayoutAnimation,
  Linking,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import React, { memo, useState } from "react";
import moment from "moment";
import FastImage from "react-native-fast-image";
import colors from "../../theme/colors";
import { useSelector } from "react-redux";
import imagePath from "../../config/imagePath";
import { height } from "../../theme/responsiveSize";

type Props = {
  item: any;
};

const TextItem = (props: Props) => {
  const { item } = props;

  const userData = useSelector((state: any) => state?.authUser.authUser);
  const [readMore, setreadMore] = useState(false);
  const animationHeight = React.useRef(new Animated.Value(2)).current;

  const textPress = () => {
    Keyboard.dismiss();
    let hypLink = item?.massage.split(":")[0];
    if (item.massage && (hypLink == "https" || hypLink == "http")) {
      Linking.openURL(item?.massage);
    }
  };
  const ReadMoreFun = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setreadMore(!readMore);
  };
  if (item.massage) {
    console.log("message new =>",item.message)
    return (
      <View>
        <View style={styles.mainView}>
          <View style={{ overflow: "hidden" }}>
            {item?.massage && (
              <Text style={styles.message} onLongPress={()=>{console.log("messages =>",item.message)}} onPress={textPress}>
                {item?.massage?.length > 599
                  ? item?.massage
                      .split("")
                      .splice(0, !readMore ? 600 : 8000)
                      .join("")
                  : item?.massage + "                   "}
                {item?.massage?.length > 599 && (
                  <Text style={styles.readMore} onPress={ReadMoreFun}>
                    {readMore ? " Read less" : " ...Read more"}
                  </Text>
                )}
              </Text>
            )}
          </View>
          <View style={styles.timeTextView}>
            <Text
              style={[
                styles.time,
                {
                  paddingRight: item?.userId == userData?.id ? 8 : 10,
                  padding: 1,
                },
              ]}
            >
              {moment(item?.sendTime).format("LT")}
            </Text>
            {/* {item?.userId == userData?.id ? (
            <FastImage
              source={imagePath.doubleTick}
              style={styles.doubleTikBlueImage}
            />
          ) : null} */}
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{ justifyContent: "flex-end", flexDirection: "row", padding: 2 }}
      >
        <Text
          style={[
            styles.time,
            { paddingRight: item?.userId == userData?.id ? 8 : 10, padding: 1 },
          ]}
        >
          {moment(item?.sendTime).format("LT")}
        </Text>
      </View>
    );
  }
};

export default memo(TextItem);

const styles = StyleSheet.create({
  mainView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
   
  },
  message: {
    padding: 13,
    fontSize: 15,
    color: colors.black,
    opacity: 0.9,
    // fontWeight: "700",
    borderRadius: 10,
    maxWidth: "100%",
  },
  timeTextView: {
    flexDirection: "row",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    position: "absolute",
    bottom: 0,
    right: 0,
    // backgroundColor:'red'
  },
  time: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.blackWithOpacityFive,
  },
  doubleTikBlueImage: {
    width: 18,
    height: 18,
    // backgroundColor: colors.black,
    marginHorizontal: 4,
    alignSelf: "center",
  },
  readMore: {
    color: colors.themeColor,
  },
});
