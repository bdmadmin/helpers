import React, { useRef, useEffect, useState, memo, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Text,
  Platform,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import { FILE_BASE_URL } from "../config/constant";
import { moderateScale, width } from "../theme/responsiveSize";
import imagePath from "../config/imagePath";
import convertToProxyURL from "react-native-video-cache";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import Sound from "react-native-sound";
import colors from "../theme/colors";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const Sliders = ({ url,chat }: { url: string,chat:Boolean }) => {
  const numberOfBars = chat?30:50;
  const changeWidth = useSelector(
    (state: any) => state.audioVideoList.changeWidth
  );
  const newWidth = useMemo(() => {
    if (changeWidth != 0) {
      return changeWidth;
    } else {
      return width;
    }
  }, []);

  const audioFilePath =
    Platform.OS == "ios"
      ? FILE_BASE_URL + url
      : convertToProxyURL(FILE_BASE_URL + url);

  const animationValue = useRef(new Animated.Value(0)).current;
  animationValue.addListener(() => {
    return;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [playingIos, setplayingIos] = useState(false);
  const pause = useSelector((state: any) => state.audioVideoList.pause);
  const sound = useRef<any>(null);

  useEffect(() => {
      sound.current?.pause();
      setplayingIos(false);
  }, [pause]);
  useEffect(() => {
    sound.current = new Sound(audioFilePath, null, (error) => {
      if (error) {
        console.log("errrrr==", audioFilePath);
      }
      Sound.setCategory("Playback");
      Sound.setMode("SpokenAudio");
      let duration = parseFloat(sound.current.getDuration()) * 1000;
      setTotalTime(duration);
    });

    return () => {
      sound.current.release();
    };
  }, [url]);

  const updateAnimationIos = () => {
    sound.current.getCurrentTime((sec: number, isPlay: boolean) => {
      const currentTime = sec * 1000;
      if (isPlay) {
        animationValue.setValue((currentTime / totalTime) * numberOfBars);
        setCurrentTime(currentTime);
        requestAnimationFrame(updateAnimationIos);
      }
    });
  };
  const formatTime = (timeInSeconds: any) => {
    const minutes = Math.floor(timeInSeconds / 1000 / 60);
    const seconds = Math.floor(timeInSeconds / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const renderBars = () => {
    const bars = [];

    for (let i = 0; i < numberOfBars; i++) {
      const barHeight = getBarHeight(i);
      bars.push(
        <AnimatedRect
          key={i}
          x={i * 5.5 + 5}
          y={chat?"20%":"10%"}
          width="4"
          height={barHeight}
          fill={getBarColor(i)}
          onPress={() => handleBarPress(i)}
        />
      );
    }

    return bars;
  };

  const getBarHeight = (index: number) => {
    return animationValue.interpolate({
      inputRange: [
        index - 3,
        index - 2,
        index - 1,
        index,
        index + 1,
        index + 2,
        index + 3,
      ],
      outputRange: ["1%", "30%", "60%", "95%", "60%", "30%", "1%"],
      extrapolate: "identity",
      extrapolateLeft: "extend",
      extrapolateRight: "extend",
    });
  };

  const getBarColor = (index: number) => {
    return animationValue.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [colors.d9, colors.blue_light, colors.blue_light],
      extrapolate: "clamp",
    });
  };

  const handleBarPress = (barIndex: number) => {
    const targetTime = (barIndex / numberOfBars) * totalTime;
    sound.current.setCurrentTime(targetTime / 1000);
    animationValue.setValue((targetTime / totalTime) * numberOfBars);
    setCurrentTime(targetTime);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            styles.timeText,
            {
              width:chat?newWidth / 4.5:
                newWidth > 500
                  ? newWidth / 6
                  : newWidth < 350
                  ? newWidth / 7
                  : newWidth / 4,
            },
          ]}
        >
          {formatTime(currentTime) + "/" + formatTime(totalTime)}
        </Text>

        <View
          style={[
            styles.visualizer,
            {
              height: chat?20:40,
              width: chat?newWidth / 2.5:newWidth > 500 ? newWidth / 2.4 : newWidth / 1.7,
              flexDirection: "column",
            },
          ]}
        >
          <Svg
            width="100%"
            height="100%"
            style={{ transform: [{ scaleY: -1 }], marginBottom: -8 }}
          >
            {renderBars()}
          </Svg>
          <Svg width="100%" height="100%">
            {renderBars()}
          </Svg>
        </View>

        <TouchableOpacity
          style={[
            styles.controls,
            { width: chat?newWidth / 9:newWidth > 500 ? newWidth / 10 : newWidth / 11 },
          ]}
          onPress={() => {
            if (sound.current.isPlaying()) {
              sound.current.pause();
              setplayingIos(false);
            } else {
              sound.current.play((res: boolean) => {
                if (res) {
                  setplayingIos(false);
                }
              });
              setplayingIos(true);
              updateAnimationIos();
            }
          }}
        >
          {playingIos ? (
            <FastImage
              style={{
                marginHorizontal: moderateScale(10),
                width: 25,
                height: 25,
              }}
              source={imagePath.fi_pause_circle}
            />
          ) : (
            <FastImage
              style={{
                marginHorizontal: moderateScale(10),
                width: 25,
                height: 25,
              }}
              source={imagePath.play}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingLeft: 10,
  },
  visualizer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  timeText: {
    fontSize: 16,
    color: "black",
  },
  controls: {},
});

export default memo(Sliders);
