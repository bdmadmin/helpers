import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../theme/colors';
import {moderateScale, width} from '../../theme/responsiveSize';

const HomeSkeltonView = () => {
  return (
    <SkeletonPlaceholder shimmerWidth={width}>
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
  header: {
    height: 64,
    marginBottom: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(24),
    justifyContent: 'space-between',
    borderBottomColor: colors.e9,
  },
  margin: {marginHorizontal: moderateScale(20)},
  viewContainer: {marginTop: 16, width: 312, height: 204, borderRadius: 10},
});

export default HomeSkeltonView;
