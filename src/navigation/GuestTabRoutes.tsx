import React from 'react';
import {createBottomTabNavigator, BottomTabBar} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, View} from 'react-native';
import Home from '../ui/home/Home';
import navigationString from '../config/navigationString';
import imagePath from '../config/imagePath';
import colors from '../theme/colors';
import {moderateScaleVertical} from '../theme/responsiveSize';
import Login from '../ui/login/Login';

const BottomTab = createBottomTabNavigator();

// let backClickCount = 0;

const GuestTabRoutes = _ => {
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
        component={Login}
        options={{
          unmountOnBlur: true,
          tabBarStyle: {
            display: 'none',
          },
          tabBarIcon: ({focused}) => {
            return (
              <View style={{paddingHorizontal: 0 ? 5 : 0}}>
                <Image source={focused ? imagePath.tab2_s : imagePath.tab2_u} style={styles.homeImg} />
                {/* {!!messageTabCount && <Text style={styles.botContainer} />} */}
              </View>
            );
          },
        }}
      />
      <BottomTab.Screen
        name={navigationString.POST_FEED}
        component={Login}
        initialParams={{
          type: '',
        }}
        options={{
          unmountOnBlur: true,
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
        component={Login}
        options={{
          unmountOnBlur: true,
          tabBarStyle: {
            display: 'none',
          },
          tabBarIcon: ({focused}) => {
            return (
              <View style={{padding: 0 ? 3 : 0}}>
                <Image source={focused ? imagePath.tab4_s : imagePath.tab4_u} style={styles.homeImg} />
                {/* {!!notificationTabCount && <Text style={styles.botContainer}>{notificationTabCount}</Text>} */}
              </View>
            );
          },
        }}
      />
      <BottomTab.Screen
        name={navigationString.PROFILE}
        component={Login}
        options={{
          unmountOnBlur: true,
          tabBarStyle: {
            display: 'none',
          },
          tabBarIcon: () => {
            return (
              <>
                <Image source={imagePath.placeholder} style={{...styles.homeImg, borderWidth: 1, borderColor: colors.black, borderRadius: 5}} />
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
  },

  profileIcon: {width: 30, height: 30, borderRadius: 8, borderWidth: 1},
});

export default GuestTabRoutes;
