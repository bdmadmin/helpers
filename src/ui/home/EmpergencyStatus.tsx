// import {useNavigation} from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  DeviceEventEmitter,
  Alert,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import FlexSBContainer from "../../components/FlexSBContainer";
import RadiusModal from "../../components/RadiusModal";
import { FILE_BASE_URL } from "../../config/constant";
import imagePath from "../../config/imagePath";
import navigationString from "../../config/navigationString";
import { emergencyStories } from "../../redux/actions/home";
import colors from "../../theme/colors";
import fontFamily from "../../theme/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../theme/responsiveSize";
import commonStyles from "../../utils/commonStyles";
import StoriesSlide from "../stories/StoriesSlide";
import EmergencySkeltonView from "./EmergencySkeltonView";
import { navigate } from "../../service/NavigationService";
import { setpause } from "../../redux/reducer/AudioVideoList/audioVideoList";
// import crashlytics from '@react-native-firebase/crashlytics';
interface EmergencyStatusProps {}

const EmergencyStatus = (_: EmergencyStatusProps) => {
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const [stories, setStories] = React.useState<any>([]);
  const userData = useSelector((state) => state.authUser.authUser);
  const navigation = useNavigation();
  const statusRef = React.useRef();
  const radiusHandler = React.useRef();
  const dispatch = useDispatch()

  React.useEffect(() => {
    getEmergencyPost(true);
 
  }, []);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener("emergencyPost", () => {
      getEmergencyPost(false);
    });
    return () => {
      listener.remove();
    };
  }, []);

  const getEmergencyPost = async (showLoading: boolean) => {
    try {
      showLoading && setLoading(true);
      const emergency = await emergencyStories();
      setStories(emergency?.listing);
      setLoading(false);
    } catch (error) {}
  };

  if (isLoading) {
    return <EmergencySkeltonView />;
  }
  const navigateToStories = (index: number) => {
    statusRef?.current?._handleStoryItemPress(index);
    // navigation.navigate(navigationString.STORIES_SCREEN, {stories});
  };

  const navigateToEmergency = () => {
    if (userData?.guest) {
      navigation.navigate(navigationString.LOGIN_GUEST);
      return;
    }
    navigation.navigate(navigationString.EMERGENCY_POST);
  };
  const openRadiusScreen = () => {
    // navigation.navigate(navigationString.RADIUS);
    if (userData?.guest) {
      navigate(navigationString.MESSAGE);
      return;
    }
    dispatch(setpause(true))
    radiusHandler.current.openCloseAction(true);
  };

  const openSearch = () => {
    if (userData?.guest) {
      navigation.navigate(navigationString.LOGIN_GUEST);
      return;
    }
    navigation.navigate(navigationString.SEARCH);
  };
  const renderEmergencyStatus = ({ item, index }: any) => {
    return (
      <Pressable style={{}} onPress={() => navigateToStories(index)}>
        <FastImage
          key={index}
          style={[styles.sosImage, styles.emergencyStory]}
          source={
            item?.profilePic
              ? { uri: `${FILE_BASE_URL}${item?.profilePic}` }
              : imagePath.placeholder
          }
        >
          <Image style={styles.sosLocal} source={imagePath.Sos} />
        </FastImage>
        <Text numberOfLines={1} style={styles.userName}>
          {item?.firstName}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlexSBContainer>
        <Pressable onPress={navigateToEmergency}>
          <FastImage
            style={styles.sosImage}
            source={
              userData?.profilePic
                ? { uri: userData?.profilePic }
                : imagePath.placeholder
            }
          />
          <Text style={styles.title}>{"Add SOS"}</Text>
        </Pressable>
        <FlatList
          style={styles.marginBottom}
          horizontal
          data={stories}
          renderItem={renderEmergencyStatus}
        />
        <Pressable onPress={openSearch} style={styles.searchContainer}>
          <Image style={styles.imgStyle} source={imagePath.fi_search} />
          <Text style={styles.title}>{"Search"}</Text>
        </Pressable>
        <Pressable
          onPress={openRadiusScreen}
          style={{ marginBottom: moderateScaleVertical(10) }}
        >
          <Image style={styles.imgStyle} source={imagePath.fi_map} />
          <Text style={styles.title}>{"Area"}</Text>
        </Pressable>
      </FlexSBContainer>
      <StoriesSlide data={stories} ref={statusRef} />
      <RadiusModal ref={radiusHandler} />
    </View>
  );
};

export default EmergencyStatus;

const styles = StyleSheet.create({
  container: {
    padding: 10,

  },
  userName: {
    ...commonStyles.fontSize12,
    fontSize: textScale(8),
    textAlign: "center",
    marginStart: 10,
    marginTop: 5,
    maxWidth: 60,
  },
  title: {
    ...commonStyles.fontSize13,
    fontSize: textScale(11),
    fontFamily: fontFamily.semibold,
    color: colors.grey_95,
    marginTop: moderateScaleVertical(10),
    textAlign: "center",
  },
  sosImage: {
    width: 45,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
  },
  marginBottom: { marginBottom: 7 },
  searchContainer: { marginEnd: moderateScale(20), marginBottom: 10 },
  imgStyle: { width: 25, height: 25, alignSelf: "center" },
  emergencyStory: {
    borderRadius: 10,
    marginStart: 10,
    borderWidth: 1.5,
    borderColor: colors.themeColor,
  },
  sosLocal: { position: "absolute", end: 0, width: 15, height: 15, bottom: 0 },
});
