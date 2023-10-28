import {
  View,
  Text,
  ScrollView,
  // Image,
  Alert,
  Modal,
  ImageBackground,
  Dimensions,
  Platform,
  PermissionsAndroid,
  PixelRatio,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
// import {height, width} from '../../constants/Constants';
//   import {
//     AntDesign,
//     Ionicons,
//     MaterialCommunityIcons,
//   } from "../../assets/Icon/Icon";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Image } from "react-native-compressor";
import ImagePicker from "react-native-image-crop-picker";

const ImagePickers = ({ ImageList, setImageList, lable, base64img }) => {
  const { height, width } = Dimensions.get("window");
  const [modalVisible, setmodalVisible] = useState(false);
  const [modalView, setmodalView] = useState({ istrue: false, index: "" });

  const translateX = useSharedValue(0);

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationY;
    },
    onEnd: () => {},
  });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateX.value }],
  }));

  async function safeOpenPhoneSettings() {
    Alert.alert(
      `Permission`,
      `Need Camera Permission`,
      [
        {
          text: "cencil",
        },
        {
          text: "Give",
          onPress: async () => {
            await Linking.openSettings();
          },
          style: "default",
        },
      ],
      { cancelable: false }
    );
  }

  const per = async () => {
    if (Platform.OS == "android") {
      const permissionAndroid = await PermissionsAndroid.check(
        "android.permission.CAMERA"
      );
      console.log("permissionAndroid", permissionAndroid);
      if (permissionAndroid) {
        return true;
      }
      if (permissionAndroid != PermissionsAndroid.RESULTS.granted) {
        const reqPer = await PermissionsAndroid.request(
          "android.permission.CAMERA"
        );
        console.log("reqPer", reqPer);
        if (reqPer == "granted") {
          return true;
        } else if (reqPer == "never_ask_again") {
          safeOpenPhoneSettings();
          console.log("ankit");
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const openCamera = async () => {
    const aaa = await per();
    let options = {
      quality: 1,
      maxWidth: 500,
      maxHeight: 500,
      // includeBase64: true,
      mediaType: "photo",
      noData: true,
      // cameraType: "front",
      // maxWidth: PixelRatio.getPixelSizeForLayoutSize(600),
      // maxHeight: PixelRatio.getPixelSizeForLayoutSize(400),
    };

    // const result = await launchCamera(options);
    // console.log("result=========",result)
    if (aaa === true) {
      // await launchCamera(options, (response) => {
      //   if (response.didCancel) {
      //     console.log("Cancelled");
      //   } else if (response.error) {
      //     console.log("Error", response.errorMessage);
      //   } else if (response?.assets[0]?.uri) {
      //     console.log(response?.assets[0]?.uri);
      // let setimg = new Promise(async (imgresolve, imgreject) => {
      //   await Image.compress(response.assets[0].uri, {
      //     compressionMethod: "auto",
      //     returnableOutputType:base64img==true?'base64':'uri'
      //   }).then((result) => {
      //     if (base64img==true) {
      //       imgresolve(String(`data:${response.assets[0].type};base64,${result}`));
      //     } else {
      //       imgresolve(String(result));
      //     }
      //   });
      // });
      // setimg.then((result) => {
      //   setImageList([...ImageList, result]);
      //   setmodalVisible(false);
      // });
      // }
      // });

      await ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      }).then((image) => {
        console.log(image);
        let setimg = new Promise(async (imgresolve, imgreject) => {
          await Image.compress(image.path, {
            compressionMethod: "auto",
            returnableOutputType: base64img == true ? "base64" : "uri",
          }).then((result) => {
            if (base64img == true) {
              imgresolve(String(`data:${image.mime};base64,${result}`));
            } else {
              imgresolve(String(result));
            }
          });
        });
        setimg.then((result) => {
          setImageList([...ImageList, result]);
          setmodalVisible(false);
        });
      });
    }
  };

  const openGallery = async () => {
    console.log("first");

    let options = {
      quality: 1,
      selectionLimit: 5,
      // includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    // await launchImageLibrary(options, (response) => {
    // if (response.didCancel) {
    //   console.log("User cancelled image picker");
    // } else if (response.error) {
    //   console.log("ImagePicker Error: ", response.error);
    // } else if (response.customButton) {
    //   console.log("User tapped custom button: ", response.customButton);
    //   alert(response.customButton);
    // } else {
    //   const source = { uri: response.assets[0].uri };
    //   console.log("response", JSON.stringify(response));
    //   let li = [];

    // let setimg = new Promise((imgresolve, imgreject) => {
    //   response.assets.forEach(async (item, index) => {
    //     await Image.compress(item.uri, {
    //       compressionMethod: "auto",
    //       returnableOutputType: base64img == true ? "base64" : "uri",
    //     }).then((result) => {
    //       // console.log("result compresss-----------", result);
    //       if (base64img == true) {
    //         li.push(String(`data:${item.type};base64,${result}`));
    //       } else {
    //         li.push(String(result));
    //       }
    //     });
    //     console.log("response.assets.length", response.assets.length);
    //     console.log("index", index);
    //     if (response.assets.length == index + 1) {
    //       console.log("imgresolve");
    //       imgresolve(li);
    //     }
    //   });
    // });
    // setimg.then((li) => {
    //   // console.log("liiii", li);
    //   setImageList([...ImageList, ...li]);
    //   setmodalVisible(false);
    // });

    // }
    // }
    // );

    await ImagePicker.openPicker({
      cropping: true,
      // multiple:true
    }).then((image) => {
      console.log(image);

      let li: any = [];
      let setimg = new Promise(async (imgresolve, imgreject) => {
        // response.assets.forEach(async (item, index) => {
        await Image.compress(image.path, {
          compressionMethod: "auto",
          returnableOutputType: base64img == true ? "base64" : "uri",
        }).then((result) => {
          console.log("result compresss-----------", result);
          if (base64img == true) {
            li.push(String(`data:${image.mime};base64,${result}`));
          } else {
            li.push(String(result));
          }
        });
        // if (response.assets.length == index + 1) {
        //   console.log("imgresolve");
        imgresolve(li);
        // }
        // });
      });
      setimg.then((li: any) => {
        // console.log("liiii", li);
        setImageList([...ImageList, ...li]);
        setmodalVisible(false);
      });
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: height / 8,
          backgroundColor: "#fff",
          borderRadius: 10,
          borderWidth: lable ? 1.5 : 0,
          borderColor: "#aaa",
          borderStyle: "dashed",
          elevation: 2,
          padding: 3,
          justifyContent: "center",
          alignItems: ImageList[0] ? "flex-start" : "center",
        }}
      >
        <ScrollView
          horizontal={true}
          style={{}}
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {ImageList?.map((item: any, index: number) => {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    height: height / 9,
                    width: ImageList[0] ? width / 4 : null,
                    borderRadius: 10,
                    //   borderWidth: ImageList[0] ? 1.5 : null,
                    elevation: 2,
                    borderColor: "#aaa",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 5,
                    flexDirection: "row",
                  }}
                  onPress={() =>
                    setmodalView({ ...modalView, istrue: true, index: index })
                  }
                  key={index}
                >
                  {/* <PanGestureHandler onGestureEvent={panGesture}> */}
                  {/* <View
                        style={[
                          {
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'red',
                            height: '100%',
                            width: '100%',
                            borderRadius:10
                          },
                          // rStyle,
                        ]}> */}
                  <ImageBackground
                    source={{ uri: item }}
                    style={{ height: "100%", width: "100%", borderRadius: 10 }}
                    resizeMode="contain"
                  />
                  {/* </View> */}
                  {/* </PanGestureHandler> */}
                </TouchableOpacity>
              );
            })}
            {lable ? (
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  height: height / 9,
                  width: ImageList[0] ? width / 4 : width,
                  borderRadius: 10,
                  borderWidth: ImageList[0] ? 1.5 : null,
                  borderColor: "#aaa",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setmodalVisible(true)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* <AntDesign name="plus" size={30} color="#aaa" /> */}
                  <Text style={{ color: "#aaa" }}>
                    {ImageList[0] ? "Add" : lable}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          maxHeight: height / 2,
          paddingBottom: 10,
        }}
      >
        <Modal
          style={{ justifyContent: "center", margin: 0 }}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setmodalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              flex: 1,
              justifyContent: "flex-end",
            }}
            onPress={() => {
              setmodalVisible(!modalVisible);
            }}
          >
            <TouchableNativeFeedback>
              <View
                style={{
                  borderTopEndRadius: 15,
                  borderTopStartRadius: 15,
                  backgroundColor: "#3BA1FF",
                  height: height / 4.7,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 10,
                  }}
                >
                  {/* <MaterialCommunityIcons
                      name="close-thick"
                      size={20}
                      color="#fff"
                      onPress={() => setmodalVisible(!modalVisible)}
                    /> */}
                </View>
                <View
                  style={{
                    width: width,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <View>
                    {/* <Ionicons
                        name="camera-outline"
                        size={80}
                        color="#fff"
                        onPress={() => {
                          openCamera();
                        }}
                      /> */}
                    <Text
                      style={{
                        fontSize: 15,
                        alignSelf: "center",
                        color: "#fff",
                      }}
                    >
                      Camera
                    </Text>
                  </View>
                  <View>
                    {/* <Ionicons
                        name="ios-images-outline"
                        size={80}
                        color="#fff"
                        onPress={() => openGallery()}
                      /> */}
                    <Text
                      style={{
                        fontSize: 15,
                        alignSelf: "center",
                        color: "#fff",
                      }}
                    >
                      Gallery
                    </Text>
                  </View>
                </View>
                {/* <ButtonOne title="Cancel" /> */}
              </View>
            </TouchableNativeFeedback>
          </TouchableOpacity>
        </Modal>
      </View>

      <View
        style={{ flex: 1, justifyContent: "center", maxHeight: height / 2 }}
      >
        <Modal
          style={{ justifyContent: "center", margin: 0 }}
          animationType="fade"
          transparent={true}
          visible={modalView.istrue}
          onRequestClose={() => {
            setmodalView({ ...modalView, istrue: false, index: "" });
          }}
        >
          <View
            style={{
              backgroundColor: "#000000aa",
              //   backgroundColor: 'transparent',
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: height / 1.4,
                marginTop: height / 10,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000",
                marginHorizontal: 20,
                borderRadius: 10,
              }}
            >
              <ImageBackground
                source={{ uri: ImageList[modalView.index] }}
                style={{ height: "100%", width: "100%", borderRadius: 10 }}
                resizeMode="contain"
              >
                {/* <AntDesign
                    name="close"
                    size={25}
                    color="#fff"
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 6,
                    }}
                    onPress={() =>
                      setmodalView({ ...modalView, istrue: false, index: "" })
                    }
                  /> */}
                {lable ? (
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      backgroundColor: "red",
                      width: width / 4.5,
                      height: height / 30,
                      bottom: 10,
                      alignSelf: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      let newli = ImageList?.splice(modalView.index, 1);
                      console.log("newli", newli);
                      // setImageList(newli)
                      setmodalView({ ...modalView, istrue: false, index: "" });
                    }}
                  >
                    {/* <AntDesign name="delete" size={25} color="#fff" /> */}
                    <Text style={{ color: "#fff", fontSize: 19 }}>Delete</Text>
                  </TouchableOpacity>
                ) : null}
              </ImageBackground>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default ImagePickers;
