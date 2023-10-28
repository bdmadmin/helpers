import * as React from 'react';
import {View, Text, TouchableOpacity, Image, Pressable, ScrollView, StyleSheet} from 'react-native';
import colors from '../theme/colors';
import commonStyles from '../utils/commonStyles';
import {openReportSheet, reportSliceSelector} from '../redux/reducer/ReportSlice/reportSlice';
import {moderateScaleVertical, width} from '../theme/responsiveSize';
import {reportFeed} from '../redux/actions/home';
import FlexSBContainer from './FlexSBContainer';
import imagePath from '../config/imagePath';
import Modal from 'react-native-modalbox';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {showSuccess} from '../utils/utils';

// interface ReportBottomSheetProps {}

const ReportBottomSheet = React.forwardRef((_, r) => {
  const openReportSheetValue = useAppSelector(reportSliceSelector);
  const dispatch = useAppDispatch();
  const [isOpen, setOpen] = React.useState(false);

  const onChange = (index: number) => {
    if (index === 0) {
      dispatch(openReportSheet({isOpen: false, postId: ''}));
    }
  };

  const onReportUser = async (description: string) => {
    try {
      await reportFeed({
        type: '2',
        postId: openReportSheetValue?.postId.toString(),
        description,
      })
        .then(() => {
          showSuccess('User Reported successfully');
        })
        .catch(error => {
          console.log('error', error);
        });
      setOpen(false);
      dispatch(openReportSheet({isOpen: false, postId: ''}));
    } catch (error) {}
  };

  React.useEffect(() => {
    setOpen(openReportSheetValue?.isOpen);
  }, [openReportSheetValue]);

  return (
    <Modal
      isOpen={isOpen}
      onClosed={() => {
        dispatch(openReportSheet({isOpen: false, postId: ''}));
      }}
      position={'bottom'}
      entry={'bottom'}
      animationDuration={200}
      coverScreen={false}
      swipeToClose={false}
      style={styles.modalContainer}>
      <FlexSBContainer containerStyle={{marginTop: 20}}>
        <Text style={styles.reportUser}>{'Report User'}</Text>
        <Pressable onPress={() => onChange(0)}>
          <Image source={imagePath.closex} style={{marginEnd: 10, tintColor: colors.error}} />
        </Pressable>
      </FlexSBContainer>
      <ScrollView>
        <View style={{padding: 20}}>
          {['Sexual Content', 'Violent or repulsive content', 'Hateful or abusive content', 'Harmful or dangerous acts', 'Spam or misleading', 'Other'].map((txt, index) => {
            return (
              <TouchableOpacity onPress={() => onReportUser(txt)} style={{marginVertical: moderateScaleVertical(10)}} key={index}>
                <Text style={{...commonStyles.fontBold18, color: colors.grey_black}}>{txt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </Modal>
  );
});

export default ReportBottomSheet;

const styles = StyleSheet.create({
  modalContainer: {width: width, borderTopEndRadius: 20, borderTopStartRadius: 20, height: 350},
  reportUser: {...commonStyles.fontBold20, paddingHorizontal: 20},
});
