import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  Pressable,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  LayoutAnimation,
  VirtualizedList,
  PermissionsAndroid,
} from "react-native";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlashList } from "@shopify/flash-list";
import colors from "../../theme/colors";
import FastImage from "react-native-fast-image";
import imagePath from "../../config/imagePath";
import { height, width } from "../../theme/responsiveSize";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import ImagePicker from "react-native-image-crop-picker";
import Chatitem from "./Chatitem";
import database, { firebase } from "@react-native-firebase/database";
import Config from "react-native-config";
import { FireStore } from "../../config/urls";
import uuid from "react-native-uuid";
import { useSelector,useDispatch } from "react-redux";
import {
  pushNotificationChatApi,
  sendMessage,
  uploadFile,
} from "../../redux/actions/home";
import moment from "moment";
import axios from "axios";
import useUploadImage from "../../hooks/userUploadImage";
import { FILE_BASE_URL } from "../../config/constant";
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from "react-native-audio-recorder-player";
import { showError } from "../../utils/utils";
import { useFocusEffect } from "@react-navigation/native";

interface props {
  Room: string;
  item: any;
}

const audioRecorderPlayer = new AudioRecorderPlayer();
// audioRecorderPlayer.setSubscriptionDuration(0.09);

const Chat1 = ({ Room, item }: props) => {
  const [keyboard, setkeyboard] = useState({ isTrue: false, height: 0 });
  const [data, setdata] = useState([]);
  const [textMesssage, settextMesssage] = useState<string>("");
  const [AnimIndex, setAnimIndex] = useState<any>(null);
  const [showAtach, setshowAtach] = useState<boolean>(false);
  const [showMedia, setshowMedia] = useState<boolean>(false);
  const [imageData, setimageData] = useState<any>([]);
  const [room, setroom] = useState<any>(Room);
  const [SendLoading, setSendLoading] = useState<Boolean>(false);
  const [micOn, setmicOn] = useState<Boolean>(false);
  const [indexZero, setindexZero] = useState<Boolean>(false);
  const [audioTimer, setaudioTimer] = useState<String>("");
  const dispatch = useDispatch()
  const userData = useSelector((state: any) => state?.authUser.authUser);
  const fireStore = firebase.app().database(FireStore);
  const chatdata = useSelector((state:any)=>state.chat)
  // console.log("chat redux =>",chatdata)
  const viewableItemChanged = React.useRef((viewableItem: any) => {
    if (viewableItem.viewableItems[0] != undefined) {
      {
        viewableItem.viewableItems[0]?.index
          ? setindexZero(true)
          : setindexZero(false);
      }
    }
  });

  const doubleArrowMemo = useMemo(() => indexZero, [indexZero]);

  const { openDocument, image, openDialog } = useUploadImage();

  const flashRef: any = useRef(null);
  const refData: any = useRef([]);
  const imgUrl: any = useRef([]);
  const scrollToIndex: any = useRef();
  const keyHeight = useRef(0);

  const ImagePic = async () => {
    await ImagePicker.openPicker({
      mediaType: "any",
      multiple: false,
      cropping: true,
    })
      .then((image: any) => {
        setimageData(image);
        imgUrl.current = image;
        setshowAtach(false);
        setshowMedia(true);
        console.log("image===GAL", image);
        // uploadImage(imgUrl.current)
      })
      .catch(() => {
        setshowAtach(false);
      });
  };

  const uploadImage = async (file: any) => {
    var img = {
      uri: Platform.OS == "ios" ? file.sourceURL : file.path,
      name: uuid.v4(),
      type: file.mime,
    };

    console.log("img==-=-=-=-=-=", img);
    const formData = new FormData();
    formData.append("images", img);

    try {
      const data: any = await uploadFile(formData);
      if (data.fileName) {
        let fileData = [{ image: data?.fileName }]
        fireSend("", fileData);
      }
      console.log("qwerty data == > ", data);
    } catch (error) {
      console.log("aaaaa", error);
    }
  };

  const CameraPic = async () => {
    await ImagePicker.openCamera({
      cropping: true,
    })
      .then((image: any) => {
        setimageData(image);
        imgUrl.current = image;
        setshowAtach(false);
        setshowMedia(true);
        console.log("image===CAM", image);
      })
      .catch(() => {
        setshowAtach(false);
      });
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      keyHeight.current == e.endCoordinates.height;
      setkeyboard({ isTrue: true, height: e.endCoordinates.height });
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", (e) => {
      setkeyboard({ isTrue: false, height: e.endCoordinates.height });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const ChatItems = memo(Chatitem);

  const setAnim = useCallback((val: string) => {
    setAnimIndex(val);
  }, []);

  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <GestureHandlerRootView key={index}>
        <ChatItems
          item={item}
          AnimIndex={(val: string) => setAnim(val)}
          scrollToIndexRef={scrollToIndex}
        />
      </GestureHandlerRootView>
    );
  }, []);

  useEffect(() => {
    fireStore
      .ref("/massages/" + room)
      .once("value")
      .then((snapshot) => {
        let data = Object.values(snapshot.val());
        data
          .sort((a: any, b: any) => new Date(a.sendTime) - new Date(b.sendTime))
          .reverse();
        setdata(JSON.parse(JSON.stringify(data)));
        refData.current = JSON.parse(JSON.stringify(data));
      });
  }, []);

  useEffect(() => {
    const onChildAdd = fireStore
      .ref("/massages/" + room)
      .on("child_added", (snapshot) => {
        let newData = snapshot.val();
        
        const even = (e: any) => e.id === newData.id;
      
        if (!refData.current.some(even)) {
          
          setdata((state: Array) => [newData,...state]);
          refData.current = [newData, ...refData.current];
        }
      
      });

    if (refData.current.length != 0) {
      return () =>
        fireStore.ref("/massages/" + room).off("child_added", onChildAdd);
    }
  }, [room]);

  useFocusEffect(
    React.useCallback(()=>{
    //   const onChildAdd = fireStore
    //   .ref("/massages/" + room)
    //   .on("child_added", (snapshot) => {
    //     let newData = snapshot.val();
    //     const even = (e: any) => e.id === newData.id;
    //     console.log("new data on focus=>",newData)
    //     if (!refData.current.some(even)) {
          
    //       setdata((state: Array) => [...state,newData]);
    //       refData.current = [newData, ...refData.current];
    //     }
    
    //   });

    // if (refData.current.length != 0) {
    //   return () =>
    //     fireStore.ref("/massages/" + room).off("child_added", onChildAdd);
    // }
    },[data,room])
  )
  
  const fireSend = (newRoom2: String, fileName: any) => {
    setSendLoading(true);
    console.log("Room ===", Room);
    console.log("fileName ===", fileName);
    // console.log("imageData.length!=0===",imageData.length!=0)
    try {
      let data = {
        id: uuid.v4(),
        userName: userData?.firstName,
        userId: userData?.id,
        media: fileName ?? [],
        massage: textMesssage,
        replyText: AnimIndex,
        sendTime: moment().format(),
        seen: false,
        status: "none",
      };
      // {
      //   image:"https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      //   type:"image",
      //   width:500,
      //   height:500
      // }

      fireStore
        .ref(`/massages/${room ?? newRoom2}`)
        .push()
        .set(data)
        .then(() => {
          console.log("Data set.");
          settextMesssage("");
          {
            room ?? setroom(newRoom2);
          }
          setSendLoading(false);
        })
        .catch((err) => {
          console.log("errrr111", err);
          setSendLoading(false);
        });
    } catch (error) {
      setSendLoading(false);
    }
  };

  const onSendRequest = React.useCallback(
    async (fileInput?: any, type?: 1 | 2) => {
      setSendLoading(true);
      if (textMesssage.trim() || fileInput) {
        try {
          const formData = new FormData();
          formData.append("receiverId", item?.user.id);
          formData.append("postId", item?.postId);
          if (fileInput) {
            formData.append("mediaName", fileInput);
            formData.append("mediaType", type);
          }
          if (textMesssage) {
            formData.append("message", textMesssage.trim());
          }
          const retdata: any = await sendMessage(formData);
          console.log("retdata=====", retdata);
          if (Object.keys(retdata)?.length != 0) {
            fireSend(retdata?.room);
          }
          // isSend.current = true;
          setSendLoading(false);
        } catch (error) {
          setSendLoading(false);
        }
      } else {
        setSendLoading(false);
      }
    },
    [textMesssage, room, userData]
  );

  scrollToIndex.current = useCallback((id: any) => {
    console.log("iddddddd", id);
    const itemIndex = (e: any) => String(e.id) === String(id);
    flashRef.current.scrollToIndex({
      animated: true,
      index: refData.current.findIndex(itemIndex),
    });
  }, []);

  // console.log("data====",data)
  const getItem = (data, index) => {
    return data[index];
  };
  const getItemCount = () => {
    return data.length;
  };

  const uploadAudio = async (file: string) => {
    const formData = new FormData();
    formData.append("audios", {
      uri: file,
      type: "audio/mp4",
      name: "audio.mp4",
    });
    try {
      const data:any = await uploadFile(formData);
      console.log("Audio=Data=-=-=-=---=-=-=-", data);
      room ? fireSend("",[{audio:data?.fileName}]) : onSendRequest();
      // onSendRequest(data?.fileName, 2);
    } catch (error) {
      console.log("aaaaa", error);
      showError("Please try after sometime");
    }
  };

  const onStartRecord = async () => {
    if (Platform.OS === "android") {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.READ_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.RECORD_AUDIO"] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("permissions granted");
        } else {
          console.log("All required permissions not granted");
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    try {
      const result = await audioRecorderPlayer.startRecorder(
        undefined,
        {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVModeIOS: AVModeIOSOption.measurement,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
        },
        false
      );
      audioRecorderPlayer.addRecordBackListener((e: any) => {
        let timer:string = audioRecorderPlayer
          .mmssss(Math.floor(e.currentPosition))
          .split(":")
          .splice(0, 2)
          .join(":");
        setaudioTimer(timer);
        console.log("e.currentPosition==>", e.currentPosition);
        return;
      });
      console.log("result===Audio===>", result);
      // };
      // console.log("uriuriuri", audioRecorderPlayer);
    } catch (error) {
      // setmicOn(false);
      // showError(error.message);
      console.log("Audio Error", error);
    }
  };

  const onStopRecord = React.useCallback(async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setmicOn(false);
      console.log("Stopped recording:", result);
      console.log("audioTimer=-=-=", audioTimer);
      if ("file" == result.split(":")[0]) {
        uploadAudio(result);
        console.log("upload");
      }
      setaudioTimer("")
    } catch (error) {
      console.error("Error stopping the recording:", error);
    }
  }, []);

  const pushNotification = async () => {
    console.log("roommmmm", room);
    const result = await pushNotificationChatApi({
      receiverId: 172,
      postId: 1,
      message: "hello adam",
      room: "a137fa58b5f5787519fa4bc46d433e26",
      mediaName:
        "https://helpersfamily.s3.ap-south-1.amazonaws.com/users/usersPic_8xaMuB03.jpg",
      mediaType: "1",
    });
    console.log("1234567890======>>>>>>>>", result);
  };

  return (
    <View
      style={{
        flex: 1,
        marginBottom:
          Platform.OS === "ios" ? (keyboard.isTrue ? keyboard.height : 0) : 0,
      }}
    >
      <FlashList
        ref={flashRef}
        inverted
        canCancelContentTouches={true}
        directionalLockEnabled={true}
        estimatedItemSize={1000}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        keyboardShouldPersistTaps="always"
        data={data}
        extraData={data}
        renderItem={renderItem}
        onViewableItemsChanged={viewableItemChanged.current}
      />
      <View
        style={[
          styles.inputContainer,
          {
            marginBottom: keyboard.isTrue ? 5 : Platform.OS == "ios" ? 20 : 5,
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
                      {Array.isArray(AnimIndex?.media)&& AnimIndex?.media[0]?.image && (
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
                <Pressable
                  style={styles.pressable}
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut
                    );
                    setAnimIndex(null);
                  }}
                >
                  <FastImage
                    source={imagePath.crossBlack}
                    style={{ width: 12, height: 12 }}
                  />
                </Pressable>
              </View>
            )}

          <TouchableOpacity style={{ position: "relative" }}>
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
                  opacity: micOn ? 0 : 1,
                },
              ]}
            />
            {micOn && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 14,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FastImage
                  source={imagePath.mic_gif}
                  style={{ width: 50, height: 50 }}
                />

                <Text style={{fontSize:17,color:colors.black,paddingRight:5}}>{audioTimer}</Text>
                <Text style={{fontSize:17,color:colors.black}}>Recording...</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableWithoutFeedback
            onPress={() => {
              // ImagePic()
              // Keyboard.dismiss()
              setshowAtach(true);
            }}
          >
            <FastImage
              source={imagePath.atechPinIcon}
              style={styles.atechIcon}
            />
          </TouchableWithoutFeedback>
        </View>

        {doubleArrowMemo && (
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
              right: 13,
              backgroundColor: "white",
              borderRadius: 100,
              padding: 5,
              opacity: 0.9,
            }}
          >
            <FastImage
              source={imagePath.downArrow}
              style={{ width: 20, height: 20 }}
            />
          </Pressable>
        )}

        {textMesssage.length != 0 ? (
          <TouchableOpacity
            style={styles.sendContainer}
            onPress={() => {
              pushNotification();
              if (textMesssage.length != 0) {
                {
                  room ? fireSend(null) : onSendRequest();
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
        ) : (
          <TouchableOpacity
            style={styles.sendContainer}
            onPressIn={() => {
              onStartRecord();
              setmicOn(true);
              console.log("MIC ON");
            }}
            onPressOut={() => {
              if (micOn) {
                setmicOn(false);
                onStopRecord();
                console.log("MIC OFF");
              }
            }}
            // onPress={() => {
            //   if (textMesssage.length != 0) {
            //     {
            //       room ? fireSend(null) : onSendRequest();
            //     }
            //     flashRef.current.scrollToIndex({
            //       index: 0,
            //       animated: false,
            //     });
            //   }
            //   if (AnimIndex?.massage?.length != 0) {
            //     setAnimIndex(null);
            //   }
            // }}
          >
            <FastImage
              source={imagePath.mic}
              style={{ width: 50, height: 50,alignSelf:"center" }}
            />
          </TouchableOpacity>
        )}
      </View>




      {showAtach && (
        <Modal
          style={{ justifyContent: "center", margin: 0, position: "absolute" }}
          animationType="fade"
          transparent={true}
          visible={showAtach}
          onRequestClose={() => {
            setshowAtach(!showAtach);
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              // backgroundColor: "rgba(0,0,0,0.2)",
              flex: 1,
              justifyContent: "flex-end",
            }}
            onPress={() => {
              setshowAtach(!showAtach);
            }}
          >
            <View
              style={{
                backgroundColor: colors.white, //"blue",
                width: "100%",
                height: keyboard.isTrue ? keyboard.height : height / 3,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                paddingHorizontal: 50,
              }}
            >
              <Pressable
                style={{
                  maxHeight: 70,
                  alignItems: "center",
                  margin: 5,
                  padding: 10,
                }}
                onPress={() => {
                  CameraPic();
                }}
              >
                <FastImage
                  source={imagePath.cameraChat}
                  style={{ width: 50, height: 50, padding: 20 }}
                />
              </Pressable>
              <Pressable
                style={{
                  maxHeight: 70,
                  alignItems: "center",
                  margin: 5,
                  padding: 10,
                }}
                onPress={() => ImagePic()}
              >
                <FastImage
                  source={imagePath.Gallery}
                  style={{ width: 50, height: 50, padding: 20 }}
                />
              </Pressable>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <Modal
        style={{ justifyContent: "center", margin: 0, position: "absolute" }}
        animationType="fade"
        transparent={true}
        visible={showMedia}
        onRequestClose={() => {
          setshowMedia(!showMedia);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.black,
            marginBottom:
              Platform.OS === "ios"
                ? keyboard.isTrue
                  ? keyboard.height
                  : 0
                : 0,
          }}
        >
          <View style={{ height: "10%" }}></View>
          <View
            style={{
              width: "100%",
              height: "80%",
              backgroundColor: colors.black,
            }}
          >
            <FlashList
              estimatedItemSize={10}
              contentContainerStyle={{}}
              data={[imageData]}
              pagingEnabled
              horizontal
              renderItem={({ item }) => {
                console.log("item", item);
                return (
                  <FastImage
                    resizeMode="contain"
                    source={{ uri: item?.path }}
                    style={{
                      width: width,
                      height: height / 1.2,
                      padding: 20,
                    }}
                  />
                );
              }}
            />
          </View>
          <View
            style={{
              maxHeight: "10%",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ width: "80%" }}>
              <TextInput
                placeholder="Add a caption..."
                multiline
                value={textMesssage}
                onChangeText={(val) => settextMesssage(val)}
                style={[
                  styles.inputBox,
                  {
                    paddingRight: 20,
                    paddingBottom: Platform.OS == "ios" ? 14 : 10,
                    paddingTop: Platform.OS == "ios" ? 14 : 10,
                  },
                ]}
              />
            </View>
            <TouchableOpacity
           
              style={styles.sendContainer}
              onPress={() => {
                if (textMesssage.length != 0 || imageData.length != 0) {
                  // let newData: any = [
                  //   {
                  //     user: AnimIndex?.massage == "Hello" ? "You" : "User",
                  //     massage: textMesssage,
                  //     replyText: AnimIndex,
                  //     media: imageData,
                  //   },
                  //   ...data,
                  // ];
                  // setdata(newData);
                  // settextMesssage("");
                  // flashRef.current.scrollToEnd()
                  uploadImage(imgUrl.current);
                }
                if (AnimIndex?.massage?.length != 0) {
                  setAnimIndex(null);
                }
                if (imageData.length != 0) {
                  setimageData([]);
                }
                setshowMedia(false);
              }}
            >
              <FastImage source={imagePath.senIcon} style={styles.sendIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default memo(Chat1);

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
    top: 3,
    right: 3,
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
