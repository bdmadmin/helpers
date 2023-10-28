import React from 'react';
import {View, Modal, ActivityIndicator} from 'react-native';
import {SkypeIndicator} from 'react-native-indicators';
import colors from '../theme/colors';
import commonStyles from '../utils/commonStyles';

const Loader = ({isLoading = false, modal = true}) => {
  if (isLoading && modal) {
    return (
      <Modal statusBarTranslucent transparent visible={isLoading}>
        <View style={{...commonStyles.loader, backgroundColor: 'rgba(0,0,0,0.4)'}}>
          <SkypeIndicator size={55} color={colors.themeColor} />
        </View>
      </Modal>
    );
  } else {
    if (isLoading) {
      return (
        <View style={{...commonStyles.loader}}>
          <ActivityIndicator size={40} color={colors.themeColor} />
        </View>
      );
    }
  }
  return null;
};

export default React.memo(Loader);
