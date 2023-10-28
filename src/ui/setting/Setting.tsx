import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {Text, View, StyleSheet, FlatList, Image, Pressable, Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import BackButton from '../../components/BackButton';
import FlexSBContainer from '../../components/FlexSBContainer';
import WrapperContainer from '../../components/WrapperContainer';
import imagePath from '../../config/imagePath';
import navigationString from '../../config/navigationString';
import {deleteAccount, logoutApi} from '../../redux/actions/home';
import {updateAuthUserData} from '../../redux/reducer/AuthSlice/authSlice';
import colors from '../../theme/colors';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import {clearAsyncStorage, setItem} from '../../utils/utils';
import styles from './styles';
import {ABOUT, HELP, PRIVACY_POLICY, T_AND_C} from '../../config/constant';

interface SettingProps {}

const Setting = (_: SettingProps) => {
  const {navigation} = _;

  const alert = () => {
    Alert.alert('Delete Account', 'Your account will be deleted within 14 days if your will not login again.', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => onPressDeleteAccout()},
    ]);
  };

  const onPressDeleteAccout = async () => {
    try {
      await deleteAccount();
      logout();
    } catch (error) {}
  };

  const SETTING = React.useMemo(() => {
    return [
      {
        text: 'Delete Account',
        image: imagePath.fi_unlock,
        onPress: () => alert(),
      },
      {
        text: 'Push Notifications',
        image: imagePath.fi_bell,
        onPress: () => navigation.navigate(navigationString.PUSH_SETTING),
      },
      {
        text: 'Help',
        image: imagePath.i_help_circle,
        onPress: () => navigation.navigate(navigationString.WEBVIEW_SCREEN, {url: HELP}),
      },
      {
        text: 'About',
        image: imagePath.fi_file,
        onPress: () => navigation.navigate(navigationString.WEBVIEW_SCREEN, {url: ABOUT}),
      },
      {
        text: 'Terms & Conditions',
        image: imagePath.fi_file_minus,
        onPress: () => navigation.navigate(navigationString.WEBVIEW_SCREEN, {url: T_AND_C}),
      },
      {
        text: 'Privacy & Policy',
        image: imagePath.fi_file_minus,
        onPress: () => navigation.navigate(navigationString.WEBVIEW_SCREEN, {url: PRIVACY_POLICY}),
      },
    ];
  }, [navigation]);

  const dispatch = useDispatch();

  const logout = async () => {
    const device_token = await AsyncStorage.getItem('fcmToken');
    await logoutApi();
    await clearAsyncStorage();
    await setItem('fcmToken', JSON.stringify(device_token));
    device_token && (await AsyncStorage.setItem('fcmToken', device_token?.toString()));
    dispatch(updateAuthUserData({}));
  };

  const renderSetting = ({item, index}: any) => {
    return (
      <View style={{}} key={index}>
        <View style={{backgroundColor: colors.e5, height: 8}} />
        <View style={{paddingVertical: moderateScale(15), paddingHorizontal: moderateScale(15)}}>
          <FlexSBContainer
            onPress={() => {
              item?.onPress && item?.onPress();
            }}
            containerStyle={{justifyContent: 'flex-start'}}>
            <Image source={item?.image} />
            <Text style={{...commonStyles.fontBold16, marginStart: moderateScaleVertical(20)}}>{item?.text}</Text>
          </FlexSBContainer>
        </View>
      </View>
    );
  };

  return (
    <WrapperContainer bodyColor={colors.e5}>
      <View style={{backgroundColor: colors.white}}>
        <View style={{padding: 15}}>
          <BackButton />
          <Text style={styles.settingText}>{'Settings'}</Text>
        </View>
        <FlatList data={SETTING} keyExtractor={(_, index) => index.toString()} renderItem={renderSetting} />
      </View>
      <Pressable onPress={logout} style={{position: 'absolute', bottom: 40, marginStart: moderateScale(20)}}>
        <Image source={imagePath.logout} />
      </Pressable>
    </WrapperContainer>
  );
};

export default Setting;
