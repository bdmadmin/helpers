import React, {ReactNode, useEffect} from 'react';
import {ColorValue, View, StatusBarStyle, DeviceEventEmitter, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '../theme/colors';
import FocusAwareStatusBar from './FocusAwareStatusBar';
import Loader from './Loader';
import notifee, {AndroidCategory, AndroidImportance, AndroidStyle, EventDetail} from '@notifee/react-native';
import {sendMessage} from '../redux/actions/home';
// import {getUserData} from '../utils/utils';

const WrapperContainer = ({
  children,
  isLoading = false,
  statusBarColor = colors.white,
  bodyColor = colors.white,
  barStyle = 'dark-content',
  removeBottomInset = false,
  translucent = false,
  removeBottomInsetActual = false,
}: {
  children?: ReactNode;
  isLoading?: boolean;
  statusBarColor?: ColorValue;
  bodyColor?: ColorValue;
  barStyle?: StatusBarStyle;
  removeBottomInset?: Boolean;
  translucent?: boolean;
  removeBottomInsetActual?: boolean;
}) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const notificationListener = DeviceEventEmitter.addListener('remotePush', remoteMessage => {
      setTimeout(() => {
        displayNotification(remoteMessage);
      }, 2000);
    });
    return () => {
      notificationListener.remove();
    };
  }, []);

  useEffect(() => {
    const sendMessageListener = DeviceEventEmitter.addListener('sendMessage', (remoteMessage: EventDetail) => {
      setTimeout(() => {
        sendMessageApi(remoteMessage);
      }, 2000);
    });
    return () => {
      sendMessageListener.remove();
    };
  });

  const sendMessageApi = async (sendMessageData: EventDetail) => {
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

  const displayNotification = async (remoteMessage: any) => {
    if (remoteMessage?.data?.type === '3') {
      // const chatData = JSON.parse(remoteMessage?.data?.chat);
      // const postData = JSON.parse(remoteMessage?.data?.post);
      // const user = await getUserData();
      // const x = await notifee.getDisplayedNotifications();
      // const createDisplayId = chatData?.postId + '' + chatData?.sender?.id;
      // const filter = x.find(item => item.id === createDisplayId);
      // let messages = [];
      // if (filter) {
      //   messages = filter.notification.android?.style?.messages.concat({
      //     text: remoteMessage?.data?.message,
      //     timestamp: new Date().valueOf(),
      //     person: {
      //       name: chatData?.sender?.firstName,
      //     },
      //   });
      // } else {
      //   messages = [
      //     {
      //       text: remoteMessage?.data?.message,
      //       timestamp: new Date().valueOf(),
      //       person: {
      //         name: chatData?.sender?.firstName,
      //       },
      //     },
      //   ];
      // }
      // const channelId = await notifee.createChannel({
      //   id: createDisplayId,
      //   name: 'Message Channel',
      //   importance: AndroidImportance.HIGH,
      //   badge: true,
      //   bypassDnd: true,
      // });
      // await notifee.setNotificationCategories([
      //   {
      //     id: 'messageIOS',
      //     allowInCarPlay: true,
      //     actions: [
      //       {
      //         id: 'reply',
      //         title: 'Reply',
      //         input: {
      //           placeholderText: 'Send a message...',
      //           buttonText: 'Send Now',
      //         },
      //       },
      //     ],
      //   },
      // ]);
      // console.log('chatDatachatData', postData);
      // notifee?.displayNotification({
      //   id: createDisplayId,
      //   title: `${chatData?.sender?.firstName + ' ' + chatData?.sender?.lastName} send you a message`,
      //   body: chatData?.message,
      //   subtitle: `On Post ${postData?.description}`,
      //   data: {
      //     roomId: chatData?.room,
      //     receiverId: chatData?.sender?.id,
      //     postId: chatData?.postId,
      //   },
      //   android: {
      //     channelId: channelId,
      //     color: colors.themeColor,
      //     lights: ['red', 300, 600],
      //     showTimestamp: true,
      //     pressAction: {
      //       id: 'default',
      //       launchActivity: 'default',
      //     },
      //     // asForegroundService: true,
      //     style: {
      //       type: 3,
      //       person: {
      //         name: user?.firstName + ' ' + user?.lastName,
      //       },
      //       title: postData?.description,
      //       messages: messages,
      //     },
      //     actions:
      //       remoteMessage?.data?.requestStatus === '1'
      //         ? [
      //             {
      //               title: 'Reply',
      //               icon: 'https://my-cdn.com/icons/reply.png',
      //               pressAction: {
      //                 id: 'reply',
      //               },
      //               input: {
      //                 allowFreeFormInput: true, // set to false
      //                 choices: ['Yes', 'No', 'Maybe'],
      //                 placeholder: 'Reply to Sarah...',
      //                 editableChoices: true,
      //                 allowGeneratedReplies: true,
      //               },
      //             },
      //           ]
      //         : [],
      //   },
      //   ios: {
      //     categoryId: 'messageIOS',
      //   },
      // });
    } else if (remoteMessage?.data?.type === '2' || remoteMessage?.data?.type === '1') {
      console.log('lineslineslineslineslines', remoteMessage);
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

      if (Platform.OS === 'ios') {
        await notifee.setNotificationCategories([
          {
            id: 'lines',
            summaryFormat: 'You have %u+ unread messages from %@.',
          },
        ]);
      }

      await notifee?.displayNotification({
        id: remoteMessage?.data?.postId?.toString(),
        body: remoteMessage?.data?.message,
        data: remoteMessage?.data,
        android: {
          channelId,
          color: colors.themeColor,
          category: AndroidCategory.SOCIAL,
          groupId: 'personal',
          style: {
            type: AndroidStyle.INBOX,
            lines: [remoteMessage?.data?.message, ...hasData],
            group: true,
          },
        },
        ios: {
          summaryArgument: 'lines',
          critical: true,
        },
      });
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
      await notifee?.displayNotification({
        id: remoteMessage?.data?.postId?.toString(),
        title: remoteMessage?.data?.title,
        body: remoteMessage?.data?.message,
        data: remoteMessage?.data,
        android: {
          pressAction: {
            launchActivity: 'default',
            id: 'default',
          },
          channelId,
          color: colors.themeColor,
          category: AndroidCategory.SOCIAL,
          groupId: 'personal',
          style: {
            type: AndroidStyle.INBOX,
            lines: [remoteMessage?.data?.message, ...hasData],
            group: true,
          },
        },
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: statusBarColor,
        paddingTop: removeBottomInset ? 0 : insets.top,
        paddingBottom: Platform.OS === 'ios' ? 0 : removeBottomInset ? 0 : insets.bottom,
      }}>
      <FocusAwareStatusBar translucent={translucent} backgroundColor={statusBarColor} barStyle={barStyle} />
      <View style={{backgroundColor: bodyColor, flex: 1}}>{children}</View>
      <Loader isLoading={isLoading} />
    </View>
  );
};

export default WrapperContainer;
