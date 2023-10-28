import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FlexSBContainer from '../../components/FlexSBContainer';
import colors from '../../theme/colors';
import {moderateScale, moderateScaleVertical, width} from '../../theme/responsiveSize';

const MessageShimmer = () => {
  const RowShimmerItem = useCallback(() => {
    return (
      <View style={styles.margin}>
        <SkeletonPlaceholder borderRadius={4}>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item width={60} height={60} borderRadius={10} />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item width={220} height={20} />
              <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    );
  }, []);
  return (
    <>
      <RowShimmerItem />
      <RowShimmerItem />
      <RowShimmerItem />
      <RowShimmerItem />
      <RowShimmerItem />
      <RowShimmerItem />
      <RowShimmerItem />
      <RowShimmerItem />
      <RowShimmerItem />
      <RowShimmerItem />
    </>
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
  margin: {marginHorizontal: 14, marginTop: moderateScaleVertical(10)},
  viewContainer: {marginTop: 16, width: 60, height: 60, borderRadius: 10},
});

export default MessageShimmer;
