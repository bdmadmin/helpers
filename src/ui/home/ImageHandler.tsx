import React, { memo } from "react";
import { useSelector } from "react-redux";
import { width } from "../../theme/responsiveSize";
import { Image, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { FILE_BASE_URL } from "../../config/constant";
import colors from "../../theme/colors";

const ImageHandler = ({ name, onPress, imageCurrentIndex }: any) => {
  const changeWidth = useSelector(
    (state: any) => state.audioVideoList.changeWidth
  );
  const [ImgHeight, setImgHeight] = React.useState(null);
  const [resizeMod, setresizeMod] = React.useState(false);

  Image.getSize(`${FILE_BASE_URL}${name}`, (widthh, height) => {
    let newWidth = changeWidth ? changeWidth : width;
    let hei: any = (height / widthh) * newWidth;
    hei > newWidth && setresizeMod(true);
    setImgHeight(hei);
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPress()}
      style={{
        width: "100%",
        height: ImgHeight ?? 300,
        maxHeight: changeWidth ? changeWidth : width,
      }}
    >
      <FastImage
        style={{
          flex: 1,
          width: changeWidth ? changeWidth : width,
          height: undefined,
          backgroundColor: colors.white,
        }}
        resizeMode={resizeMod ? "cover" : "contain"}
        source={{ uri: `${FILE_BASE_URL}${name}` }}
      />
    </TouchableOpacity>
  );
};
export default memo(ImageHandler);
