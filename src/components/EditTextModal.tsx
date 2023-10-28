import * as React from 'react';
import {Text, View, StyleSheet, Modal, TextInput} from 'react-native';
import commonStyles from '../utils/commonStyles';
import colors from '../theme/colors';
import MainButton from './MainButton';
import {useDispatch, useSelector} from 'react-redux';
import {editPostState, openEditPostModal} from '../redux/reducer/ReportSlice/editPostSlice';
import {updateFeed} from '../redux/actions/home';

interface EditTextModalProps {
  onRefreshScreen: () => void;
}

const EditTextModal = (props: EditTextModalProps) => {
  const {data, isModalOpen} = useSelector(editPostState);
  const [isVisible, setVisiblity] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>(data?.description);
  const dispatch = useDispatch();

  const cancel = () => {
    setVisiblity(false);
    dispatch(openEditPostModal({isModalOpen: false, data: {}}));
  };
  const updatePost = async () => {
    try {
      if (text) {
        await updateFeed({id: data?.id, description: text});
        cancel();
        props?.onRefreshScreen();
      }
    } catch (error) {
      console.log('ERRRR', error);
    }
  };

  React.useEffect(() => {
    setVisiblity(isModalOpen);
    setText(data?.description);
  }, [isModalOpen, data]);

  return (
    <Modal transparent visible={isVisible}>
      <View style={styles.mainContainer}>
        <View style={styles.whiteContainer}>
          <Text style={{...commonStyles.fontBold18, alignSelf: 'center'}}>{'Edit Post'}</Text>
          <TextInput value={text} onChangeText={setText} multiline style={styles.textInput} />
          <View style={styles.btnContainer}>
            <MainButton onPress={updatePost} btnText="Update" />
            <MainButton onPress={cancel} btnText="Cancel" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditTextModal;

const styles = StyleSheet.create({
  mainContainer: {flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blackWithOpacityFive},
  btnContainer: {flexDirection: 'row', width: '100%', justifyContent: 'space-around'},
  textInput: {...commonStyles.fontSize16, flex: 1, textAlignVertical: 'top'},
  whiteContainer: {flex: 1, borderWidth: 1, backgroundColor: colors.white, maxHeight: 200, padding: 10, width: '90%', borderRadius: 10, elevation: 10},
});
