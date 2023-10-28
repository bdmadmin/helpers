import * as React from "react";
import { StatusBar, Text, View } from "react-native";
import MobilePhoneUpdateModal from "../../components/MobilePhoneUpdateModal";
import WrapperContainer from "../../components/WrapperContainer";
import colors from "../../theme/colors";
import EmergencyStatus from "./EmpergencyStatus";
import FeedList from "./FeedList";
import { useUpdateLocation } from "../../hooks/useUpdateLocation";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import imagePath from "../../config/imagePath";
import ChatBot from "./ChatBot";

interface HomeProps {}

const Home = (_: HomeProps) => {
  useUpdateLocation();
  // const isFocused = useIsFocused();

  // React.useEffect(() => {
  //   StatusBar.setTranslucent(false);
  //   StatusBar.setHidden(false);
  //   StatusBar.pushStackEntry({hidden: false});
  //   StatusBar.setBarStyle('dark-content', true);
  // }, [isFocused]);

  return (
    <WrapperContainer
      removeBottomInsetActual={true}
      statusBarColor={colors.white}
    >
      <View style={{ flex: 1 }}>
        <EmergencyStatus />
        <FeedList />
      </View>
      <MobilePhoneUpdateModal />
    </WrapperContainer>
  );
};

export default Home;
