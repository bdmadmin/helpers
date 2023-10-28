import {
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import colors from "../../theme/colors";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { Pressable } from "react-native";
import imagePath from "../../config/imagePath";
import { Keyboard } from "react-native";
import { FILE_BASE_URL } from "../../config/constant";

type Props = {
  AnimIndex: any;
  setAnimIndex: any;
  flashRef: any;
  textMesssage:any;
  settextMesssage:any;
};

const MessageBox = (props: Props) => {
  const { AnimIndex, setAnimIndex, flashRef, textMesssage, settextMesssage } = props;
  const userData = useSelector((state: any) => state?.authUser.authUser);
  const [keyboard, setkeyboard] = useState({ isTrue: false, height: 0 });
  const keyHeight = useRef(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      keyHeight.current == e.endCoordinates.height;
      setkeyboard({ isTrue: true, height: e.endCoordinates.height });
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", (e) => {
        keyHeight.current == e.endCoordinates.height;
      setkeyboard({ isTrue: false, height: e.endCoordinates.height });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View
      style={[
        styles.inputContainer,
        {
        //   marginBottom: keyHeight.current,
          marginBottom: keyboard.isTrue ? keyboard.height : Platform.OS == "ios" ? 20 : 5,
        },
      ]}
    >
      <View
        style={[
          styles.replyContainer,
          {
            borderTopEndRadius: AnimIndex != null ? 10 : 30,
            borderTopStartRadius: AnimIndex != null ? 10 : 30,
          },
        ]}
      >
        {AnimIndex &&
          (AnimIndex?.massage != "" || AnimIndex.media?.length != 0) && (
            <View
              style={{
                flexDirection: "row",
                maxWidth: "100%",
                margin: 5,
                borderRadius: 7,
                overflow: "hidden",
                justifyContent: "space-between",
              }}
            >
              <Animated.View style={styles.replyAnim}>
                <Text
                  numberOfLines={2}
                  style={{
                    width: "95%",
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.themeColor,
                    marginBottom: 5,
                  }}
                >
                  {AnimIndex?.userName == userData.firstName
                    ? "You"
                    : AnimIndex?.userName}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <Text
                    numberOfLines={2}
                    style={{ width: "100%", fontSize: 13 }}
                  >
                    {Array.isArray(AnimIndex?.media) && (
                      <FastImage
                        source={imagePath.Gallery}
                        style={{
                          width: 15,
                          height: 15,
                          alignSelf: "center",
                        }}
                      />
                    )}
                    {Array.isArray(AnimIndex?.media)
                      ? " " + AnimIndex?.massage
                      : AnimIndex?.massage}
                  </Text>
                </View>
              </Animated.View>
              {Array.isArray(AnimIndex?.media) && (
                <View
                  style={{
                    width: "20%",
                    maxHeight: 75,
                  }}
                >
                  <FastImage
                    source={{
                      uri: FILE_BASE_URL + AnimIndex?.media[0]?.image,
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      // borderTopEndRadius: 7,
                      // borderBottomEndRadius: 7,
                    }}
                    resizeMode="cover"
                  />
                </View>
              )}
            </View>
          )}
        <Pressable
          style={styles.pressable}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setAnimIndex(null);
            console.log("Ankit");
          }}
        >
          <FastImage
            source={imagePath.crossBlack}
            style={{ width: 12, height: 12 }}
          />
        </Pressable>
        <TextInput
          autoFocus
          placeholder="Massage"
          multiline
          value={textMesssage}
          onChangeText={(val) => settextMesssage(val)}
          style={[
            styles.inputBox,
            {
              paddingBottom: Platform.OS == "ios" ? 14 : 10,
              paddingTop: Platform.OS == "ios" ? 14 : 10,
            },
          ]}
        />

        <TouchableWithoutFeedback
          onPress={() => {
            // ImagePic()
            // Keyboard.dismiss()
            // setshowAtach(true);
          }}
        >
          <FastImage source={imagePath.atechPinIcon} style={styles.atechIcon} />
        </TouchableWithoutFeedback>
      </View>

      <Pressable
        onPress={() =>
          flashRef.current.scrollToIndex({
            index: 0,
            animated: true,
          })
        }
        style={{
          position: "absolute",
          top: -50,
          right: 12,
          backgroundColor: "white",
          borderRadius: 100,
        }}
      >
        <Text style={{ color: "#000", fontSize: 16, padding: 10 }}>0</Text>
      </Pressable>

      <TouchableOpacity
        style={styles.sendContainer}
        onPress={() => {
          if (textMesssage.length != 0) {
            {
            //   room ? fireSend(null) : onSendRequest();
            }
            flashRef.current.scrollToIndex({
              index: 0,
              animated: false,
            });
          }
          if (AnimIndex?.massage?.length != 0) {
            setAnimIndex(null);
          }
        }}
      >
        <FastImage source={imagePath.senIcon} style={styles.sendIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default MessageBox;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginHorizontal: 5,
    marginTop: 5,
    justifyContent: "space-around",
  },
  replyContainer: {
    width: "85%",
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    backgroundColor: colors.white,
  },
  replyAnim: {
    padding: 7,
    borderLeftWidth: 4,
    borderColor: colors.themeColor,
    backgroundColor: "#F0F8FF",
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    flex: 1,
  },
  pressable: {
    position: "absolute",
    top: 7,
    right: 5,
    padding: 5,
    margin: 2,
    backgroundColor: colors.white,
    borderRadius: 100,
  },
  inputBox: {
    backgroundColor: colors.white,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 30,
    elevation: 2,
    fontSize: 17,
    width: "100%",
    minHeight: 22,
    maxHeight: 150,
    color: colors.black,
  },
  atechIcon: {
    width: 39,
    height: 39,
    color: colors.white,
    position: "absolute",
    right: 5,
    bottom: 5,
  },
  sendContainer: {
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    padding: 10,
    borderRadius: 100,
    elevation: 2,
  },
  sendIcon: {
    width: 25,
    height: 25,
    color: "#fff",
  },
});
