import * as React from 'react';
import {Alert, Image, Pressable, Text, View} from 'react-native';
import FlexSBContainer from '../../components/FlexSBContainer';
import imagePath from '../../config/imagePath';
import colors from '../../theme/colors';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import styles from './styles';
import BackButton from '../../components/BackButton';
import FastImage from 'react-native-fast-image';
import {FILE_BASE_URL} from '../../config/constant';
// import MarkAsComplete from '../../components/MarkAsCompleteModal';
// import {useSelector} from 'react-redux';
// import {getWhoMessageMe} from '../../redux/actions/home';
import navigationString from '../../config/navigationString';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import NavigationService from '../../service/NavigationService';

interface ChatHeaderProps {
  item: unknown;
  onPressAction: (actionType: number) => void;
}

const ChatHeader = (props: ChatHeaderProps) => {
  const {item, onPressAction} = props;

  const getHeaderImage = () => {
    if (item?.feed_medias?.length > 0 && item?.feed_medias?.some((x: any) => x?.mediaType === 'image')) {
      return {uri: FILE_BASE_URL + item?.feed_medias.filter((feed: any) => feed?.mediaType === 'image')[0]?.name};
    }
    return imagePath.app_icon;
  };

  const viewPost = () => {
    NavigationService.navigate(navigationString.SINGLE_POST, {postData: [{...item, hideBottom: true}]});
  };

  const showReportPopup = () => {
    Alert.alert('Report User', 'Are you sure you want to report this user', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => onPressAction(2)},
    ]);
  };

  const menu = React.useCallback(() => {
    return (
      <>
        <Menu>
          <MenuTrigger>
            <Image source={imagePath.fi_more_vertical} />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
              },
            }}>
            <MenuOption>
              <Pressable onPress={showReportPopup}>
                <Text style={commonStyles.fontBold16}>{'Report'}</Text>
              </Pressable>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </>
    );
  }, []);

  return (
    <>
      <FlexSBContainer containerStyle={styles.flexContainerBack}>
        <BackButton />
        <Text style={{...commonStyles.fontBold16}}>{item?.user?.firstName + ' ' + item?.user?.lastName}</Text>
        {menu()}
      </FlexSBContainer>
      <FlexSBContainer containerStyle={styles.flexContainer}>
        <FastImage style={styles.postImage} source={getHeaderImage()} />
        <View style={{flex: 1, marginHorizontal: moderateScale(10)}}>
          <Text numberOfLines={2} style={{...commonStyles.fontSize13, color: colors.grey_black}}>
            {item?.description}
          </Text>
          {!item?.fromHelp && (
            <Text onPress={viewPost} style={styles.markAsComplete}>
              {'View Post'}
            </Text>
          )}
        </View>
      </FlexSBContainer>
    </>
  );
};

export default ChatHeader;
