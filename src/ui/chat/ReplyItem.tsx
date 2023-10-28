import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import colors from "../../theme/colors";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import { FILE_BASE_URL } from "../../config/constant";
import imagePath from "../../config/imagePath";

type Props = {
  item: any;
  scrollToIndexRef: any;
};

const ReplyItem = (props: Props) => {
  const { item, scrollToIndexRef } = props;

  const userData = useSelector((state: any) => state?.authUser.authUser);

  return (
    <Pressable
      style={styles.replyContainer}
      onPress={() => scrollToIndexRef.current(item.replyText.id)}
    >
      <View style={styles.replyTextContainer}>
        <Text numberOfLines={2} style={styles.replyUserText}>
          {item?.replyText?.userId == userData?.id ? "You" : item?.userName}
        </Text>
        <View>
          <Text
            numberOfLines={2}
            style={{ width: "100%", fontSize: 14, fontWeight: "600" }}
          >
            {Array.isArray(item?.replyText?.media) && (
              <FastImage
                source={imagePath.Gallery}
                style={{
                  width: 15,
                  height: 15,
                  alignSelf: "center",
                }}
              />
            )}
            {Array.isArray(item?.replyText?.media)
              ? " " + item?.replyText?.massage
              : item?.replyText?.massage}
          </Text>
        </View>
      </View>
      {Array.isArray(item?.replyText?.media) && (
        <View style={styles.replyImageView}>
          <FastImage
            source={{ uri: FILE_BASE_URL + item?.replyText?.media[0]?.image }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="cover"
          />
        </View>
      )}
    </Pressable>
  );
};

export default memo(ReplyItem);

const styles = StyleSheet.create({
  replyContainer: {
    flexDirection: "row",
    maxWidth: "100%",
    overflow: "hidden",
    margin: 5,
    borderRadius: 5,
    backgroundColor: colors.lineGrey,
    justifyContent: "space-between",
  },
  replyTextContainer: {
    padding: 5,
    borderLeftWidth: 4,
    borderRadius: 5,
    borderColor: colors.themeColor,
    maxWidth: "100%",
  },
  replyUserText: {
    width: "100%",
    fontSize: 15,
    fontWeight: "600",
    color: colors.themeColor,
    marginBottom: 5,
  },
  replyImageView: {
    width: "17%",
    maxHeight: 60,
    alignSelf: "flex-end",
    borderTopEndRadius: 7,
    borderBottomEndRadius: 7,
  },
});
