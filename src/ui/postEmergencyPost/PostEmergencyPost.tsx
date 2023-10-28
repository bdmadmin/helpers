/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Text, View, Pressable, TextInput, Image, Platform} from 'react-native';
import WrapperContainer from '../../components/WrapperContainer';
import Modal from 'react-native-modalbox';
import {height, moderateScale, moderateScaleVertical, textScale, width} from '../../theme/responsiveSize';
import FlexSBContainer from '../../components/FlexSBContainer';
import commonStyles from '../../utils/commonStyles';
import colors from '../../theme/colors';
import imagePath from '../../config/imagePath';
import navigationString from '../../config/navigationString';
import styles from './styles';
import BottomSheet from '@gorhom/bottom-sheet';
import fontFamily from '../../theme/fontFamily';
// import CaptureMediaList from './CaptureMediaList';
import {useDispatch, useSelector} from 'react-redux';
import {showSuccess} from '../../utils/utils';
import {getAudioPermission, getCurrentLocation, locationPermission} from '../../utils/helper';
import AudioRecorderPlayer, {AVEncoderAudioQualityIOSType, AVEncodingOption, AudioEncoderAndroidType, AudioSourceAndroidType} from 'react-native-audio-recorder-player';
import CaptureMediaList from '../postFeed/CaptureMediaList';
import {createEmergencyFeed} from '../../redux/actions/home';
import {GeoPosition} from 'react-native-geolocation-service';
import {capturePhotos, recordedVideo} from '../../redux/reducer/AudioVideoList/audioVideoList';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
// import FastImage from 'react-native-fast-image';
interface PostFeedProps {}
const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.09);
const PostEmergencyPost = (props: PostFeedProps) => {
  const [postMessage, setPostMessage] = React.useState<string | undefined>();
  const [isLoading, setLoading] = React.useState<false>();
  const [isRecording, setRecording] = React.useState<false>();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const isContinue = React.useRef<boolean>(false);
  const [recordedAudio, setRecordedAudio] = React.useState<string>('');
  const photos = useSelector(state => state.audioVideoList.photos);
  const video = useSelector(state => state.audioVideoList.video);
  const isRecordingStart = React.useRef<boolean>();
  const dispatch = useDispatch();
  const openCamera = (clickPictureOnly: boolean) => {
    props?.navigation.navigate(navigationString.VISION_CAMERA, {clickPictureOnly, emergencyPost: true});
  };
  const snapPoints = React.useMemo(() => (Platform.OS !== 'ios' ? ['20%', '20%'] : ['30%', '30%']), []);

  const handleSheetChanges = React.useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const onStartRecording = async () => {
    if (isRecordingStart.current) {
      setRecording(false);
      onStopRecord();
      return;
    }
    if (Platform.OS === 'android') {
      try {
        await getAudioPermission();
      } catch (error) {}
    }
    try {
      setRecording(true);
      await audioRecorderPlayer.startRecorder(undefined, {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      });
      isRecordingStart.current = true;
    } catch (error) {
      console.log('errorerrorerror', error);
    }
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordedAudio(result);
    isRecordingStart.current = false;
  };

  const goToPostType = async () => {
    if (isContinue.current) {
      return;
    }

    if (!video && !recordedAudio && photos.length === 0 && !postMessage) {
      showSuccess('Please add some content');
      return;
    }
    setLoading(true);
    isContinue.current = true;
    const form = new FormData();
    const value = await locationPermission();
    if (value === 'granted') {
      var location = (await getCurrentLocation()) as GeoPosition;
      form.append('latitude', location?.coords.latitude);
      form.append('longitude', location?.coords.longitude);
    }
    form.append('title', 'User');
    form.append('description', postMessage);
    photos.forEach((photo: string) => {
      form.append('images[]', {
        uri: photo,
        type: 'images/jpeg',
        name: 'image.jpg',
      });
    });
    if (video) {
      form.append('videos[]', {
        uri: video,
        type: 'video/mp4',
        name: 'video.mp4',
      });
    }
    if (recordedAudio) {
      form.append('audios[]', {
        uri: recordedAudio,
        type: 'audio/mp3',
        name: 'audio.mp3',
      });
    }
    form.append('type', 1);
    form.append('isEmergency', 1);

    try {
      await createEmergencyFeed(form);
      showSuccess('Emergency Post created');
      dispatch(capturePhotos([]));
      dispatch(recordedVideo(''));
      props?.navigation.goBack();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const isButtonEnable = React.useMemo(() => {
    return photos.length > 0 || video || postMessage || recordedAudio;
  }, [photos, video, postMessage, recordedAudio]);

  const isTextEnable = React.useMemo(() => {
    return photos.length > 0 || video || recordedAudio;
  }, [photos, video, recordedAudio]);

  const onGoBack = () => props?.navigation.goBack();

  return (
    <WrapperContainer isLoading={isLoading}>
      <Modal backdropPressToClose={false} isOpen={true} onClosed={() => {}} position={'bottom'} entry={'bottom'} animationDuration={1000} coverScreen={false} swipeToClose={false} style={{height: height, width: width}}>
        <View style={styles.container}>
          <FlexSBContainer containerStyle={{padding: 20}}>
            <FlexSBContainer containerStyle={styles.container}>
              <FlexSBContainer onPress={onGoBack} containerStyle={{justifyContent: 'flex-start'}}>
                <Image style={{tintColor: colors.black, marginEnd: moderateScale(10)}} source={imagePath.closex} />
                <Text style={{...commonStyles.fontSize16, color: colors.grey_black}}>{'Add Emergency Post'}</Text>
              </FlexSBContainer>
              <Pressable disabled={!!isButtonEnable === false} onPress={goToPostType} style={{...styles.continueButton, backgroundColor: isButtonEnable ? colors.themeColor : colors.dim_theme_color}}>
                <Text style={{...commonStyles.fontSize14, color: colors.white}}>{'Continue'}</Text>
              </Pressable>
            </FlexSBContainer>
          </FlexSBContainer>
        </View>
        <ScrollView bounces={false} style={{flex: 1}}>
          <TextInput
            value={postMessage}
            placeholderTextColor={colors.grey}
            placeholder="Tab to type..."
            style={{
              ...styles.textInput,
              flex: video || recordedAudio ? 0.2 : 1,
              fontFamily: fontFamily.bold,
              fontSize: textScale(photos.length > 0 || video || recordedAudio ? 15 : 24),
              maxHeight: photos.length > 0 ? 100 : 500,
              lineHeight: 30,
            }}
            numberOfLines={5}
            multiline
            returnKeyType={'done'}
            onChangeText={setPostMessage}
          />
          <CaptureMediaList setRecordedAudio={setRecordedAudio} recordedAudio={recordedAudio} />
        </ScrollView>

        <BottomSheet ref={bottomSheetRef} style={styles.sheetContainer} index={1} snapPoints={snapPoints} onChange={handleSheetChanges}>
          <View style={{padding: 20}}>
            <Text style={{...commonStyles.fontSize13, marginVertical: moderateScaleVertical(10)}}>{'Live photo, video and audio'}</Text>
            <FlexSBContainer containerStyle={{justifyContent: 'flex-start'}}>
              <Pressable onPress={() => !isButtonEnable && openCamera(true)}>
                <Image style={{width: 50, height: 50, opacity: isButtonEnable ? 0.2 : 1}} source={imagePath.camera} />
              </Pressable>
              <Pressable onPress={() => !isButtonEnable && openCamera(false)}>
                <Image style={{width: 50, height: 50, opacity: isButtonEnable ? 0.2 : 1}} source={imagePath.video} />
              </Pressable>
              <Pressable onPress={() => !isButtonEnable && onStartRecording()}>
                {isRecording ? <FastImage style={styles.micIcon} source={imagePath.mic_gif} /> : <Image source={isRecording ? imagePath.mic_gif : imagePath.mic} style={styles.micIcon} resizeMode={'contain'} />}
              </Pressable>
            </FlexSBContainer>
          </View>
        </BottomSheet>
      </Modal>
    </WrapperContainer>
  );
};

export default PostEmergencyPost;
