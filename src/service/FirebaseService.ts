import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import notifee, {EventType} from '@notifee/react-native';
import {store} from '../redux/store';
import {messageTabCount, notificationTabCount} from '../redux/reducer/DotSlice/dotSlice';
import {DeviceEventEmitter} from 'react-native';
import NavigationService from './NavigationService';
import navigationString from '../config/navigationString';

const {dispatch} = store;

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

export const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    try {
      const x = await messaging().getToken();
      if (x) {
        await AsyncStorage.setItem('fcmToken', x);
      }
      return x;
    } catch (error) {
      console.log(error, 'error in fcmToken');
    }
  }
  return fcmToken;
};

export const createNotificationListener = async () => {
  messaging().onNotificationOpenedApp(async (remoteMessage: any) => {
    console.log('Notification caused app to open from background state bla bla:', remoteMessage);
  });

  let timeOut: any = null;
  messaging().onMessage(async remoteMessage => {
    if (timeOut == null) {
      try {
        timeOut = setTimeout(() => {
          timeOut = null;
          saveNotificationData(remoteMessage);
          localDisplayNotification(remoteMessage);
        }, 4000);
      } catch (error) {console
        .log('error===>>>>>>>', error);
      }
    } else {
      timeOut = null;
      clearTimeout(timeOut);
    }
  });

  const saveNotificationData = async (remoteMessage: any) => {
    if (remoteMessage?.data?.type === '3') {
      await AsyncStorage.setItem('messageCount', 'true');
      dispatch(messageTabCount({messageTabCount: 1}));
    } else {
      dispatch(notificationTabCount({notificationTabCount: 1}));
      await AsyncStorage.setItem('notificationCount', 'true');
    }
  };

  // Call When user click notification when app is in background
  messaging()
    .getInitialNotification()
    .then((remoteMessage: any) => {
      if (remoteMessage) {
        console.log('remote message', remoteMessage);
      }
    });

  /**
   * When user click on notification when user is in forground
   */
  notifee.onForegroundEvent(({type, detail}) => {
    console.log('type', type);
    console.log('detail', detail);
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        onPressForeground(type, detail);
        break;
      case 2:
        DeviceEventEmitter.emit('sendMessage', detail);
    }
  });

  // notifee.onBackgroundEvent(async ({type, detail, headless}) => {
  //   switch (type) {
  //     case EventType.DISMISSED:
  //       console.log('User dismissed notification', detail.notification);
  //       break;
  //     case EventType.PRESS:
  //       onPressForeground(type, detail);
  //       break;
  //     case 2:
  //       DeviceEventEmitter.emit('sendMessage', detail.notification);
  //   }
  // });

  const onPressForeground = (type, detail) => {
    setTimeout(() => {
      NavigationService.navigate(navigationString.NOTIFICATION);
    }, 2000);
  };
};

messaging().onTokenRefresh((fcmToken: string) => {
  console.log('New token refresh: ', fcmToken);
});

async function localDisplayNotification(remoteMessage: any) {
  DeviceEventEmitter.emit('remotePush', remoteMessage);
}
