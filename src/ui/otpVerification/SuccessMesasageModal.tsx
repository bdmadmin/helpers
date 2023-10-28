import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import imagePath from '../../config/imagePath';
import colors from '../../theme/colors';
import {moderateScaleVertical} from '../../theme/responsiveSize';
import FastImage from 'react-native-fast-image';
import {getCurrentLocation} from '../../utils/helper';
import {updateProfile} from '../../redux/actions/auth';

export interface JobCloseModalProps {
  action?: 'job' | 'archive';
  archiveJobClose: () => void;
}

export type JobModalFunctions = {
  setVisibleModal: () => void;
  setCloseModal: () => void;
};

const SuccessMessageModal = React.forwardRef<any, JobCloseModalProps>((props, ref) => {
  const [isVisible, setVisible] = React.useState<boolean>(false);
  const setVisibleModal = () => setVisible(true);
  const setCloseModal = () => setVisible(false);
  React.useEffect(() => {
    (async () => {
      const currentLocation = await getCurrentLocation();
      if (currentLocation) {
        await updateProfile({
          latitude: currentLocation?.coords.latitude,
          longitude: currentLocation?.coords.longitude,
        });
      }
    })();
  }, []);

  React.useImperativeHandle(ref, (): JobModalFunctions => {
    return {
      setCloseModal,
      setVisibleModal,
    };
  });

  return (
    <Modal useNativeDriver backdropOpacity={1} isVisible={isVisible} backdropColor={colors.white} animationOutTiming={200} hasBackdrop={false} coverScreen style={{margin: 0}} animationInTiming={200} hideModalContentWhileAnimating>
      <View style={styles.gifContainer}>
        <FastImage style={styles.gif} resizeMode={'stretch'} source={imagePath.Earth} /> 
      </View>
    </Modal>
  );
});

export default SuccessMessageModal;

const styles = StyleSheet.create({
  textInput: {height: 100, textAlignVertical: 'top', marginTop: moderateScaleVertical(10)},
  container: {backgroundColor: colors.white, borderRadius: 15, padding: 20},
  gifContainer: {flex: 1, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center'},
  gif: {width: 200, height: 200},
});
