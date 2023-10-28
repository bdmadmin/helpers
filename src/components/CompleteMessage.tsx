import { View, Text, StyleSheet, Alert } from "react-native";
import React, { memo, useEffect, useState } from "react";
import FlexSBContainer from "./FlexSBContainer";
import FastImage from "react-native-fast-image";
import { moderateScale } from "../theme/responsiveSize";
import colors from "../theme/colors";
import commonStyles from "../utils/commonStyles";
import fontFamily from "../theme/fontFamily";
import imagePath from "../config/imagePath";
import NavigationService from "../service/NavigationService";
import navigationString from "../config/navigationString";
import { useFocusEffect } from "@react-navigation/native";

const CompleteMessage = ({ item }: { item: any }) => {
  const [more, setmore] = useState(true);
  
  const navigationToOtherProfile = () => {
    item?.isAdmin !== 1 &&
      NavigationService.navigate(navigationString.OTHER_USER_PROFILE, {
        user: {user:item?.completedUser},
      });
  };

  return (
    <View>
        <FlexSBContainer
          onPress={navigationToOtherProfile}
          containerStyle={{
            marginTop: 10,
            padding: 10,
            borderTopWidth: 0.2,
            borderTopColor: "#aaa",
            justifyContent: "flex-start",
          }}
        >
          <FastImage
            style={styles.userImage}
            source={
              item?.completedUser?.profilePic
                ? {
                    uri: `${item?.completedUser?.baseUrl}${item?.completedUser?.profilePic}`,
                    cache: "immutable",
                    priority: FastImage.priority.high,
                  }
                : imagePath.placeholder
            }
          />
          <View style={styles.userDetailContainer}>
            <Text
              style={{
                ...commonStyles.fontSize13,
                color: colors.light_black,
                fontFamily: fontFamily.bold,
              }}
            >{`${item?.completedUser?.firstName} ${item?.completedUser?.lastName}`}</Text>
          </View>
        </FlexSBContainer>
        {item?.completePost?.message && (
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 27,
              marginTop: -10,
            }}
          >
            <View>
              <View
                style={{
                  backgroundColor: colors.black,
                  opacity: 0.7,
                  width: 1,
                  height: 25,
                }}
              />
              <View
                style={{
                  backgroundColor: colors.black,
                  opacity: 0.7,
                  width: 25,
                  height: 1,
                  marginTop: -0.1,
                }}
              />
            </View>
            <View style={styles.messageView}>
              <Text
                selectable
                style={styles.completePostMessage}
                onPress={() =>
                  item?.completePost?.message?.length > 100 && setmore(!more)
                }
              >
                {item?.completePost?.message
                  ?.split("")
                  .splice(0, more ? 100 : 8000)}
                <Text style={{ color: colors.blue_light }}>
                  {item?.completePost?.message?.length > 100
                    ? more && "... See more"
                    : ""}
                </Text>
              </Text>
            </View>
          </View>
        )}
    </View>
  );
};

export default memo(CompleteMessage);

const styles = StyleSheet.create({
  userImage: { width: 40, height: 40, borderRadius: 10, borderWidth: 1 },
  userDetailContainer: { marginStart: moderateScale(10) },
  messageView: {
    flex: 1,
    borderRadius: 7,
    marginTop: 10,
    overflow: "hidden",
    backgroundColor: colors.offWhite,
    shadowColor: "black",
    shadowOpacity: 0.36,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
  },
  completePostMessage: {
    ...commonStyles.fontSize12,
    color: colors.black,
    fontFamily: fontFamily.regular,
    padding: 5,
    fontWeight: "600",
  },
});
