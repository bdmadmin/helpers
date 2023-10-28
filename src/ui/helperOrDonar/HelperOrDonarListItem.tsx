import dayjs from 'dayjs';
import * as React from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FlexSBContainer from '../../components/FlexSBContainer';
import {FILE_BASE_URL} from '../../config/constant';
import imagePath from '../../config/imagePath';
import navigationString from '../../config/navigationString';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import styles from './styles';
import NavigationService from '../../service/NavigationService';
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
interface HelperOrDonarListItemProps {
  item: unknown;
  postItem: any;
}

const HelperOrDonarListItem = (props: HelperOrDonarListItemProps) => {
  const item = props?.item;
  const postItem = props?.postItem;
  const data = item;

  const goToChat = () => {
    NavigationService.navigate(navigationString.CHAT, {
      item: {
        ...item,
        ...postItem,
        post_info: {
          status: postItem?.status,
        },
        fromHelp: true,
        status: data?.requestStatus,
        postId: postItem?.id,
        user: data?.sender,
        room: data?.room,
      },
    });
  };

  return (
    <TouchableOpacity onPress={goToChat} style={styles.itemContainer}>
      <FlexSBContainer containerStyle={styles.flexContainer}>
        <FastImage style={styles.messageImage} source={data?.sender?.profilePic ? {uri: FILE_BASE_URL + data?.sender?.profilePic} : imagePath.placeholder} />
        <View style={{flex: 1, marginHorizontal: moderateScale(10)}}>
          <FlexSBContainer>
            <Text numberOfLines={2} style={{...commonStyles.fontSize13, color: colors.grey_black}}>
              {data?.sender?.firstName}
            </Text>
            <Text style={styles.otherMatches}>{dayjs().to(data?.createdAt)}</Text>
          </FlexSBContainer>
          <FlexSBContainer containerStyle={{marginTop: moderateScaleVertical(6)}}>
            <Text numberOfLines={1} style={{...commonStyles.fontSize14, fontFamily: fontFamily.bold, color: colors.light_black}}>
              {data?.message}
            </Text>
            {!data?.isRead && <View style={styles.dot} />}
          </FlexSBContainer>
        </View>
      </FlexSBContainer>
    </TouchableOpacity>
  );
};

export default HelperOrDonarListItem;
