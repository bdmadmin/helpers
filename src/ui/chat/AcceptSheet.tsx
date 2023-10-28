import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import FlexSBContainer from '../../components/FlexSBContainer';
import {FILE_BASE_URL} from '../../config/constant';
import imagePath from '../../config/imagePath';
import navigationString from '../../config/navigationString';
import colors from '../../theme/colors';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import styles from './styles';

interface AcceptSheetProps {
  item: {
    user: {
      profilePic: string;
      firstName: string;
      lastName: string;
    };
  };
  onPressAction: (myAction: number) => void;
}

const AcceptSheet = (_: AcceptSheetProps) => {
  const {item, onPressAction} = _;
  const navigation = useNavigation();

  console.log('itemitem', item);

  const viewProfile = () => {
    navigation.navigate(navigationString.OTHER_USER_PROFILE, {
      user: {
        ...item,
      },
    });
  };

  return (
    <View style={styles.acceptContainer}>
      <Text style={{...commonStyles.fontSize13, color: colors.grey_95}}>{'This user is not in your following list'}</Text>
      <FlexSBContainer onPress={viewProfile} containerStyle={styles.flexContainerAccept}>
        <FastImage style={{width: 30, height: 30, borderRadius: 5}} source={item?.user?.profilePic ? {uri: FILE_BASE_URL + item?.user?.profilePic} : imagePath.placeholder} />
        <Text style={{...commonStyles.fontSize13, marginStart: moderateScale(15)}}>{item?.user?.firstName + ' ' + item?.user?.lastName}</Text>
      </FlexSBContainer>
      <FlexSBContainer containerStyle={{marginTop: moderateScaleVertical(20), justifyContent: 'flex-start'}}>
        <Image style={{tintColor: colors.black}} source={imagePath.Union} />
        <Text style={{...commonStyles.fontSize13, marginStart: moderateScale(20)}}>{'Report'}</Text>
      </FlexSBContainer>
      <FlexSBContainer containerStyle={{marginTop: moderateScaleVertical(30), justifyContent: 'flex-start'}}>
        <Text onPress={() => onPressAction(2)} style={styles.reportBtn}>
          {'Report'}
        </Text>
        <Text onPress={() => onPressAction(1)} style={styles.acceptBtn}>
          {'Accept'}
        </Text>
      </FlexSBContainer>
    </View>
  );
};

export default AcceptSheet;
