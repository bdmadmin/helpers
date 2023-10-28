import * as React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  Animated,
  Image,
} from "react-native";
import FastImage from "react-native-fast-image";
import {
  FILE_BASE_URL,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../config/constant";
import colors from "../../theme/colors";
import {
  height,
  moderateScaleVertical,
  width,
} from "../../theme/responsiveSize";
import AudioMediaHandler from "./AudioMediaHandler";
import VideoItem from "./VideoItem";
import Video from "react-native-video";
import { useDispatch, useSelector } from "react-redux";
import convertToProxyURL from "react-native-video-cache";
import navigationString from "../../config/navigationString";
import NavigationService from "../../service/NavigationService";
import imagePath from "../../config/imagePath";
import {
  setmute,
  setpause,
} from "../../redux/reducer/AudioVideoList/audioVideoList";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import FeedVedio from "../../components/FeedVedio";
import Sliders from "../../components/Sliders";
import ImageHandler from "./ImageHandler";
import ImageIndicator from "./ImageIndicator";

interface MultiImageSliderProps {
  data: Array<unknown>;
  outerIndex: number;
}

const MultiImageSlider = (_: MultiImageSliderProps) => {
  const { data, outerIndex } = _;

  const ImageHandlerMemo = React.memo(ImageHandler);
  const AudioHandler = React.memo(AudioMediaHandler);
  let onlyPhotos: any = [];
  const isVideoPost:any =
    data.length > 1
      ? ""
      : data.find((item: any) => item?.mediaType === "videos");
  const isAudioPost: any = data.find(
    (item: any) => item?.mediaType === "audios"
  );
  

  const pause = useSelector((state: any) => state.audioVideoList.pause);
  const changeWidth = useSelector(
    (state: any) => state.audioVideoList.changeWidth
  );
  let ChangeWidth = width;


  const [imageCurrentIndex, setimageCurrentIndex] = React.useState(0);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const viewConfig = React.useRef({
    viewAreaCoveragePercentThredshold: 50,
  }).current;
  const viewableItemChanged = React.useRef((viewableItem:any) => {
    if (viewableItem.viewableItems[0] != undefined) {
      setimageCurrentIndex(viewableItem.viewableItems[0].index);
    }
  });

  React.useEffect(() => {
    const focus = navigation.addListener("focus", () => {
      dispatch(setpause(false));
    });
    return focus;
  }, [navigation]);
  React.useEffect(() => {
    const blur = navigation.addListener("blur", () => {
      {
        pause == false && dispatch(setpause(true));
      }
    });
    return blur;
  }, [navigation]);

  if (data.length >= 1) {
    onlyPhotos = data.filter((item: any) => item?.mediaType === "image");
  }

  const RenderItem = React.useMemo(() => {
    return {
      image: (image: string, index: number) => {
        let li: Array<[]> = [];
        onlyPhotos?.forEach((e: any) => {
          if (Platform.OS == "ios") {
            li.push({ url: FILE_BASE_URL + e.name });
          } else {
            li.push({ url: convertToProxyURL(FILE_BASE_URL + e.name) });
          }
        });
        return (
          <>
            <ImageHandlerMemo
              name={image}
              imageCurrentIndex={imageCurrentIndex}
              onPress={() => {
                NavigationService.navigate(navigationString.IMAGE_VIEW, {
                  images: li,
                  index: index,
                });
              }}
            />
            
          </>
        );
      },
    };
  }, [ImageHandlerMemo]);

  const renderMultiImage = React.useCallback(
    ({ item, index }: any) => {
      return (
        <>{item?.mediaType && RenderItem[item?.mediaType](item?.name, index)}</>
      );
    },
    [changeWidth]
  );

  if (isVideoPost) {
    return <VideoItem uri={isVideoPost?.name} outerIndex={outerIndex}/>
  }

  if (isAudioPost != undefined && isAudioPost.name) {
    return (
      <View style={{ marginVertical: moderateScaleVertical(20) }}>
        <Sliders url={isAudioPost?.name} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
      // estimatedItemSize={100}
        bounces={false}
        horizontal
        initialNumToRender={5}
        pagingEnabled
        renderItem={renderMultiImage}
        data={onlyPhotos}
        extraData={onlyPhotos}
        decelerationRate={"fast"}
        keyExtractor={(_, index) => index.toString()}
        onViewableItemsChanged={viewableItemChanged.current}
        viewabilityConfig={viewConfig.current}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
      />
      {onlyPhotos&&<ImageIndicator scrollX={scrollX} onlyPhotos={onlyPhotos}/>}
    </View>
  );
};

export default React.memo(MultiImageSlider);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 10,
  },
  normalImage: { width: width, height: width, backgroundColor: colors.e5 },
  
});
