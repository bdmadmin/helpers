import * as React from 'react';
import {Text, StyleSheet, Image, Pressable, Alert} from 'react-native';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import {useDispatch, useSelector} from 'react-redux';
import imagePath from '../../config/imagePath';
import {deleteOwnFeed} from '../../redux/actions/home';
import {openReportSheet} from '../../redux/reducer/ReportSlice/reportSlice';
import commonStyles from '../../utils/commonStyles';
import {showError} from '../../utils/utils';
import {moderateScaleVertical} from '../../theme/responsiveSize';
import {openEditPostModal} from '../../redux/reducer/ReportSlice/editPostSlice';

interface FeedMenuProps {
  item: any;
}

const FeedMenu = React.forwardRef<any, FeedMenuProps>((_, refreshHandler) => {
  const {item} = _;
  const userData = useSelector(state => state.authUser.authUser);
  const myId = item?.user?.id === userData?.id;
  const menuRef = React.useRef<Menu>();
  const dispatch = useDispatch();

  const deletePost = async () => {
    try {
      menuRef.current?.close();
      await deleteOwnFeed({id: item?.id.toString()});
      refreshHandler?.current?.getProfileDetail();
    } catch (error) {
      showError((error as Error)?.message);
    }
  };

  const showDeletePostAlert = () => {
    Alert.alert('Delete Post ', 'Are you sure you want to delete the post', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deletePost()},
    ]);
  };

  const editPost = () => {
    try {
      dispatch(openEditPostModal({isModalOpen: true, data: item}));
    } catch (error) {
      showError((error as Error)?.message);
    }
  };

  const onPressMenu = (type: 'delete' | 'edit') => {
    menuRef.current?.close();
    if (myId) {
      if (type === 'delete') {
        showDeletePostAlert();
        return;
      } else {
        editPost();
        return;
      }
    }
    menuRef.current?.close();
    dispatch(openReportSheet({isOpen: true, postId: item?.id}));
  };

  return (
    <>
      <Menu ref={menuRef}>
        <MenuTrigger disabled={userData?.guest}>
          <Image style={styles.image} source={imagePath.fi_more_vertical} />
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
            <Pressable onPress={() => onPressMenu('delete')}>
              <Text style={commonStyles.fontBold16}>{myId ? 'Delete' : 'Report'}</Text>
            </Pressable>
            {myId && (
              <Pressable style={{marginTop: moderateScaleVertical(20)}} onPress={() => onPressMenu('edit')}>
                <Text style={commonStyles.fontBold16}>{'Edit Post'}</Text>
              </Pressable>
            )}
          </MenuOption>
        </MenuOptions>
      </Menu>
    </>
  );
});

export default FeedMenu;

const styles = StyleSheet.create({
  image: {width: 20, height: 20},
});
