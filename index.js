/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {AndroidCategory, AndroidImportance, AndroidStyle, EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import navigationString from './src/config/navigationString';
import NavigationService from './src/service/NavigationService';
import colors from './src/theme/colors';
import {getUserData} from './src/utils/utils';
import {sendMessage} from './src/redux/actions/home';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

notifee.onBackgroundEvent(async ({type, detail, headless}) => {
  switch (type) {
    case EventType.DISMISSED:
      break;
    case EventType.PRESS:
      onPressForeground(type, detail);
      break;
    case 2:
      sendMessageApi(detail);
  }
});

const sendMessageApi = async sendMessageData => {
  const formData = new FormData();
  formData.append('message', sendMessageData?.input);
  const data = sendMessageData.notification?.data;
  if (data?.roomId) {
    formData.append('room', data?.roomId);
  }
  if (data?.postId) {
    formData.append('receiverId', data?.receiverId);
    formData.append('postId', data?.postId);
  }
  await sendMessage(formData);
};

const onPressForeground = (type, detail) => {
  console.log("notificsation detail=-=-==-=====",detail?.notification?.title)
  const Message = detail?.notification?.title.split(" ")
  setTimeout(() => {
    if (Message[Message.length-1] == 'message') {
      NavigationService.navigate(navigationString.MESSAGE);
      return;
    }
    NavigationService.navigate(navigationString.NOTIFICATION);
  }, 2000);
};

messaging().setBackgroundMessageHandler(async message => {
  displayNotification(message);
});

const displayNotification = async remoteMessage => {
  try {
    if (remoteMessage?.data?.type === '3') {
      const chatData = JSON.parse(remoteMessage?.data?.chat);
      const postData = JSON.parse(remoteMessage?.data?.post);
      const user = await getUserData();
      const x = await notifee.getDisplayedNotifications();
      const createDisplayId = chatData?.postId + '' + chatData?.sender?.id;
      const filter = x.find(item => item.id === createDisplayId);
      let messages = [];

      if (filter) {
        messages = filter.notification.android?.style?.messages.concat({
          text: remoteMessage?.data?.message,
          timestamp: new Date().valueOf(),
          person: {
            name: chatData?.sender?.firstName,
          },
        });
      } else {
        messages = [
          {
            text: remoteMessage?.data?.message,
            timestamp: new Date().valueOf(),
            person: {
              name: chatData?.sender?.firstName,
            },
          },
        ];
      }

      const channelId = await notifee.createChannel({
        id: createDisplayId,
        name: 'Message Channel',
        importance: AndroidImportance.HIGH,
        badge: true,
        bypassDnd: true,
      });

      await notifee.setNotificationCategories([
        {
          id: 'message',
          allowInCarPlay: true,
          actions: [
            {
              id: 'reply',
              title: 'Reply',
              input: {
                placeholderText: 'Send a message...',
                buttonText: 'Send Now',
              },
            },
          ],
        },
      ]);

      console.log('====================================');
      console.log('chatData', JSON.stringify(chatData));
      console.log('====================================');

      notifee?.displayNotification({
        id: createDisplayId,
        title: `${chatData?.sender?.firstName + ' ' + chatData?.sender?.lastName} send you a message`,
        body: chatData?.message ? chatData?.message : chatData?.mediaType === 1 ? 'Image.jpg' : 'Videp.mp4',
        subtitle: `On Post ${postData?.description}`,
        data: {
          roomId: chatData?.room,
          receiverId: chatData?.sender?.id,
          postId: chatData?.postId,
        },
        android: {
          channelId: channelId,
          color: colors.themeColor,
          lights: ['red', 300, 600],
          showTimestamp: true,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          // asForegroundService: true,
          style: {
            type: 3,
            person: {
              name: user?.firstName + ' ' + user?.lastName,
            },
            title: postData?.description,
            messages: messages,
          },
          actions:
            remoteMessage?.data?.requestStatus === '1'
              ? [
                  {
                    title: 'Reply',
                    icon: 'https://my-cdn.com/icons/reply.png',
                    pressAction: {
                      id: 'reply',
                    },
                    input: {
                      allowFreeFormInput: true, // set to false
                      choices: ['Yes', 'No', 'Maybe'],
                      placeholder: 'Reply to Sarah...',
                      editableChoices: true,
                      allowGeneratedReplies: true,
                    },
                  },
                ]
              : [],
        },
        ios: {
          categoryId: 'message',
        },
      });
    } else if (remoteMessage?.data?.type === '2' || remoteMessage?.data?.type === '1') {
      const x = await notifee.getDisplayedNotifications();
      const filter = x.find(item => item.id === remoteMessage?.data?.postId?.toString());
      let hasData = [];
      if (filter) {
        hasData = filter?.notification?.android?.style?.lines ?? [];
      }
      const channelId = await notifee.createChannel({
        id: remoteMessage?.data?.postId?.toString(),
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        badge: true,
        bypassDnd: true,
      });

      await notifee.setNotificationCategories([
        {
          id: 'likeDislike',
          allowAnnouncement: true,
          summaryFormat: 'Post Like',
        },
      ]);

      await notifee?.displayNotification({
        id: remoteMessage?.data?.postId?.toString(),
        body: remoteMessage?.data?.message,
        data: remoteMessage?.data,
        android: {
          channelId,
          color: colors.themeColor,
          category: AndroidCategory.SOCIAL,
          pressAction: {
            id: 'default',
          },
          style: {
            type: AndroidStyle.INBOX,
            lines: [remoteMessage?.data?.message, ...hasData],
            group: true,
            title: 'Post Like',
          },
          showTimestamp: true,
        },
        ios: {
          categoryId: 'likeDislike',
        },
      });
    } else if (remoteMessage?.data?.requestStatus === '0') {
    } else if (remoteMessage?.data?.type === '4') {
      const x = await notifee.getDisplayedNotifications();
      const filter = x.find(item => item.id === remoteMessage?.data?.postId?.toString());
      let hasData = [];
      if (filter) {
        hasData = filter?.notification?.android?.style?.lines ?? [];
      }
      const channelId = await notifee.createChannel({
        id: remoteMessage?.data?.postId?.toString(),
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        badge: true,
        bypassDnd: true,
      });

      await notifee.setNotificationCategories([
        {
          id: 'emergencyPost',
          allowAnnouncement: true,
          summaryFormat: 'Emergency Post',
        },
      ]);

      await notifee?.displayNotification({
        id: remoteMessage?.data?.postId?.toString(),
        title: remoteMessage?.data?.title,
        body: remoteMessage?.data?.message,
        data: remoteMessage?.data,
        android: {
          channelId,
          color: colors.themeColor,
          category: AndroidCategory.SOCIAL,
          groupId: 'personal',
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          style: {
            type: AndroidStyle.INBOX,
            lines: [remoteMessage?.data?.message, ...hasData],
            group: true,
          },
        },
        ios: {
          categoryId: 'emergencyPost',
          critical: true,
        },
      });
    }
  } catch (error) {
    console.log('====================================');
    console.log('error', error);
    console.log('====================================');
  }
};

AppRegistry.registerComponent(appName, () => App);
