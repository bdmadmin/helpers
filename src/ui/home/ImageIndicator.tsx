import { View, Text, StyleSheet } from "react-native";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { width } from "../../theme/responsiveSize";
import { Animated } from "react-native";

const ImageIndicator = ({ onlyPhotos, scrollX }: any) => {
  const changeWidth = useSelector(
    (state: any) => state.audioVideoList.changeWidth
  );
  return (
    <View>
      {onlyPhotos?.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            height: 64,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: -10,
            left: changeWidth
              ? changeWidth / 2 - (16 * onlyPhotos?.length) / 1.5
              : width / 2 - (16 * onlyPhotos?.length) / 1.5,
          }}
        >
          {onlyPhotos?.map((_: any, i: number) => {
            let newwidth = changeWidth ? changeWidth : width;
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 8, 8],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                style={[styles.dot, { width: dotWidth, opacity: opacity }]}
                key={i.toString()}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export default memo(ImageIndicator);
const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
});
