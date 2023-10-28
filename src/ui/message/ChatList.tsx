/* eslint-disable react-native/no-inline-styles */
import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  DeviceEventEmitter,
  Alert,
} from "react-native";
import FastImage from "react-native-fast-image";
import { RefreshControl } from "react-native-gesture-handler";
import FlexSBContainer from "../../components/FlexSBContainer";
import imagePath from "../../config/imagePath";
import {
  chatReceiverPostNotCreatedApi,
  chatRequestApi,
} from "../../redux/actions/home";
import colors from "../../theme/colors";
import fontFamily from "../../theme/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../theme/responsiveSize";
import commonStyles from "../../utils/commonStyles";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import navigationString from "../../config/navigationString";
import MessageShimmer from "./MessageShimmer";
import { FILE_BASE_URL } from "../../config/constant";
import { showError } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { messageTabCount } from "../../redux/reducer/DotSlice/dotSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

interface ChatListProps {}

const ChatList = (_: ChatListProps) => {
  const [chatRequestListing, setChatRequestListing] = React.useState<
    Array<unknown>
  >([]);
  const [chatReceiverPostListing, setChatReceiverPostListing] = React.useState<
    Array<unknown>
  >([]);
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const [refreshLoader, setRefreshLoader] = React.useState<boolean>(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const wait = React.useCallback(async () => {
    try {
      setRefreshLoader(true);
      await apiCall();
      setRefreshLoader(false);
    } catch (error) {}
  }, []);

  React.useEffect(() => {
    getListing();
  }, []);

  const onRefresh = React.useCallback(() => {
    wait();
  }, [wait]);

  React.useEffect(() => {
    const emitter = DeviceEventEmitter.addListener("refresh", () => {
      onRefresh();
    });
    return () => {
      emitter.remove();
    };
  }, [onRefresh]);

  React.useEffect(() => {
    navigation.addListener("focus", () => {
      onRefresh();
    });
    return () => {
      navigation.removeListener("focus", () => {
        onRefresh();
      });
    };
  }, []);

  const getListing = async () => {
    try {
      setLoading(true);
      await apiCall();
      setLoading(false);
    } catch (error) {}
  };

  const apiCall = async () => {
    try {
      const [chatRequestData, chatReceiverPostData] = await Promise.all([
        chatRequestApi(),
        chatReceiverPostNotCreatedApi(),
      ]);
      setChatRequestListing(chatRequestData?.listing);
      setChatReceiverPostListing(chatReceiverPostData?.listing);
      const isAnyPending = chatRequestData?.listing?.some((item: any) =>
        item?.request?.some((isReded: any) => isReded?.isRead === 0)
      );
      const isAnyPendingOther = chatReceiverPostData?.listing?.some(
        (isReded: any) => isReded?.isRead === 0
      );
      dispatch(
        messageTabCount({ messageTabCount: isAnyPending || isAnyPendingOther })
      );
      await AsyncStorage.setItem(
        "messageCount",
        isAnyPending || isAnyPendingOther ? "true" : ""
      );
    } catch (error) {
      showError((error as Error).message);
    }
  };

  const navigateToChat = (item: any, isPost: string) => {
    if (item?.room) {
      navigation.navigate(navigationString.CHAT, {
        item: {
          ...item,
          user: { ...item?.receiver },
          description: item?.post_info?.description,
          feed_medias: item?.post_info?.feed_medias,
          status: 1,
        },
      });
    } else {
      navigation.navigate(navigationString.HELP_OR_DONAR, { item, isPost });
    }
  };

  if (isLoading) {
    return <MessageShimmer />;
  }

  const renderChatList = ({ item }: any) => {
    const isRequest = item?.request?.length > 0;
    const pic1 = isRequest
      ? item?.request[0]?.sender?.profilePic
        ? { uri: FILE_BASE_URL + item?.request[0]?.sender?.profilePic }
        : imagePath.placeholder
      : "";
    const pic2 =
      item?.request?.length > 1
        ? item?.request[1]?.sender?.profilePic
          ? { uri: FILE_BASE_URL + item?.request[1]?.sender?.profilePic }
          : imagePath.placeholder
        : "";
    const pic3 =
      item?.request?.length > 2
        ? item?.request[0]?.sender?.profilePic
          ? { uri: FILE_BASE_URL + item?.request[0]?.sender?.profilePic }
          : imagePath.placeholder
        : "";
    const media = item?.type ? item?.feed_medias[0] : "";
    let isPost: any;
    if (media) {
      if (media.mediaType === "audios") {
        isPost = imagePath.app_icon;
      } else if (media?.mediaType === "image" || media?.mediaType === "video") {
        isPost = { uri: FILE_BASE_URL + media?.name };
      }
    } else {
      if (media === undefined) {
        isPost = imagePath.app_icon;
      }
    }
    const isRead = item?.request
      ? item?.request?.every((isReded: any) => isReded?.isRead === 1)
      : item?.isRead === 1;

    return (
      <TouchableOpacity
        key={item?.id}
        style={{ backgroundColor: colors.white, marginTop: 6, padding: 12 }}
      >
        <FlexSBContainer
          onPress={() => navigateToChat(item, isPost)}
          containerStyle={{ justifyContent: "flex-start" }}
        >
          {isPost ? (
            <FastImage style={styles.messageImage} source={isPost} />
          ) : (
            <FastImage
              style={styles.messageImage}
              source={
                item?.receiver?.profilePic
                  ? { uri: FILE_BASE_URL + item?.receiver?.profilePic }
                  : imagePath.placeholder
              }
            />
          )}
          <View style={{ marginStart: moderateScale(10), flex: 1 }}>
            <Text numberOfLines={2} style={{ ...styles.description }}>
              {isRequest
                ? item?.description
                : item?.receiver?.firstName + " " + item?.receiver?.lastName}
            </Text>
            {isRequest ? (
              <View style={styles.flexRowContainer}>
                {pic1 && (
                  <FastImage
                    style={{ ...styles.matches, zIndex: 1 }}
                    source={pic1}
                  />
                )}
                {pic2 && (
                  <FastImage
                    style={{
                      ...styles.matches,
                      position: "absolute",
                      marginStart: 15,
                      zIndex: 2,
                    }}
                    source={pic2}
                  />
                )}
                {pic3 && (
                  <FastImage
                    style={{ ...styles.matches, zIndex: 3, marginStart: 5 }}
                    source={pic3}
                  />
                )}
                {item?.request.length > 3 && (
                  <Text style={styles.otherMatches}>{`+ ${
                    item?.request?.length - 3
                  }`}</Text>
                )}
              </View>
            ) : (
              <View>
                <Text
                  numberOfLines={1}
                  style={{ ...commonStyles.fontSize12, color: colors.black }}
                >
                  {item?.post_info?.description}{" "}
                </Text>
                <Text
                  style={{ ...commonStyles.fontSize12, color: colors.grey_95 }}
                >
                  {dayjs().to(item?.createdAt)}{" "}
                </Text>
              </View>
            )}
          </View>
          <View style={{}}>
            {isRead === false && <View style={styles.dot} />}
            {isRequest ? (
              <View style={{ alignItems: "flex-end" }}>
                <Image source={imagePath.fi_chevron_right} />
                <Text
                  style={{ ...commonStyles.fontSize12, color: colors.grey_95 }}
                >
                  {dayjs().to(item?.createdAt)}
                </Text>
              </View>
            ) : (
              <Image source={imagePath.fi_chevron_right} />
            )}
          </View>
        </FlexSBContainer>
      </TouchableOpacity>
    );
  };

  const listFooterComponent = () => {
    return (
      <FlatList
        data={chatReceiverPostListing}
        renderItem={renderChatList}
        keyExtractor={(_, index) => index.toString()}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRequestListing}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshLoader} />
        }
        renderItem={renderChatList}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={listFooterComponent}
        initialNumToRender={4}
      />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.e5,
  },
  greenContainer: {
    backgroundColor: colors.green,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
  },
  receivedMessage: {
    ...commonStyles.fontSize12,
    color: colors.black,
    alignSelf: "center",
    marginStart: moderateScale(10),
  },
  countContainer: {
    backgroundColor: "#D7FFF8",
    justifyContent: "flex-start",
    width: 160,
    borderRadius: 20,
    padding: 4,
    marginBottom: moderateScaleVertical(10),
  },
  messageImage: { width: 50, height: 50, borderRadius: 10, borderWidth: 1 },
  matches: {
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.white,
  },
  otherMatches: {
    ...commonStyles.fontSize13,
    fontFamily: fontFamily.medium,
    marginStart: 10,
  },
  messageCount: {
    ...commonStyles.fontSize10,
    color: colors.white,
    alignSelf: "center",
    textAlignVertical: "center",
  },
  description: {
    ...commonStyles.fontSize13,
    marginEnd: 100,
    marginBottom: moderateScaleVertical(4),
  },
  flexRowContainer: { flexDirection: "row", alignItems: "center" },
  arrow: { position: "absolute", end: 0 },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: colors.error,
    borderRadius: 15,
    alignSelf: "center",
    marginStart: 18,
    marginBottom: 10,
  },
});
