import * as React from 'react';
import {Text, View, Image, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import BackButton from '../../components/BackButton';
import FlexSBContainer from '../../components/FlexSBContainer';
import WrapperContainer from '../../components/WrapperContainer';
import imagePath from '../../config/imagePath';
import {updateProfile} from '../../redux/actions/auth';
import {updateAuthUserData} from '../../redux/reducer/AuthSlice/authSlice';
import colors from '../../theme/colors';
import {moderateScale} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import {showError} from '../../utils/utils';
import styles from './styles';

interface PushSettingProps {}

const PushSetting = (_: PushSettingProps) => {
  const userData = useSelector(state => state.authUser.authUser);
  const [notificationState, setNotificationSetate] = React.useState({
    message: userData?.isMessage,
    emergency: userData?.isEmergency,
    others: userData?.isNotification,
  });
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  console.log('userData', userData);
  const updateState = (data: any) => {
    setNotificationSetate((updatedState: any) => ({...updatedState, ...data}));
  };

  const updateNotification = async (title: string) => {
    try {
      setLoading(true);
      await updateProfile({
        isMessage: title === 'Message' ? (notificationState.message === 0 ? 1 : 0) : notificationState.message,
        isNotification: title === 'Others' ? (notificationState.message === 0 ? 1 : 0) : notificationState.message,
        isEmergency: title === 'Emergency' ? (notificationState.message === 0 ? 1 : 0) : notificationState.message,
      });
      if (title === 'Message') {
        updateState({message: notificationState.message === 0 ? 1 : 0});
        dispatch(updateAuthUserData({...userData, isMessage: notificationState.message === 0 ? 1 : 0}));
      }
      if (title === 'Emergency') {
        updateState({emergency: notificationState.emergency === 0 ? 1 : 0});
        dispatch(updateAuthUserData({...userData, isEmergency: notificationState.emergency === 0 ? 1 : 0}));
      }
      if (title === 'Others') {
        updateState({others: notificationState.others === 0 ? 1 : 0});
        dispatch(updateAuthUserData({...userData, isNotification: notificationState.others === 0 ? 1 : 0}));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showError((error as Error).message);
    }
  };

  const ToggleContainer = ({title, description, isEnable}: {title: string; description: string; isEnable: boolean}) => {
    return (
      <Pressable>
        <View style={{backgroundColor: colors.e5, height: 8}} />
        <View style={{paddingBottom: moderateScale(15), paddingHorizontal: moderateScale(15)}}>
          <FlexSBContainer containerStyle={{justifyContent: 'flex-end'}}>
            <Text style={{flex: 1, ...commonStyles.fontBold16}}>{title}</Text>
            <Pressable onPress={() => updateNotification(title)}>
              <Image style={{width: 50, height: 30, marginTop: 30, resizeMode: 'contain'}} source={isEnable ? imagePath.check_on : imagePath.check_off} />
            </Pressable>
          </FlexSBContainer>
          <Text style={{...commonStyles.fontSize12, color: colors.grey}}>{description}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <WrapperContainer isLoading={isLoading} bodyColor={colors.e5}>
      <View style={{backgroundColor: colors.white}}>
        <View style={{padding: 15}}>
          <BackButton />
          <Text style={styles.settingText}>{'Push Notification'}</Text>
          <Text style={styles.chooseText}>{'Choose what activities matter to your to keep in touch with'}</Text>
        </View>
        <ToggleContainer isEnable={notificationState.message} title="Message" description="Turning off you will miss out on new messages." />
        <ToggleContainer isEnable={notificationState.emergency} title="Emergency" description="Turning off you will miss out emergency post." />
        <ToggleContainer isEnable={notificationState.others} title="Others" description="Turning off this notification means you will not be notified of other event held in your area" />
      </View>
    </WrapperContainer>
  );
};

export default PushSetting;
