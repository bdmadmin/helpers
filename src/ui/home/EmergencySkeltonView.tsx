import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../theme/colors';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';

const EmergencySkeltonView = () => {
  return (
    <SkeletonPlaceholder>
      <View>
        <View style={styles.margin}>
          <View style={styles.viewContainer} />
          <View style={styles.viewContainer} />
          <View style={styles.viewContainer} />
          <View style={styles.viewContainer} />
          <View style={styles.viewContainer} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  margin: {padding: 15, flexDirection: 'row'},
  viewContainer: {width: 45, height: 45, borderRadius: 20, marginEnd: moderateScale(20), marginBottom: moderateScaleVertical(18)},
});

export default EmergencySkeltonView;
