// import {useNavigation} from '@react-navigation/native';
import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import FlexSBContainer from "../../components/FlexSBContainer";
import imagePath from "../../config/imagePath";
import navigationString from "../../config/navigationString";
import { feedDislike, feedLike } from "../../redux/actions/home";
import { setModalVisibility } from "../../redux/reducer/MarkAsSold/markAsSoldSlice";
import { openMobileAlert } from "../../redux/reducer/MobileNumberSlice/mobileNumberSlice";
import colors from "../../theme/colors";
import fontFamily from "../../theme/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../theme/responsiveSize";
import commonStyles from "../../utils/commonStyles";
import { showError } from "../../utils/utils";
import NavigationService from "../../service/NavigationService";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { authSliceSelector } from "../../redux/reducer/AuthSlice/authSlice";
import { Share } from "react-native";
import SuggestedProfile from "../../components/SuggestedProfile";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { setseemessage } from "../../redux/reducer/AudioVideoList/audioVideoList";
import CompleteMessage from "../../components/CompleteMessage";

interface ButtonAndLikeContainerProps {
  item: any;
  index:number;
}
interface ButtonText {
  1: string;
  2: string;
  3: string;
}

const buttonText: ButtonText = {
  1: "Help",
  2: "i'm here",
  3: "Completed",
};

const ButtonAndLikeContainer = (props: ButtonAndLikeContainerProps) => {
  const { item, index } = props;
  // console.log("item==",item)
  // const navigation = useNavigation();
  const [likeDislikeCount, setLikeDislikeCount] = React.useState({
    likeCount: item?.likeCount ?? 0,
    dislikeCount: item?.dislikeCount ?? 0,
  });
  const [isLikedPost, setIsLikedPost] = React.useState(item?.likestatus);
  const [isDisLikePost, setDisLikePost] = React.useState(item?.dislikestatus);
  const userData = useAppSelector(authSliceSelector);
  const myId = item?.user?.id === userData?.id;
  const isCompleted = item?.status ? "Completed" : "Mark as complete";
  const dispatch = useAppDispatch();
  const Join = item?.isAdmin === 1 && item?.isJoin === 0 && item?.url;

  React.useEffect(() => {
    setLikeDislikeCount({
      likeCount: item?.likeCount ?? 0,
      dislikeCount: item?.dislikeCount ?? 0,
    });
    setIsLikedPost(item?.likestatus);
    setDisLikePost(item?.dislikestatus);
  }, [item]);

  const sugProfile = useSelector(
    (state: any) => state.audioVideoList.sugProfile
  );
 

  const openMarkAsComplete = () => {
    !item?.default &&
      dispatch(setModalVisibility({ postId: item?.id, isModalVisible: true }));
  };

  const onPressHelp = () => {
    if (item?.isAdmin === 1 && item?.isJoin !== 0) {
      return;
    }

    if (item?.isAdmin === 1) {
      NavigationService.navigate(navigationString.WEBVIEW_PERMOTION, {
        url: item?.url,
        id: userData?.id,
      });
      return;
    }

    if (myId) {
      isCompleted !== "Completed" && openMarkAsComplete();
      return;
    }
    if (item?.status === 1) {
      return;
    }

    if (userData?.guest) {
      NavigationService.navigate(navigationString.MESSAGE);
      return;
    }

    if (!userData?.mobile || userData?.isMobileVerify === 0) {
      dispatch(openMobileAlert({ isOpen: true }));
      return;
    }
    NavigationService.navigate(navigationString.CHAT, {
      item: { ...item, postId: item?.id },
    });
  };

  const updateState = (data: unknown) =>
    setLikeDislikeCount({ ...likeDislikeCount, ...data });

  const likePost = async () => {
    if (userData?.guest) {
      return;
    }
    if (!userData?.mobile || userData?.isMobileVerify === 0) {
      dispatch(openMobileAlert({ isOpen: true }));
      return;
    }
    try {
      if (isLikedPost) {
        updateState({ likeCount: likeDislikeCount.likeCount - 1 });
        setIsLikedPost(false);
      } else {
        if (isDisLikePost) {
          updateState({
            likeCount: likeDislikeCount.likeCount + 1,
            dislikeCount: likeDislikeCount.dislikeCount - 1,
          });
        } else {
          updateState({ likeCount: likeDislikeCount.likeCount + 1 });
        }
        setIsLikedPost(true);
      }
      setDisLikePost(false);
      await feedLike({ id: item?.id?.toString() });
    } catch (error) {
      showError((error as Error).message);
    }
  };

  const dislikePost = async () => {
    if (userData?.guest) {
      return;
    }
    try {
      if (isDisLikePost) {
        updateState({ dislikeCount: likeDislikeCount.dislikeCount - 1 });
        setDisLikePost(false);
      } else {
        if (isLikedPost) {
          updateState({
            dislikeCount: likeDislikeCount.dislikeCount + 1,
            likeCount: likeDislikeCount.likeCount - 1,
          });
        } else {
          updateState({ dislikeCount: likeDislikeCount.dislikeCount + 1 });
        }
        setDisLikePost(true);
      }
      setIsLikedPost(false);
      await feedDislike({ id: item?.id?.toString() });
    } catch (error) {
      showError((error as Error).message);
    }
  };



  const navigationToOtherProfile = () => {
    item?.isAdmin !== 1 &&
      NavigationService.navigate(navigationString.OTHER_USER_PROFILE, {
        user: item,
      });
  };
  if (item?.isAdmin === 1 && !item?.url) {
    return;
  }
  
  const share = async () => {
    await Share.share({
      message: "https://helpersfamily.com/downloadLink",
    });
  };
  // console.log("item?.type", item?.type);
  if (item.uri!="") {
    
  }
  return (
    <View style={styles.container}>
      <FlexSBContainer
        containerStyle={{ marginTop: moderateScaleVertical(16) }}
      >
        <TouchableOpacity onPress={onPressHelp} style={[styles.button]}>
          <Text
            onPress={onPressHelp}
            style={{
              ...commonStyles.fontSize12,
              fontFamily: fontFamily.bold,
              color: colors.white,
            }}
          >
            {myId
              ? isCompleted
              : item?.status === 1
              ? "Completed"
              : buttonText[item?.type]
              ? buttonText[item?.type]
              : Join
              ? "Join"
              : "Joined"}
          </Text>
        </TouchableOpacity>

        {item?.isAdmin !== 1 && (
          <FlexSBContainer>
            <Pressable onPress={likePost}>
              <Image
                style={{
                  tintColor: isLikedPost ? colors.themeColor : colors.grey,
                }}
                source={imagePath.ic_like}
              />
            </Pressable>
            <Text
              style={{
                ...commonStyles.fontSize14,
                marginHorizontal: moderateScale(10),
              }}
            >
              {likeDislikeCount?.likeCount}
            </Text>
            <Pressable onPress={dislikePost}>
              <Image
                style={{
                  tintColor: isDisLikePost ? colors.error : colors.grey,
                }}
                source={imagePath.Union}
              />
            </Pressable>
            <Text
              style={{
                ...commonStyles.fontSize14,
                marginHorizontal: moderateScale(10),
              }}
            >
              {likeDislikeCount?.dislikeCount}
            </Text>
            <Pressable onPress={share}>
              <Image
                style={{
                  tintColor: colors.grey,
                  width: 25,
                  height: 25,
                }}
                source={imagePath.shareIcon}
              />
            </Pressable>
          </FlexSBContainer>
        )}
      </FlexSBContainer>
      {item?.completePost !=null && (
        <CompleteMessage item={item}/>
      )}
    </View>
  );
};

export default React.memo(ButtonAndLikeContainer);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
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
