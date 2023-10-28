import * as React from 'react';
import {Text, View, Image, Pressable, Platform} from 'react-native';
import WrapperContainer from '../../components/WrapperContainer';
import {moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import TextInputCustom from '../../components/TextInputCustom';
import {useDispatch, useSelector} from 'react-redux';
import {loginUserApi, updateProfile} from '../../redux/actions/auth';
import {getUserData, setUserData, showError} from '../../utils/utils';
import colors from '../../theme/colors';
import MainButton from '../../components/MainButton';
import fontFamily from '../../theme/fontFamily';
import imagePath from '../../config/imagePath';
import styles from './styles';
import FlexSBContainer from '../../components/FlexSBContainer';
import FastImage from 'react-native-fast-image';
import navigationString from '../../config/navigationString';
import {DEVICE_TYPE, T_AND_C} from '../../config/constant';
import {validateNumber} from '../../validation/validations';
import strings from '../../config/lang';
import useSocialLogin from '../../hooks/useSocialLogin';
import {updateAuthUserData} from '../../redux/reducer/AuthSlice/authSlice';
import {User} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {locationPermission} from '../../utils/helper';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {getFcmToken} from '../../service/FirebaseService';
import BackButton from '../../components/BackButton';

const Login = ({navigation}: any) => {
  const [number, setMobileNumber] = React.useState<string | undefined>();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [showGif, setShowGif] = React.useState<boolean>(false);
  const {googleLogin} = useSocialLogin();
  const dispatch = useDispatch();
  let platformType = Platform.OS === 'android' ? 2 : 1;
  const userData = useSelector(state => state.authUser.authUser);

  const guestLogin = async () => {
    await setUserData({guest: true});
    dispatch(updateAuthUserData({guest: true}));
  };

  const notificationHandler = async (remoteMessage: any) => {
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
        id: 'messageIOS',
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

    // const categoryIdForIos = await notifee.setNotificationCategories({})

    notifee?.displayNotification({
      id: createDisplayId,
      title: 'Message',
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
        categoryId: 'messageIOS',
      },
    });
    // const channelId = await notifee.createChannel({
    //   id: '1',
    //   name: 'Message Channel',
    //   importance: AndroidImportance.HIGH,
    //   badge: true,
    //   bypassDnd: true,
    // });

    // // await notifee.setNotificationCategories([
    // //   {
    // //     id: 'haha',
    // //     allowAnnouncement: true,
    // //     summaryFormat: 'Post Like',
    // //     allowInCarPlay: true,
    // //   },
    // // ]);

    // await notifee.setNotificationCategories([
    //   {
    //     id: 'messageIOS',
    //     allowInCarPlay: true,
    //     allowAnnouncement: true,
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

    // await notifee?.displayNotification({
    //   // id: remoteMessage?.data?.postId?.toString(),
    //   body: remoteMessage?.data?.message,
    //   data: remoteMessage?.data,
    //   android: {
    //     channelId,
    //     color: colors.themeColor,
    //     category: AndroidCategory.SOCIAL,
    //     pressAction: {
    //       id: 'default',
    //     },
    //     showTimestamp: true,
    //   },
    //   ios: {
    //     categoryId: 'messageIOS',
    //   },
    // });
  };

  const login = async () => {
    try {
      let device_token = await AsyncStorage.getItem('fcmToken');
      if (!device_token) {
        const fcmToken = await getFcmToken();
        device_token = fcmToken;
      }
      const validatedNumber = await validateNumber.validate(number?.toString());
      setLoading(true);
      const loginDetail = await loginUserApi({
        mobile: validatedNumber,
        platformType: platformType,
        deviceType: platformType.toString(),
        deviceToken: device_token || '1234',
        loginType: DEVICE_TYPE,
      });
      setLoading(false);
      navigation.navigate(navigationString.VERIFY_OTP, {loginDetail});
    } catch (error) {
      setLoading(false);
      showError((error as Error).message);
    }
  };

  const onPressGoogleLogin = async () => {
    try {
      let device_token = await AsyncStorage.getItem('fcmToken');
      if (!device_token) {
        const fcmToken = await getFcmToken();
        device_token = fcmToken;
      }
      const googleData: User = await googleLogin();
      setLoading(true);
      const loginDetail = await loginUserApi({
        socialMediaId: googleData.user.id,
        loginType: 'google',
        platformType: platformType,
        deviceType: platformType.toString(),
        deviceToken: device_token || '1234',
      });
      setLoading(false);
      if (loginDetail?.firstName) {
        let x = await AsyncStorage.getItem('userData');
        x = JSON.parse(x);
        dispatch(updateAuthUserData({...loginDetail, accessToken: x?.accessToken}));
      } else {
        createProfile(googleData);
      }
    } catch (error) {
      console.log('errorerror', (error as Error).message);
      setLoading(false);
    }
  };

  const createProfile = async (googleData: User) => {
    try {
      const formData = new FormData();
      formData.append('email', googleData.user.email);
      formData.append('firstName', googleData.user.givenName);
      googleData.user.familyName && formData.append('lastName', googleData.user.familyName);
      const update = await updateProfile(formData);
      setLoading(false);
      let x = await AsyncStorage.getItem('userData');
      x = JSON.parse(x);
      dispatch(updateAuthUserData({...update, accessToken: x?.accessToken}));
    } catch (error) {
      setLoading(false);
      showError((error as Error).message);
    }
  };

  const createProfileApple = async (appleUser: any) => {
    try {
      const formData = new FormData();
      formData.append('email', appleUser.email);
      formData.append('firstName', appleUser.firstName);
      appleUser.lastName && formData.append('lastName', appleUser.lastName);
      const update = await updateProfile(formData);
      setLoading(false);
      let x = await AsyncStorage.getItem('userData');
      x = JSON.parse(x);
      dispatch(updateAuthUserData({...update, accessToken: x?.accessToken}));
    } catch (error) {
      setLoading(false);
      showError((error as Error).message);
    }
  };

  const navigationToPolicy = (link: string) => {
    navigation.navigate(navigationString.WEBVIEW_SCREEN, {link});
  };

  React.useEffect(() => {
    locationPermission();
  }, []);

  React.useEffect(() => {
    if (number?.length === 10 && !showGif) {
      setShowGif(true);
    } else if (showGif && number?.length < 10) {
      setShowGif(false);
    }
  }, [number, showGif]);

  const SocialButton = ({btnText, icon, onPress}: any) => {
    return (
      <Pressable onPress={onPress} style={styles.socialBtContainer}>
        <Image style={styles.imageStyle} source={icon} />
        <Text style={styles.socialTextStyle}>{btnText}</Text>
      </Pressable>
    );
  };

  const appleLogin = async () => {
    let device_token = await AsyncStorage.getItem('fcmToken');

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {email, identityToken, realUserStatus /* etc */} = appleAuthRequestResponse;

      if (identityToken) {
        console.log('appleAuthRequestResponse', JSON.stringify(appleAuthRequestResponse));

        if (!device_token) {
          const fcmToken = await getFcmToken();
          device_token = fcmToken;
        }

        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`

        const loginDetail = await loginUserApi({
          socialMediaId: appleAuthRequestResponse?.user,
          loginType: 'apple',
          platformType: platformType,
          deviceType: platformType.toString(),
          deviceToken: device_token || '1234',
        });

        if (loginDetail?.firstName) {
          let x = await AsyncStorage.getItem('userData');
          x = JSON.parse(x);
          dispatch(updateAuthUserData({...loginDetail, accessToken: x?.accessToken}));
        } else {
          let appleLoginApple = {
            id: appleAuthRequestResponse.user,
            email: email || '',
            firstName: appleAuthRequestResponse?.fullName?.givenName || '',
            lastName: appleAuthRequestResponse?.fullName?.familyName || '',
            profileStatus: '1',
          };
          createProfileApple(appleLoginApple);
          return;
        }
      } else {
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }
    } catch (error) {
      if (error === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  };

  return (
    <WrapperContainer isLoading={isLoading}>
      <View style={{padding: 20, flex: 1}}>
        {!!userData?.guest && <BackButton />}
        <Text style={{...commonStyles.fontBold24, marginTop: moderateScaleVertical(50)}}>{strings.let_start}</Text>
        <Text style={{...commonStyles.fontSize14, color: colors.grey_95, marginTop: moderateScaleVertical(10)}}>{strings.to_continue_phone_number}</Text>
        <View style={{marginTop: moderateScaleVertical(100)}}>
          <TextInputCustom returnKeyType="done" keyboardType={'numeric'} onChangeText={setMobileNumber} placeHolderString={strings.enter_phone_number} />
          <FlexSBContainer
            containerStyle={{
              marginTop: moderateScaleVertical(10),
            }}>
            <Image source={imagePath.fi_lock} />
            <Text style={{...commonStyles.fontSize13}}>
              {strings.your_information} <Text style={{color: colors.themeColor}}>{'privacy policy'}</Text>
            </Text>
            <FastImage style={{width: 20, height: 20}} source={showGif ? imagePath.success : ''} />
          </FlexSBContainer>
          <MainButton
            onPress={() => {
              // notificationHandler();
              login();
            }}
            btnText={strings.continue}
            btnStyle={{marginTop: moderateScaleVertical(40)}}
          />
          <Text style={styles.tappingDetail}>
            {strings.tapping_to_continue}
            <Text onPress={() => navigationToPolicy(T_AND_C)} style={{fontFamily: fontFamily.bold, color: colors.light_black}}>
              {' Terms of Use'}
              <Text style={{fontFamily: fontFamily.regular}}>
                {' and '}
                <Text onPress={() => navigationToPolicy(T_AND_C)} style={{fontFamily: fontFamily.bold}}>
                  {'Privacy Policy'}
                </Text>
              </Text>
            </Text>
          </Text>
        </View>
        <View style={styles.socialContainer}>
          {Platform.OS === 'ios' && <SocialButton onPress={appleLogin} icon={imagePath.apple} btnText={strings.continue_with_apple} />}
          <SocialButton onPress={onPressGoogleLogin} icon={imagePath.google} btnText={strings.continue_to_google} />
          {!userData?.guest && (
            <Text onPress={guestLogin} style={styles.guestText}>
              {strings.continue_to_guest}
            </Text>
          )}
        </View>
      </View>
    </WrapperContainer>
  );
};

export default Login;
