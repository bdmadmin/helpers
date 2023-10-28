/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Text, View, StyleSheet, Image, TextInput} from 'react-native';
import BackButton from './BackButton';
import ModalBox from '../ui/stories/ModalBox';
import colors from '../theme/colors';
import commonStyles from '../utils/commonStyles';
import {moderateScale, moderateScaleVertical} from '../theme/responsiveSize';
import FlexSBContainer from './FlexSBContainer';
import {ScrollView} from 'react-native-gesture-handler';
import MainButton from './MainButton';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {setModalVisibility} from '../redux/reducer/MarkAsSold/markAsSoldSlice';
import imagePath from '../config/imagePath';
import {markAsCompletePostApi} from '../redux/actions/home';
import {FILE_BASE_URL} from '../config/constant';
import Loader from './Loader';
import strings from '../config/lang';
interface MarkAsCompleteProps {
  onSubmit: () => void;
}

const MarkAsComplete = React.forwardRef((props: MarkAsCompleteProps, ref) => {
  const {onSubmit} = props;
  const [isVisible, setVisible] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState<Array<any>>([]);
  const [selectedUserIndex, setSelectedIndex] = React.useState(-1);
  const [comment, setComment] = React.useState<string>('');
  const dispatch = useDispatch();
  const postIdRef = React.useRef('');

  const setVisibility = (visibility: boolean) => {
    setVisible(visibility);
  };

  const setUsers = (users: Array<any>, postId: string) => {
    setUser(users);
    postIdRef.current = postId;
  };

  React.useImperativeHandle(ref, () => {
    return {
      setVisibility,
      setUsers,
    };
  });

  const onClose = () => {
    setVisible(false);
    setComment('');
    dispatch(setModalVisibility({postId: '', isModalVisible: false}));
  };

  const markPostComplete = async (flag: boolean) => {
    console.log("comment===========",comment)
    try {
      setLoading(true);
      await markAsCompletePostApi({
        ...(selectedUserIndex !== -1 && !flag && {room: user[selectedUserIndex].room}),
        ...(selectedUserIndex !== -1 && !flag && {userId: user[selectedUserIndex].senderId}),
        id: postIdRef.current,
        status: 1,
        ...(flag && {userId: 0}),
        ...(comment && {message: comment}),
      });
      setLoading(false);
      onClose();
      onSubmit();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <ModalBox onClosed={onClose} isOpen={isVisible} position={'bottom'} entry={'bottom'} animationDuration={500} coverScreen={false} swipeToClose={false} style={styles.modalStyle}>
      <View style={{flex: 1}}>
        <View style={{padding: 20}}>
          <BackButton onCustomPress={onClose} />
        </View>
        <ScrollView>
          <View style={styles.topContainer}>
            <Text style={{...commonStyles.fontBold24, marginTop: moderateScaleVertical(20)}}>{'Mark Post as Completed'}</Text>
            <Text numberOfLines={2} style={{...commonStyles.fontSize14, color: colors.grey_072}}>
              {'By marking this post as complete, you’re about to:'}
            </Text>
            <View style={styles.container}>
              <FlexSBContainer containerStyle={{justifyContent: 'flex-start'}}>
                {/* <Image style={{width: 40, height: 40}} source={imagePath.Sos} /> */}
                <Text style={styles.cause}>{'Select people who associate with you in this cause'}</Text>
              </FlexSBContainer>
              <View style={{padding: 10, flex: 1}}>
                <ScrollView>
                  {user.map((userItem, index) => {
                    return (
                      <FlexSBContainer onPress={() => setSelectedIndex(index)} key={index} containerStyle={{marginTop: moderateScaleVertical(10)}}>
                        <FlexSBContainer>
                          <FastImage style={{width: 60, height: 60, borderRadius: 15}} source={userItem?.sender?.profilePic ? {uri: FILE_BASE_URL + userItem?.sender?.profilePic} : imagePath.placeholder} />
                          <View style={{marginStart: moderateScale(10)}}>
                            <Text style={commonStyles.fontBold16}>{userItem?.sender?.firstName}</Text>
                            <Text style={{...commonStyles.fontSize13, color: colors.grey_95}}>{'Male'}</Text>
                          </View>
                        </FlexSBContainer>
                        {selectedUserIndex !== index ? (
                          <View
                            style={{
                              borderWidth: 1,
                              width: 30,
                              height: 30,
                              borderRadius: 15,
                              alignSelf: 'flex-end',
                              borderColor: 'red',
                              marginBottom: 20,
                            }}
                          />
                        ) : (
                          <Image
                            style={{
                              alignSelf: 'flex-end',
                              width: 30,
                              height: 30,
                              marginBottom: 20,
                            }}
                            source={imagePath.checkbox}
                          />
                        )}
                      </FlexSBContainer>
                    );
                  })}
                </ScrollView>
                {user.length === 0 && <Text style={{...commonStyles.fontBold16, flex: 1, alignSelf: 'center'}}>{'No user found'}</Text>}
              </View>
            </View>
          </View>

          <TextInput
            maxLength={8000}
            multiline
            value={comment}
            onChangeText={(text)=>setComment(text)}
            style={{borderWidth: 1,minHeight:50 ,maxHeight: 120, marginHorizontal: 20, paddingStart: 10, borderRadius: 10, color: colors.black}}
            placeholder="Add comment"
            placeholderTextColor={colors.grey_072}
          />

          <View style={styles.bottomContainer}>
            <Text onPress={() => markPostComplete(true)} style={styles.noLongerAndHelp}>
              {strings.no_longer_needed}
            </Text>
            <Text onPress={() => markPostComplete(true)} style={{...styles.noLongerAndHelp, marginVertical: moderateScaleVertical(20)}}>
              {'It was offline Help'}
            </Text>
            <MainButton onPress={() => markPostComplete(false)} btnText={strings.mark_as_complete} />
          </View>
        </ScrollView>
      </View>

      <Loader isLoading={isLoading} />
    </ModalBox>
  );
});

export default MarkAsComplete;

const styles = StyleSheet.create({
  bottomContainer: {flex: 0.3, padding: 15, justifyContent: 'flex-end'},
  topContainer: {marginHorizontal: 10, padding: 10, flex: 1},
  cause: {...commonStyles.fontSize16, marginStart: moderateScale(10), flex: 1, color: colors.grey_072},
  sheetContainer: {
    backgroundColor: 'white',
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    shadowOffset: {
      width: 0,
      height: 2122,
    },
    shadowOpacity: 0.75,
    shadowRadius: 16.0,
    elevation: 24,
    color: colors.error,
  },
  modalStyle: {
    height: '95%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  noLongerAndHelp: {...commonStyles.fontBold16, marginTop: moderateScaleVertical(20), alignSelf: 'center', color: colors.themeColor},
  container: {flex: 1, borderWidth: 2, borderRadius: 15, borderColor: colors.lineGrey, paddingVertical: moderateScaleVertical(10), marginTop: moderateScaleVertical(20)},
});
