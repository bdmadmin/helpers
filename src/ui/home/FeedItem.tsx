import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import FlexSBContainer from "../../components/FlexSBContainer";
import imagePath from "../../config/imagePath";
import navigationString from "../../config/navigationString";
import colors from "../../theme/colors";
import fontFamily from "../../theme/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from "../../theme/responsiveSize";
import commonStyles from "../../utils/commonStyles";
import ButtonAndLikeContainer from "./ButtonAndLikeContainer";
import FeedMenu from "./FeedMenu";
import MultiImageSlider from "./MultiImageSlider";
import NavigationService from "../../service/NavigationService";
import { useSelector } from "react-redux";
import SuggestedProfile from "../../components/SuggestedProfile";
dayjs.extend(relativeTime);
interface FeedItemProps {
  item: any;
  index: number;
}

const FeedItem = React.forwardRef<any, FeedItemProps>((props, homeFunRef) => {
  const { item, index } = props;

  const navigationToOtherProfile = () => {
    item?.isAdmin !== 1 &&
      NavigationService.navigate(navigationString.OTHER_USER_PROFILE, {
        user: item,
      });
  };
  const [textShown, setTextShown] = React.useState(true);
  // const [lengthMore, setLengthMore] = React.useState(false);
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  // const onTextLayout = React.useCallback((e) => {
  //   setLengthMore(e.nativeEvent.lines.length >= 4);
  // }, []);

  return (
    <>
      <View>
        <View style={styles.container}>
          <FlexSBContainer>
            <FlexSBContainer onPress={navigationToOtherProfile}>
              <FastImage
                style={styles.userImage}
                source={
                  item?.user?.profilePic
                    ? {
                        uri: `${item?.user?.baseUrl}${item?.user?.profilePic}`,
                        cache: "immutable",
                        priority: FastImage.priority.high,
                      }
                    : imagePath.placeholder
                }
              />
              <View style={styles.userDetailContainer}>
                <Text
                  style={{
                    ...commonStyles.fontSize14,
                    color: colors.light_black,
                    fontFamily: fontFamily.bold,
                  }}
                >{`${item?.user?.firstName} ${item?.user?.lastName}`}</Text>

                {
                  <Text
                    style={{
                      ...commonStyles.fontSize10,
                      color: colors.grey_95,
                      marginTop:-2,
                      fontWeight:"700"
                    }}
                  >
                    {item?.isAdmin !== 1
                      ? dayjs()?.to(item?.updatedAt)
                      : "Humans Community"}
                  </Text>
                }
              </View>
            </FlexSBContainer>
            {item?.isAdmin !== 1 && <FeedMenu ref={homeFunRef} item={item} />}
          </FlexSBContainer>
        </View>
        {item?.description !== "undefined" && (
          <>
            <Text
              onPress={toggleNumberOfLines}
              // onTextLayout={onTextLayout}
              // numberOfLines={textShown ? undefined : 4}
              style={{
                ...commonStyles.fontSize14,
                marginStart: moderateScale(12),
                paddingVertical: moderateScaleVertical(5),
                fontWeight:"600",
                fontFamily:"PlusJakartaSans-light",
                color:"#000"
              }}
            >
              {item?.description?.split("").splice(0, textShown ? 150 : 8000) ??
                ""}
              {item?.description?.length > 150 ? (
                <Text
                  numberOfLines={1}
                  onPress={toggleNumberOfLines}
                  style={{
                    // lineHeight: 21,
                    // marginTop: 10,
                    // color: colors.blue_light,
                    // paddingLeft: moderateScaleVertical(12),
                    ...commonStyles.fontSize14,
                    fontFamily:"PlusJakartaSans-light",
                  }}
                >
                  {!textShown ? "   Read Less" : "... Read more"}
                </Text>
              ) : null}
            </Text>
          </>
        )}
        {item?.feed_medias?.length > 0 && (
          <MultiImageSlider data={item?.feed_medias} outerIndex={index} />
        )}
        {!item?.hideBottom && (
          <ButtonAndLikeContainer item={item} index={index} />
        )}
      </View>
    </>
  );
});

export default FeedItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  userImage: { width: 40, height: 40, borderRadius: 10, borderWidth: 1 },
  userDetailContainer: { marginStart: moderateScale(10) },
});
