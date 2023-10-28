import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { memo } from "react";
import FastImage from "react-native-fast-image";
import imagePath from "../config/imagePath";
import colors from "../theme/colors";
import { FILE_BASE_URL } from "../config/constant";
import convertToProxyURL from "react-native-video-cache";
import NavigationService from "../service/NavigationService";
import navigationString from "../config/navigationString";
import { useAppSelector } from "../redux/store";
import { authSliceSelector } from "../redux/reducer/AuthSlice/authSlice";
import { width } from "../theme/responsiveSize";
import fontFamily from "../theme/fontFamily";

const SuggestedProfile = ({ profileList }: { profileList: Array<[]> }) => {
  const { scrollView, mainView, image, text, text2, button, buttonText } =
    styles;

  const userData = useAppSelector(authSliceSelector);
  let textLine = "Foolowed by abhinav shing and avinashdeoskar";
  let imgArray = [
    imagePath.app_icon,
    imagePath.placeholder,
    imagePath.camera,
    imagePath.facebook,
    imagePath.Book_open,
  ];

  return (
    <View style={{ paddingHorizontal: 5 }}>
      {/* <View style={styles.separator} /> */}
      <Text style={{ fontSize: 16, color: colors.black, fontWeight: "700" ,fontFamily:fontFamily.italic}}>
      Connecting life
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={scrollView}
      >
        {profileList?.map((e: any, i: number) => {
          const Join = e?.isAdmin === 1 && e?.isJoin === 0 && e?.url;
          if (userData?.id == e.id) {
            return <View key={i} />;
          }
          return (
            <View style={mainView} key={i}>
              <FastImage
                source={{
                  uri: FILE_BASE_URL + e.user.profilePic,
                }}
                style={image}
              />
              <Text style={text}>
                {e?.user.firstName} {e?.user.lastName}
              </Text>

              {e?.description != "" ? (
                <View style={{maxHeight:55,width:"100%",paddingHorizontal:5 }}>
                  <Text style={text2} >

                    {console.log("textLine.length==",e?.description.length)}
                    {console.log("e?.description.length==",e?.description)}
                    {e?.description?.length > 101
                      ? e?.description.split("").splice(0, 100).join("") + "..."
                      : e?.description
                      }
                  </Text>
                </View>
              ) : (
                <View style={{ marginTop: 10 }} />
              )}
              <TouchableOpacity
                activeOpacity={0.6}
                style={button}
                onPress={() => {
                  if (e?.isJoin == 0) {
                    NavigationService.navigate(
                      navigationString.WEBVIEW_PERMOTION,
                      {
                        url: e?.url,
                        id: userData?.id,
                      }
                    );
                  }
                }}
              >
                <Text style={buttonText}>{Join ? "Join" : "Joined"}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(SuggestedProfile);
const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mainView: {
    height: 300,
    width: 220,
    backgroundColor: "#fff",
    // elevation: 0.2,
    borderRadius: 15,
    borderWidth: 0.4,
    justifyContent: "space-evenly",
    alignItems: "center",
    marginHorizontal: 5,
  },
  image: { height: 150, width: 150, borderRadius: 100 /*borderWidth: 0.1*/ },
  text: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    opacity: 0.8,
  },
  text2: {
    paddingBottom: 10,
    // flexWrap: "wrap",
    // flexDirection: "row",
    alignSelf: "center",
    color: colors.grey,
    fontSize: 12,
  },
  button: {
    width: 200,
    height: 30,
    backgroundColor: colors.blue_light,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    // marginTop:10
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  separator: {
    backgroundColor: "#B0B0B0",
    width: width,
    height: 7,
    marginVertical: 12,
    marginLeft: -12,
  },
});
