import * as React from 'react';
import {StyleSheet, FlatList, Image, Pressable, View, Text, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import imagePath from '../../config/imagePath';
import {capturePhotos, recordedVideo} from '../../redux/reducer/AudioVideoList/audioVideoList';
import colors from '../../theme/colors';
import {moderateScale, moderateScaleVertical, width} from '../../theme/responsiveSize';
import Video from 'react-native-video';
import FlexSBContainer from '../../components/FlexSBContainer';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import commonStyles from '../../utils/commonStyles';

interface CaptureMediaListProps {
  recordedAudio: string;
  setRecordedAudio?: (v: string) => void;
}
let audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer?.setSubscriptionDuration(0.09);
const CaptureMediaList = (_: CaptureMediaListProps) => {
  const {recordedAudio, setRecordedAudio} = _;
  const photos = useSelector(state => state.audioVideoList.photos);
  const video = useSelector(state => state.audioVideoList.video);
  const dispatch = useDispatch();
  const [isPlaying, setPlaying] = React.useState<boolean>(false);
  const deleteImage = (image: string) => {
    dispatch(capturePhotos(photos.filter((x: string) => x !== image)));
  };

  const deleteVideo = () => {
    dispatch(recordedVideo(''));
  };

  const imageHandler = ({item}: any) => {
    return (
      <>
        <FastImage style={styles.normalImage} resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'} source={{uri: `${item}`}} />
        <Pressable
          style={styles.deleteImage}
          onPress={() => {
            deleteImage(item);
          }}>
          <Image style={styles.deleteImageMain} source={imagePath.delete} />
        </Pressable>
      </>
    );
  };

  const playAudio = async () => {
    audioRecorderPlayer.addPlayBackListener(placeBack => {
      // progressRef?.current?.progress(parseInt(Math.abs((placeBack.currentPosition / placeBack.duration) * 100).toFixed(0), 10));
      if (placeBack.currentPosition === placeBack.duration) {
        setPlaying(false);
      }
    });
    if (isPlaying) {
      await audioRecorderPlayer.stopPlayer();
      // dispatch(selectedIndexAudio(-1));
      setPlaying(false);
      return;
    }
    await audioRecorderPlayer.startPlayer(recordedAudio);
    setPlaying(true);
  };

  const renderAudioPlayer = () => {
    return (
      <View>
        <FlexSBContainer containerStyle={styles.flexContainer}>
          <Image style={{marginHorizontal: moderateScale(10)}} source={imagePath.audioWave} />
          <Pressable onPress={playAudio}>
            <Image style={{marginHorizontal: moderateScale(20), width: 30, height: 30}} source={isPlaying ? imagePath.fi_pause_circle : imagePath.play} />
          </Pressable>
        </FlexSBContainer>
        <Text
          onPress={async () => {
            await audioRecorderPlayer.stopPlayer();
            setRecordedAudio('');
          }}
          style={{...commonStyles.fontBold16, padding: 10}}>
          {'Delete'}
        </Text>
      </View>
    );
  };

  return (
    <>
      <>
        {video && <Video style={styles.videoContainer} resizeMode={'cover'} controls={true} source={{uri: video}} />}
        {video && (
          <Pressable
            style={styles.deleteImageVideo}
            onPress={() => {
              deleteVideo();
            }}>
            <Image style={styles.deleteImageMain} source={imagePath.delete} />
          </Pressable>
        )}
      </>
      <View>
        <FlatList style={{backgroundColor: 'red'}} horizontal initialNumToRender={2} pagingEnabled renderItem={imageHandler} data={photos} decelerationRate={'fast'} keyExtractor={(_, index) => index.toString()} />
      </View>
      {recordedAudio && <View style={{flex: 1}}>{renderAudioPlayer()}</View>}
    </>
  );
};

export default CaptureMediaList;

const styles = StyleSheet.create({
  flexContainer: {justifyContent: 'center', marginTop: moderateScaleVertical(30)},
  normalImage: {width: width, height: 320, backgroundColor: colors.e5},
  deleteImage: {position: 'absolute', end: 40, top: 10},
  videoContainer: {
    width: 400,
    height: 300,
    borderWidth: 1,
  },
  deleteImageVideo: {position: 'absolute', end: 20, top: 200},
  deleteImageMain: {
    width: 30,
    height: 40,
    resizeMode: 'contain',
  },
});
