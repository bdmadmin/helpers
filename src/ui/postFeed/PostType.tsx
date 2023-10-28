import * as React from "react";
import { Text, View, StyleSheet, Image, Pressable, Modal } from "react-native";
import BackButton from "../../components/BackButton";
import WrapperContainer from "../../components/WrapperContainer";
import imagePath from "../../config/imagePath";
import colors from "../../theme/colors";
import commonStyles from "../../utils/commonStyles";
// import {createFeed} from '../../redux/actions/home';
import MainButton from "../../components/MainButton";
import { height, moderateScaleVertical } from "../../theme/responsiveSize";
import { useDispatch, useSelector } from "react-redux";
// import {getCurrentLocation, locationPermission} from '../../utils/helper';
// import {AuthorizationResult, GeoPosition} from 'react-native-geolocation-service';
// import {showError, showSuccess} from '../../utils/utils';
// import {StackActions} from '@react-navigation/native';
// import {capturePhotos, recordedVideo} from '../../redux/reducer/AudioVideoList/audioVideoList';
import navigationString from "../../config/navigationString";
import { ScrollView } from "react-native-gesture-handler";
import { _navigator } from "../../service/NavigationService";
import { openMobileAlert } from "../../redux/reducer/MobileNumberSlice/mobileNumberSlice";
import MobilePhoneUpdateModal from "../../components/MobilePhoneUpdateModal";
import { getCausesList } from "../../redux/actions/home";

interface PostTypeProps {}

const PostType = (_: PostTypeProps) => {
  const { navigation } = _;
  const [helpOrDonate, setNeedHelpOrDonate] = React.useState(true);
  const [modalShow, setmodalShow] = React.useState(false);
  const [Selected, setSelected] = React.useState("Job");
  const [Causes, setCauses] = React.useState([]);
  // const [isLoading, setLoading] = React.useState(false);
  // const photos = useSelector(state => state.audioVideoList.photos);
  // const video = useSelector(state => state.audioVideoList.video);
  const userData = useSelector((state) => state.authUser.authUser);

  const name = _.route?.params?.type;
  console.log("name==", name);
  // const tags = _.route?.params.tags;
  // const recordedAudio = _.route?.params.recordedAudio;
  const dispatch = useDispatch();

  React.useEffect(() => {
    (async () => {
      const x: any = await getCausesList();
      console.log("xxxxxxxxx==", x);
      setCauses(x?.listing);
    })();
  }, []);

  // const onPostFeed = async () => {
  //   let locationPermissionStatus: AuthorizationResult = 'denied';
  //   try {
  //     locationPermissionStatus = await locationPermission();
  //   } catch (error) {
  //     showError('Please enable location permission before uploading any post.');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const form = new FormData();
  //     if (locationPermissionStatus === 'granted') {
  //       var location = (await getCurrentLocation()) as GeoPosition;
  //       form.append('latitude', location?.coords.latitude);
  //       form.append('longitude', location?.coords.longitude);
  //     }
  //     form.append('title', 'Today');
  //     form.append('description', message);
  //     photos.forEach((photo: string) => {
  //       form.append('images[]', {
  //         uri: photo,
  //         type: 'images/jpeg',
  //         name: 'image.jpg',
  //       });
  //     });
  //     if (video) {
  //       form.append('videos[]', {
  //         uri: video,
  //         type: 'video/mp4',
  //         name: 'video.mp4',
  //       });
  //     }
  //     if (recordedAudio) {
  //       form.append('audios[]', {
  //         uri: recordedAudio,
  //         type: 'audio/mp3',
  //         name: 'audio.mp3',
  //       });
  //     }

  //     if (tags && tags?.length > 0 && tags.every(Boolean)) {
  //       form.append('tags', tags);
  //     }
  //     form.append('type', helpOrDonate ? 1 : 2);
  //     const x = await createFeed(form);
  //     setLoading(false);
  //     showSuccess('Post uploaded successfully');
  //     video && dispatch(recordedVideo(''));
  //     photos?.length > 0 && dispatch(capturePhotos(''));
  //     navigation.dispatch(StackActions.pop());
  //     navigation.dispatch(StackActions.replace(navigationString.TAB_ROUTES));
  //     DeviceEventEmitter.emit('addOwnPost', x);
  //   } catch (error) {
  //     setLoading(false);
  //     showError((error as Error)?.message);
  //     console.log('HAHA', error);
  //   }
  // };

  const goToPostType = () => {
    if (!userData?.mobile || userData?.isMobileVerify === 0) {
      dispatch(openMobileAlert({ isOpen: true }));
      return;
    }
    setmodalShow(!modalShow);
    navigation.navigate(navigationString.POST_FEED, {
      helpOrDonate: helpOrDonate ? 1 : 2,
      type: Selected,
    });
  };

  return (
    <WrapperContainer>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <BackButton />
          <Text
            style={{
              ...commonStyles.fontBold24,
              marginTop: moderateScaleVertical(40),
              marginBottom: moderateScaleVertical(10),
            }}
          >
            {"What is your purpose"}
          </Text>
          <Text
            style={{
              ...commonStyles.fontSize14,
              color: colors.grey,
              marginEnd: "30%",
              marginBottom: moderateScaleVertical(50),
            }}
          >
            {"Choose a mode depending onwhat you’re looking for."}
          </Text>
          <Pressable
            onPress={() => setNeedHelpOrDonate(true)}
            style={{ marginBottom: moderateScaleVertical(30) }}
          >
            <Image style={styles.imgView} source={imagePath.i_need_help_new} />
            {helpOrDonate && <View style={styles.helperView} />}
          </Pressable>
          <Pressable onPress={() => setNeedHelpOrDonate(false)}>
            <Image
              style={styles.imgView}
              source={imagePath.i_want_to_donate_new}
            />
            {!helpOrDonate && <View style={styles.helperView} />}
          </Pressable>
        </View>
        <MainButton
          onPress={() => setmodalShow(!modalShow)} //goToPostType}
          btnStyle={styles.mainBtn}
          btnText="Continue"
        />
      </ScrollView>
      <MobilePhoneUpdateModal />

      <Modal
        style={{ justifyContent: "center", margin: 0 }}
        animationType="slide"
        transparent={true}
        visible={modalShow}
        onRequestClose={() => {
          setmodalShow(!modalShow);
        }}
      >
        <View style={styles.modalView}>
          <View
            style={{
              height: 50,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text
              style={{ fontSize: 25 }}
              onPress={() => setmodalShow(!modalShow)}
            >
              X
            </Text>
            <Text
              style={{ fontSize: 22, color: colors.black, fontWeight: "600" }}
            >
              {helpOrDonate ? "Help" : "Offer"} type
            </Text>
            <Text />
          </View>
          {Causes.map((e, i) => {
            return (
              <Pressable
                key={i}
                onPress={() => setSelected(e?.name)}
                style={[
                  styles.modalSubView,
                  {
                    borderColor:
                      Selected == e?.name ? colors.themeColor : colors.grey_c0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modalText,
                    {
                      color:
                        Selected == e?.name
                          ? colors.themeColor
                          : colors.grey_c0,
                    },
                  ]}
                >
                  {" "}
                  {e?.name} {helpOrDonate ? "help" : "offer"}
                </Text>
              </Pressable>
            );
          })}
          <MainButton onPress={goToPostType} btnText="Continue" />
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default PostType;

const styles = StyleSheet.create({
  container: {},
  mainBtn: {
    marginHorizontal: 20,
    marginVertical: moderateScaleVertical(30),
  },
  helperView: {
    position: "absolute",
    width: "100%",
    borderColor: colors.blue_light,
    borderWidth: 3,
    height: 190,
    borderRadius: 20,
  },
  imgView: { width: "100%", height: 190, resizeMode: "stretch" },
  modalView: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "space-evenly",
    padding: 20,
  },
  modalSubView: {
    height: height / 6,
    maxHeight: 140,
    borderRadius: 20,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    fontSize: 22,
    fontWeight: "600",
  },
});
