import * as React from 'react';
import {Text, View, StyleSheet, FlatList, TouchableOpacity, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {RefreshControl} from 'react-native-gesture-handler';
import FlexSBContainer from '../../components/FlexSBContainer';
import imagePath from '../../config/imagePath';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

interface CallingProps {}

const Calling = (props: CallingProps) => {
  const renderChatList = () => {
    return (
      <TouchableOpacity style={{backgroundColor: colors.white, marginTop: 10, padding: 10}}>
        <FlexSBContainer containerStyle={{justifyContent: 'flex-start', flex: 1}}>
          <FastImage style={styles.messageImage} source={{uri: 'https://i.picsum.photos/id/22/4434/3729.jpg?hmac=fjZdkSMZJNFgsoDh8Qo5zdA_nSGUAWvKLyyqmEt2xs0'}} />
          <View style={{marginStart: moderateScale(10)}}>
            <Text numberOfLines={2} style={{...commonStyles.fontSize14, fontFamily: fontFamily.bold, color: colors.light_black, marginEnd: 100}}>
              {'Sajid Ali'}
            </Text>
            <Text style={styles.otherMatches}>{'Today, 05:28 pm'}</Text>
          </View>
          <Image style={{position: 'absolute', end: 10}} source={imagePath.fi_phone} />
        </FlexSBContainer>
      </TouchableOpacity>
    );
  };

  const emptyComponent = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{...commonStyles.fontBold20}}>{'Coming Soon'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList data={[]} contentContainerStyle={{flexGrow: 1}} ListEmptyComponent={emptyComponent} renderItem={renderChatList} refreshControl={<RefreshControl />} keyExtractor={(_, index) => index.toString()} />
    </View>
  );
};

export default Calling;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  greenContainer: {backgroundColor: colors.green, width: 20, height: 20, borderRadius: 10, justifyContent: 'center'},
  receivedMessage: {...commonStyles.fontSize12, color: colors.black, alignSelf: 'center', marginStart: moderateScale(10)},
  countContainer: {
    backgroundColor: '#D7FFF8',
    justifyContent: 'flex-start',
    width: 160,
    borderRadius: 20,
    padding: 4,
    marginBottom: moderateScaleVertical(10),
  },
  messageImage: {width: 50, height: 50, borderRadius: 25},
  matches: {width: 25, height: 25, borderRadius: 15, borderWidth: 2, borderColor: colors.white},
  otherMatches: {...commonStyles.fontSize13, fontFamily: fontFamily.medium, color: colors.grey_95},
  messageCount: {...commonStyles.fontSize10, color: colors.white, alignSelf: 'center', textAlignVertical: 'center'},
});
