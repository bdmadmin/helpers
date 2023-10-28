import * as React from 'react';
import {Text, View, StyleSheet, Image, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import FlexSBContainer from '../../components/FlexSBContainer';
import {FILE_BASE_URL} from '../../config/constant';
import imagePath from '../../config/imagePath';
import colors from '../../theme/colors';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import StoriesSlide, {Status} from '../stories/StoriesSlide';

interface ProfileHeaderDetailProps {
  detail: any;
  userName: string;
  picture: string;
  gender: 'male' | 'female';
  userId?: string;
}

const ProfileHeaderDetail = (_: ProfileHeaderDetailProps) => {
  const {detail, userName, picture, gender, userId} = _;
  const statusRef = React.useRef<Status>();
  // const userData = useSelector(state => state.authUser.authUser);

  let generateEmergencyData: any = [];

  if (detail?.emergency.length > 0) {
    generateEmergencyData = [
      {
        user_post: detail?.emergency,
        firstName: userName,
        lastName: '',
        profilePic: picture,
        id: userId,
      },
    ];
  }

  // console.log('generateEmergencyData', JSON.stringify(generateEmergencyData));

  //   const navigation = useNavigation();

  const PostNeedDoneOther = ({title, titleValue, descriptionValue, color}: {title: string; titleValue: string; descriptionValue: string; color: string}) => {
    return (
      <View style={{borderEndWidth: title === 'Help others' ? 0 : 1, borderEndColor: colors.lineGrey, paddingEnd: 20}}>
        <Text style={{...commonStyles.fontSize12, color: colors.grey_072}}>{title}</Text>
        <Text style={{...commonStyles.fontBold20, marginTop: moderateScaleVertical(10)}}>{titleValue}</Text>
        <Text style={{...commonStyles.fontSize12, color: colors.grey_95, marginTop: moderateScaleVertical(10)}}>
          <Text style={{color: color}}>{`+${descriptionValue}`}</Text> {' in week'}
        </Text>
      </View>
    );
  };

  const onPressPost = () => {
    detail?.emergency.length > 0 && statusRef.current?._handleStoryItemPress(0);
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={{marginTop: moderateScaleVertical(50)}}>
          <Pressable onPress={onPressPost} style={styles.profileContainer}>
            <FastImage style={{...styles.profile, borderWidth: detail?.emergency?.length > 0 ? 4 : 0, borderRadius: 15, borderColor: colors.themeColor}} source={picture ? {uri: FILE_BASE_URL + picture} : imagePath.placeholder} />
            {/* <Image style={styles.emergency} source={imagePath.emergency} /> */}
          </Pressable>
          <FlexSBContainer containerStyle={{justifyContent: 'center'}}>
            <Text style={commonStyles.fontBold20}>{`${userName}`}</Text>
            <Image style={styles.gender} source={gender === 'male' ? imagePath.male : imagePath.femenine} />
          </FlexSBContainer>
          <View style={{marginTop: moderateScaleVertical(40)}}>
            <Text style={{...commonStyles.fontBold16, color: colors.grey_black}}>{'Profile Insights'}</Text>
            <Text style={{...commonStyles.fontSize12, color: colors.grey_95}}>{'Visible to anyone on or off helper'}</Text>
          </View>
          <FlexSBContainer containerStyle={{marginTop: moderateScaleVertical(26)}}>
            <PostNeedDoneOther title="Post as needy" titleValue={detail?.postNeedy} descriptionValue={detail?.postNeedyweak} color={colors.green} />
            <PostNeedDoneOther title="Post as donar" titleValue={detail?.postdoner} descriptionValue={detail?.postdonerweak} color={colors.green} />
            <PostNeedDoneOther title="Help others" titleValue={detail?.helpother} descriptionValue={detail?.helpotherweak} color={colors.error} />
          </FlexSBContainer>
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.footerContainer}>
        <Text style={{...commonStyles.fontBold16, color: colors.grey_black}}>{'Post'}</Text>
        <Text style={{...commonStyles.fontSize12, color: colors.grey_95}}>{'Visible to anyone on or off helper'}</Text>
      </View>
      <StoriesSlide data={generateEmergencyData} ref={statusRef} />
    </View>
  );
};

export default ProfileHeaderDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  profile: {width: 100, height: 100, borderRadius: 20, alignSelf: 'center', marginTop: 4},
  profileContainer: {width: 110, height: 110, alignSelf: 'center'},
  emergency: {position: 'absolute', bottom: 0, end: 0},
  line: {height: 10, backgroundColor: colors.e5},
  footerContainer: {marginTop: moderateScaleVertical(10), padding: 20},
  gender: {width: 20, height: 20, marginStart: moderateScale(10)},
});
