import { View, Text, ActivityIndicator } from "react-native";
import React, { memo } from "react";
import ImageZoom from "../../components/ImageZoom";
import colors from "../../theme/colors";
import ImageViewer from "react-native-image-zoom-viewer";

const ImageView = ({ route, navigation }) => {
  const { images, index } = route.params;
  console.log("images ", images);
  return (
    // <View style={{ flex: 1 }}>
      <ImageViewer
        loadingRender={() => (
          <ActivityIndicator color={colors.themeColor} size="large" />
        )}
        imageUrls={images}
        index={index ? index : 0}
        enableSwipeDown={true}
        onSwipeDown={() => navigation.goBack()}
        swipeDownThreshold={100}
        doubleClickInterval={300}
        saveToLocalByLongPress={false}
        pageAnimateTime={250}
      />
    // </View>
  );
};

export default memo(ImageView);
