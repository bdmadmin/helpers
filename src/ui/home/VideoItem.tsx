import * as React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import Video from "react-native-video";
import { FILE_BASE_URL } from "../../config/constant";
import convertToProxyURL from "react-native-video-cache";
import { useIsFocused } from "@react-navigation/native";
import colors from "../../theme/colors";
import imagePath from "../../config/imagePath";
import { height, width } from "../../theme/responsiveSize";
import NavigationService from "../../service/NavigationService";
import navigationString from "../../config/navigationString";
import { useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { setmute } from "../../redux/reducer/AudioVideoList/audioVideoList";
import { Animated } from "react-native";
import { Extrapolate, interpolate, runOnJS, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";
import { Easing } from "react-native";
interface VideoItemProps {
  uri: string;
  outerIndex: number;
}

const VideoItem = (props: VideoItemProps) => {
  const { uri, outerIndex } = props;
  // const proxyUrl = convertToProxyURL(FILE_BASE_URL + uri);
  // const videoRef = React.useRef<any>();
  // const [isLoaded, setLoading] = React.useState<boolean>(true);
  // const isFocused = useIsFocused();

  // if (!isFocused) {
  //   return null;
  // }

  // console.log("uri==========?",uri)
  const dispatch = useDispatch();

  const openModal = () => {
    NavigationService.navigate(navigationString.VIDEO_PLAYER_SCREEN, {
      url: FILE_BASE_URL + uri,
    });
  };

  const mute = useSelector((state: any) => state.audioVideoList.mute);
  const pause = useSelector((state: any) => state.audioVideoList.pause);
  const currentIndex = useSelector(
    (state: any) => state.audioVideoList.currentIndex
  );
  const changeWidth = useSelector(
    (state: any) => state.audioVideoList.changeWidth
  );

  const [ImgHeight, setImgHeight] = React.useState<any>(null);
  const [resizeMod, setresizeMod] = React.useState(false);
  const animationHeight = React.useRef(new Animated.Value(2)).current;

  const onVideoLoad = (e: any) => {
    const size = e.naturalSize;
    if (size?.width && size?.height) {
      let newWidth = changeWidth ? changeWidth : width;
      let hei: any = (e.naturalSize.height / e.naturalSize.width) * newWidth;
      hei > newWidth && setresizeMod(true);
      setImgHeight(hei > height / 1.6 ? height / 1.6 : hei);
      // const heightScaled:any = size?.height * (width / size?.width);
      // setImgHeight(heightScaled);
    }
  };

  React.useEffect(() => {
    if (ImgHeight) {
   Animated.timing(animationHeight, {
     duration: 400,
     toValue: ImgHeight,
     easing: Easing.linear,
     useNativeDriver: false
   }).start();
    }
    else{
      Animated.timing(animationHeight, {
        duration: 400,
        toValue: 5,
        easing: Easing.linear,
        useNativeDriver: false
      }).start();
   }
 }, [ImgHeight]);
  
  console.log("animationHeight====",animationHeight)

  return (
    <>
      <Animated.View
        style={[{ height: Platform.OS=="ios"?ImgHeight:animationHeight,position:"relative" }]}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ width: "100%", height: "100%" }}
          onPress={() => {
            NavigationService.navigate(navigationString.VIDEO_PLAYER_SCREEN, {
              url: FILE_BASE_URL + uri,
            });
          }}
        >
          <Video
            paused={outerIndex != currentIndex || pause}
            onLoad={(e: any) => onVideoLoad(e)}
            disableFocus={true}
            playInBackground={false}
            playWhenInactive={false}
            muted={mute}
            repeat={true}
            style={{
              width: "100%",
              height: "100%", //ImgHeight ?? 400,
              marginVertical: 10,
            }}
            // onLayout={onVideoLayoutChange}
            source={{
              uri: convertToProxyURL(FILE_BASE_URL + uri),
            }}
            // controls={true}
            resizeMode={resizeMod ? "cover" : "contain"}
            useTextureView
            selectedVideoTrack={{
              type: "resolution",
              value: 360,
            }}
          />
          <TouchableNativeFeedback>
            {mute ? (
              <TouchableOpacity
                style={{
                  flex: 1,
                  position: "absolute",
                  bottom: 25,
                  right: 25,
                  padding: 5,
                  backgroundColor: "#fff",
                  borderRadius: 100,
                  opacity: 0.8,
                }}
                onPress={() => {
                  dispatch(setmute(false));
                }}
              >
                <FastImage
                  source={imagePath.volumeOff}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  dispatch(setmute(true));
                }}
                style={{
                  flex: 1,
                  position: "absolute",
                  bottom: 25,
                  right: 25,
                  padding: 5,
                  backgroundColor: "#fff",
                  borderRadius: 100,
                  opacity: 0.8,
                }}
              >
                <FastImage
                  source={imagePath.volumeOn}
                  style={{ width: 18, height: 18 }}
                />
              </TouchableOpacity>
            )}
          </TouchableNativeFeedback>
        </TouchableOpacity>
      </Animated.View>
    </>
  );

  // return (
  //   <View style={{flex: 1}}>
  //     {proxyUrl && (
  //       <Video
  //         paused={isLoaded}
  //         onLoad={() => setLoading(true)}
  //         disableFocus={true}
  //         playInBackground={false}
  //         playWhenInactive={false}
  //         onProgress={e => {
  //           if (isLoaded) {
  //             console.log('onProgressonProgress');
  //             setLoading(false);
  //           }
  //         }}
  //         ref={videoRef}
  //         repeat={false}
  //         style={styles.video}
  //         // onLayout={onVideoLayoutChange}
  //         source={{uri: proxyUrl}}
  //         controls={true}
  //         resizeMode="contain"
  //         useTextureView
  //         selectedVideoTrack={{
  //           type: 'resolution',
  //           value: 480,
  //         }}
  //       />
  //     )}
  //     <View style={styles.container}>
  //       <Pressable style={styles.playContainer} onPress={openModal}>
  //         <Image style={styles.img} source={imagePath.play} />
  //       </Pressable>
  //     </View>
  //   </View>
  // );
};

export default React.memo(VideoItem);

const styles = StyleSheet.create({
  video: {
    width: 400,
    height: 200,
    marginVertical: 10,
  },
  container: {
    backgroundColor: colors.black,
    width: width,
    alignSelf: "center",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  playContainer: {
    backgroundColor: colors.white,
    borderRadius: 50,
    overflow: "hidden",
  },
  img: { backgroundColor: colors.white, width: 100, height: 100 },
});
