import React from "react";
import navigationString from "../config/navigationString";
import * as screens from "../ui/index";
import TabRoutes from "./TabRoutes";
import { TransitionPresets } from "@react-navigation/stack";
import colors from "../theme/colors";
// import BottomTabBarRoutes from './BottomTabBar';

const header = { headerShown: false };
export default function (Stack: any) {
  return (
    <>
      <Stack.Screen
        name={navigationString.TAB_ROUTES}
        component={TabRoutes}
        options={header}
      />
      <Stack.Screen
        name={navigationString.SETTING}
        component={screens.Setting}
        options={header}
      />
      <Stack.Screen
        name={navigationString.STORIES_SCREEN}
        component={screens.StoriesSlide}
        options={header}
      />
      <Stack.Screen
        name={navigationString.EDIT_PROFILE}
        component={screens.EditProfile}
        options={header}
      />
      <Stack.Screen
        name={navigationString.CHAT}
        component={screens.Chat}
        options={header}
      />
      <Stack.Screen
        name={navigationString.VISION_CAMERA}
        component={screens.VisionCamera}
        options={header}
      />
      <Stack.Screen
        name={navigationString.OTHER_USER_PROFILE}
        component={screens.OtherUserDetail}
        options={header}
      />
      <Stack.Screen
        name={navigationString.POST_TYPE}
        component={screens.PostType}
        options={header}
      />
      <Stack.Screen
        name={navigationString.HELP_OR_DONAR}
        component={screens.HelperOrDonarUserList}
        options={header}
      />
      <Stack.Screen
        name={navigationString.EMERGENCY_POST}
        component={screens.PostEmergencyPost}
        options={header}
      />
      <Stack.Screen
        name={navigationString.SINGLE_POST}
        component={screens.SinglePost}
        options={header}
      />
      <Stack.Screen
        name={navigationString.TAGS_FEED}
        component={screens.TagsFeed}
        options={header}
      />
      <Stack.Screen
        name={navigationString.RADIUS}
        component={screens.Radius}
        options={header}
      />
      <Stack.Screen
        name={navigationString.SEARCH}
        component={screens.GlobalSearch}
        options={header}
      />
      <Stack.Screen
        name={navigationString.PUSH_SETTING}
        component={screens.PushSetting}
        options={header}
      />
      <Stack.Screen
        name={navigationString.WEBVIEW_SCREEN}
        component={screens.WebViewScreen}
        options={header}
      />
      <Stack.Screen
        name={navigationString.POST_FEED}
        component={screens.PostFeed}
        options={header}
      />
      <Stack.Screen
        name={navigationString.WEBVIEW_PERMOTION}
        component={screens.WebViewPermotion}
        options={header}
      />
      <Stack.Screen
        name={navigationString.VIDEO_PLAYER_SCREEN}
        options={{
          animationEnabled: true,
          presentation: "modal",
          ...TransitionPresets.ModalSlideFromBottomIOS,
          cardOverlayEnabled: true,
          ...header,
        }}
        component={screens.VidepPlayerScreen}
      />
      <Stack.Screen
        name={navigationString.IMAGE_VIEW}
        options={{
          animationEnabled: true,
          presentation: "modal",
          ...TransitionPresets.ModalSlideFromBottomIOS,
          cardOverlayEnabled: true,
          title: "Image",
          headerStyle: { backgroundColor: colors.black },
          headerTitleStyle: { color: colors.offWhite },
          headerTintColor: colors.offWhite,
          headerBackTitle: () => {return null}
        }}
        component={screens.ImageViewScreen}
      />
    </>
  );
}
