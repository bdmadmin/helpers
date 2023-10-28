import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { memo, useMemo } from "react";
import FastImage from "react-native-fast-image";
import { width } from "../../theme/responsiveSize";
import NavigationService from "../../service/NavigationService";
import navigationString from "../../config/navigationString";
import { Platform } from "react-native";
import { FILE_BASE_URL } from "../../config/constant";
import convertToProxyURL from "react-native-video-cache";

type Props = {
  media: any;
};

const ImageItem = (props: Props) => {
  const { media } = props;
  // console.log("media==", media)

  const imageView = () => {
    let setimg = new Promise(async (imgresolve, imgreject) => {
      let li: Array<[]> = [];
      if (Platform.OS == "ios") {
        media?.forEach((e: any, i: number) => {
          li.push({ url: FILE_BASE_URL+e.image });
          if (media?.length - 1 == i) {
            imgresolve(li);
          }
        });
      } else {
        media?.forEach((e: any,i:number) => {
          li.push({ url: convertToProxyURL(FILE_BASE_URL+e.image) });
          if (media?.length - 1 == i) {
            imgresolve(li);
          }
        });
      }
    });
    setimg.then((li: any) => {
      NavigationService.navigate(navigationString.IMAGE_VIEW, {
        images: li,
        index: 0,
      });
    });
  };

  const url = useMemo(() => {return FILE_BASE_URL+media[0]?.image}, [(FILE_BASE_URL+media[0]?.image)])
  return (
    <Pressable
      style={{ margin: 5, borderRadius: 7, overflow: "hidden",maxWidth:"80%" }}
      onPress={imageView}
    >
      <FastImage
        source={{ uri: url }}
        style={{ width: (75 / 100) * width, height: 260 }}
        resizeMode="cover"
      />
    </Pressable>
  );
};

export default memo(ImageItem);

const styles = StyleSheet.create({});
