/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, Platform, Modal} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import {Provider} from 'react-redux';
import {withErrorBoundary} from './src/components/ExceptionHandler';
import Routes from './src/navigation/Routes';
import {store} from './src/redux/store';
import {moderateScale, moderateScaleVertical, textScale} from './src/theme/responsiveSize';
import NetInfo from '@react-native-community/netinfo';
import fontFamily from './src/theme/fontFamily';
import colors from './src/theme/colors';
import commonStyles from './src/utils/commonStyles';
import {createNotificationListener, requestUserPermission} from './src/service/FirebaseService';
import ReportBottomSheet from './src/components/ReportBottomSheet';
import {updateVersion} from './src/redux/actions/home';
import {View} from 'react-native';
import Config from 'react-native-config';
import {Linking} from 'react-native';
import {ANDROID_URL, IPHONE_URL} from './src/config/constant';
import { UIManager } from 'react-native';

const App = () => {
  const [isNotConnected, setConnection] = useState(false);
  const [isModalVisible, setModalVisible] = useState({
    isModalVisible: false,
    isForceUpdate: false,
  });

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const VERSION:any = Config.VERSION;

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setConnection(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const init = async () => {
    requestUserPermission();
    createNotificationListener();
    checkIsUpdateAvaible();
  };

  const checkIsUpdateAvaible = async () => {
    try {
      console.log("VERSION====",VERSION)
      const x:any = await updateVersion(Platform.OS === 'android' ? '1' : '2');
      console.log("x?.version===",x)
      if (VERSION < x?.version) {
        if (x?.force_update === '1') {
          setModalVisible({
            isModalVisible: true,
            isForceUpdate: true,
          });
        } else {
          setModalVisible({
            isModalVisible: true,
            isForceUpdate: false,
          });
        }
      }
    } catch (error) {}
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Routes />
      </SafeAreaProvider>
      {isNotConnected && <Text style={styles.notInternet}>{'No Internet connected'}</Text>}
      <FlashMessage
        titleStyle={{
          marginRight: moderateScale(5),
          fontFamily: fontFamily.medium,
          fontSize: textScale(16),
        }}
        position="top"
        floating
      />
      <ReportBottomSheet />
      <Modal transparent visible={isModalVisible.isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.whiteContainer}>
            <Text style={{...commonStyles.fontBold16}}>{'Update Now'}</Text>
            <Text style={{...commonStyles.fontSize14Black, marginTop: moderateScaleVertical(10)}}>{'Please update your app from the latest version'}</Text>
            <View style={{flexDirection: 'row', alignItems: 'flex-end', flex: 1, justifyContent: 'space-around', width: '100%', bottom: 10}}>
              <Text onPress={() => Linking.openURL(Platform.OS === 'ios' ? IPHONE_URL : ANDROID_URL)} style={{...commonStyles.fontBold16, borderWidth: 1, padding: 10, flex: 0.4, textAlign: 'center'}}>
                {'Update'}
              </Text>
              {!isModalVisible?.isForceUpdate && (
                <Text onPress={() => setModalVisible({isForceUpdate: false, isModalVisible: false})} style={{...commonStyles.fontSize16, borderWidth: 1, padding: 10, flex: 0.4, textAlign: 'center'}}>
                  {'Cancel'}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  notInternet: {
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
    top: 30,
    paddingVertical: 15,
    backgroundColor: colors.themeColor,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 1,
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    ...commonStyles.fontBold16,
    color: colors.white,
  },

  modalContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  whiteContainer: {borderWidth: 1, backgroundColor: colors.white, alignSelf: 'center', padding: 10, width: '90%', height: 160, borderRadius: 10, alignItems: 'center', elevation: 10},
});

export default withErrorBoundary(App, 'App');
