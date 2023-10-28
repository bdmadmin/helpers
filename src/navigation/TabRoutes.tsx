import React from 'react';
import {createBottomTabNavigator, BottomTabBar} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, View, Text, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import Home from '../ui/home/Home';
import navigationString from '../config/navigationString';
import imagePath from '../config/imagePath';
import Message from '../ui/message/Message';
import Notification from '../ui/notification/Notification';
import Profile from '../ui/profile/Profile';
import colors from '../theme/colors';
import {moderateScaleVertical} from '../theme/responsiveSize';
import {PostType} from '../ui';

const BottomTab = createBottomTabNavigator();

const TabRoutes = (_: any) => {
  const userData = useSelector(state => state.authUser.authUser);
  const badges = useSelector(state => state.dotSlice);
  const {messageTabCount, notificationTabCount = 0} = badges;

  console.log('messageTabCount', messageTabCount);

  return (
    <BottomTab.Navigator
      tabBar={tabsProps => (
        <>
          <BottomTabBar style={styles.bottomStyle} {...tabsProps} />
        </>
      )}
      initialRouteName={'Feed'}
      backBehavior={'firstRoute'}
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarStyle: {},
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.black,
        tabBarHideOnKeyboard: true,
        // tabBarLabelStyle: styles.labelStyle,
      }}>
      <BottomTab.Screen
        name={navigationString.HOME}
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            return <Image source={focused ? imagePath.tab1_s : imagePath.tab1_u} style={styles.homeImg} />;
          },
        }}
      />
      <BottomTab.Screen
        name={navigationString.MESSAGE}
        component={Message}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={{paddingHorizontal: 0 ? 5 : 0}}>
                <Image source={focused ? imagePath.tab2_s : imagePath.tab2_u} style={styles.homeImg} />
                {!!messageTabCount && <Text style={styles.botContainer} />}
              </View>
            );
          },
        }}
      />
      <BottomTab.Screen
        name={navigationString.POST_TYPE}
        component={PostType}
        options={{
          unmountOnBlur: Platform.OS === 'android' ? true : false,
          tabBarStyle: {
            display: 'none',
          },
          tabBarIcon: () => {
            return <Image source={imagePath.tab3} style={styles.homeImg} />;
          },
        }}
      />
      <BottomTab.Screen
        name={navigationString.NOTIFICATION}
        component={Notification}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={{padding: 0 ? 3 : 0}}>
                <Image source={focused ? imagePath.tab4_s : imagePath.tab4_u} style={styles.homeImg} />
                {!!notificationTabCount && <Text style={styles.botContainer} />}
              </View>
            );
          },
        }}
      />
      <BottomTab.Screen
        name={navigationString.PROFILE}
        component={Profile}
        options={{
          tabBarIcon: () => {
            return (
              <>
                {userData?.profilePic ? (
                  <FastImage source={{uri: userData?.profilePic}} style={styles.profileIcon} resizeMode={'cover'} />
                ) : (
                  <Image source={imagePath.placeholder} style={{...styles.homeImg, borderWidth: 1, borderColor: colors.black, borderRadius: 5}} />
                )}
              </>
            );
          },
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 14,
  },
  addImage: {
    marginBottom: moderateScaleVertical(30),
  },
  bottomStyle: {
    elevation: 30,
    borderTopColor: 'red',
  },
  homeImg: {
    height: 24,
    width: 24,
  },
  botContainer: {
    backgroundColor: colors.error,
    width: 15,
    height: 15,
    position: 'absolute',
    borderRadius: 20,
    end: 0,
    textAlign: 'center',
    fontSize: 10,
    textAlignVertical: 'center',
    overflow: 'hidden',
  },

  profileIcon: {width: 30, height: 30, borderRadius: 8, borderWidth: 1},
});

export default TabRoutes;
