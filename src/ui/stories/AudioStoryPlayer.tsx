// import * as React from 'react';
// import {View, StyleSheet, Image, TouchableNativeFeedback} from 'react-native';
// import {FILE_BASE_URL} from '../../config/constant';
// import {height, width} from '../../theme/responsiveSize';
// import imagePath from '../../config/imagePath';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import colors from '../../theme/colors';

// interface AudioStoryPlayerProps {
//   audio: string;
//   start: (number: number) => void;
//   setLoad: (loading: boolean) => void;
//   stopAnimation: () => void;
//   playAnimation: () => void;
// }
// let audioRecorderPlayer = new AudioRecorderPlayer();
// audioRecorderPlayer?.setSubscriptionDuration(1);
// const AudioStoryPlayer = (props: AudioStoryPlayerProps) => {
//   const {audio, stopAnimation, playAnimation, start} = props;
//   const [isPause, setPause] = React.useState<boolean>(false);
//   const [loading, setLoding] = React.useState<boolean>(true);

//   console.log('====================================');
//   console.log('FILE_BASE_URL + audio', FILE_BASE_URL + audio);
//   console.log('====================================');

//   React.useEffect(() => {
//     (async () => {
//       await audioRecorderPlayer.stopPlayer();
//       await audioRecorderPlayer.startPlayer(FILE_BASE_URL + audio);
//     })();
//   }, [audio]);

//   React.useEffect(() => {
//     let startAnimation = true;
//     audioRecorderPlayer.addPlayBackListener(placeBack => {
//       if (startAnimation) {
//         startAnimation = false;
//         start(placeBack.duration);
//       }
//       if (placeBack.currentPosition === placeBack.duration) {
//         setLoding(false);
//       }
//     });
//     return () => {
//       audioRecorderPlayer.stopPlayer();
//       audioRecorderPlayer.removePlayBackListener();
//     };
//   }, [loading, start]);

//   const playAudio = async () => {
//     if (isPause) {
//       setPause(false);
//       await audioRecorderPlayer.startPlayer();
//       playAnimation();
//       return;
//     }
//     stopAnimation();
//     setPause(true);
//     await audioRecorderPlayer.pausePlayer();
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableNativeFeedback onPress={playAudio} style={styles.playPauseContainer}>
//         <Image style={{width: 70, height: 70, tintColor: colors.white}} source={isPause ? imagePath.play : imagePath.fi_pause_circle} />
//       </TouchableNativeFeedback>
//       {/* {loading && (
//         <ActivityIndicator
//           animating
//           pointerEvents="none"
//           color={colors.error}
//           size="small"
//           style={styles.loaderView}
//           // {...props?.sourceIndicatorProps}
//         />
//       )} */}
//     </View>
//   );
// };

// export default AudioStoryPlayer;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: 'absolute',
//     alignSelf: 'center',
//     zIndex: 999999,
//     height: height,
//     justifyContent: 'center',
//     //top: height / 2,
//     // width: width,
//     // alignItems: 'center',
//   },
//   loaderView: {
//     flex: 1,
//     position: 'absolute',
//     top: '50%',
//     left: '45%',
//   },
//   playPauseContainer: {position: 'absolute', width: width, height: 50, top: height / 2, justifyContent: 'center', alignItems: 'center'},
// });

import React, {useState, useRef} from 'react';
import {View, ActivityIndicator, LayoutAnimation, UIManager, Image, TouchableNativeFeedback} from 'react-native';
// import {styles} from './styles';
import Video from 'react-native-video';
// import {toHHMMSS} from './utils';
// import {Images} from './assets/index';
import {StyleSheet} from 'react-native';
import imagePath from '../../config/imagePath';
import {FILE_BASE_URL} from '../../config/constant';
import {height, width} from '../../theme/responsiveSize';
import colors from '../../theme/colors';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const volumeControlTime = 3000;

const AudioStoryPlayer = props => {
  const {audio, stopAnimation, start, playAnimation} = props;
  const [paused, setPaused] = useState(false);

  const videoRef = useRef(null);
  const controlTimer = useRef(0);

  const duration = useRef(true);

  const [totalLength, setTotalLength] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [volumeControl, setVolumeControl] = useState(false);
  const [repeat, setRepeat] = useState(false);

  console.log('audio', FILE_BASE_URL + audio);

  const onSeek = time => {
    time = Math.round(time);
    videoRef && videoRef?.current.seek(time);
    setCurrentPosition(time);
    setPaused(false);
  };

  const fixDuration = data => {
    setLoading(false);
    playAnimation();
    setTotalLength(Math.floor(data.duration));
  };

  const setTime = data => {
    if (duration.current) {
      duration.current = false;
      start(data?.duration * 1000);
    }
    // setCurrentPosition(Math.floor(data.currentTime));
  };

  const togglePlay = () => {
    if (!paused) {
      stopAnimation();
      setPaused(!paused);
      return;
    }
    playAnimation();

    setPaused(!paused);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  const toggleVolumeControl = () => {
    setVolumeTimer(!volumeControl);
    LayoutAnimation.easeInEaseOut();
    setVolumeControl(!volumeControl);
  };

  const setVolumeTimer = (setTimer = true) => {
    clearTimeout(controlTimer.current);
    controlTimer.current = 0;
    if (setTimer) {
      controlTimer.current = setTimeout(() => {
        LayoutAnimation.easeInEaseOut();
        setVolumeControl(false);
      }, volumeControlTime);
    }
  };

  const onVolumeChange = vol => {
    setVolumeTimer();
    setVolume(vol);
  };

  const resetAudio = () => {
    if (!repeat) {
      setPaused(true);
    }
    setCurrentPosition(0);
  };

  return (
    <View style={{}}>
      <Video
        source={{uri: FILE_BASE_URL + audio}}
        ref={videoRef}
        playInBackground={false}
        audioOnly={true}
        playWhenInactive={true}
        paused={paused}
        onEnd={resetAudio}
        onLoad={fixDuration}
        onLoadStart={() => {
          stopAnimation();
          setLoading(true);
        }}
        onProgress={setTime}
        // volume={volume}
        repeat={repeat}
        style={{height: 0, width: 0}}
      />

      <View style={{flex: 1, backgroundColor: 'red'}}>
        <View style={styles.rowContainer}>
          {/* {(loading && (
            
          )) || (
            // <View style={styles.actionsContainer}>
            //   <TouchableNativeFeedback style={[styles.iconContainer, styles.playBtn]} onPress={togglePlay}>
            //     <Image source={paused ? imagePath.play : imagePath.fi_pause_circle} style={styles.playIcon} />
            //   </TouchableNativeFeedback>
            // </View>
            <View style={styles.container}>
              <TouchableNativeFeedback onPress={togglePlay} style={styles.playPauseContainer}>
                <Image style={{width: 70, height: 70, tintColor: colors.white}} source={paused ? imagePath.play : imagePath.fi_pause_circle} />
              </TouchableNativeFeedback>
            </View>
          )} */}
          {loading && (
            <View style={{marginTop: height / 2, width: width, alignSelf: 'center'}}>
              <ActivityIndicator size="large" color="#FFF" />
            </View>
          )}

          {!loading && (
            <View style={styles.container}>
              <TouchableNativeFeedback onPress={togglePlay} style={styles.playPauseContainer}>
                <Image style={{width: 70, height: 70, tintColor: colors.white}} source={paused ? imagePath.play : imagePath.fi_pause_circle} />
              </TouchableNativeFeedback>
            </View>
          )}
          {/* <View style={styles.sliderContainer}>
            <Slider style={styles.slider} minimumValue={0} maximumValue={Math.max(totalLength, 1, currentPosition + 1)} minimumTrackTintColor={'#fff'} maximumTrackTintColor={'grey'} onSlidingComplete={onSeek} value={currentPosition} />
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default AudioStoryPlayer;

const styles = StyleSheet.create({
  rowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: 'red',
  },
  iconContainer: {
    alignSelf: 'center',
    position: 'relative',
  },
  playBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    width: '100%',
  },
  slider: {
    height: 30,
    width: '100%',
    marginBottom: 3,
  },
  durationContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  crossLine: {
    position: 'absolute',
    transform: [{rotate: '-60deg'}],
    top: 15,
    left: -1,
    width: 30,
    height: 1,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
  },
  volumeControlContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#00000099',
    paddingHorizontal: 16,
    borderRadius: 50,
    ...Platform.select({
      ios: {
        height: 44,
      },
      android: {
        height: 40,
      },
    }),
  },
  volumeSlider: {
    width: '50%',
  },
  timeText: {
    color: '#fff',
    fontSize: 18,
  },
  playIcon: {height: 30, width: 30, resizeMode: 'contain'},

  container: {
    position: 'absolute',
    top: height / 2,
    width: width,
    alignSelf: 'center',
    zIndex: 999999,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loaderView: {
    flex: 1,
    position: 'absolute',
    top: '50%',
    left: '45%',
  },
  playPauseContainer: {width: 50, height: 50, justifyContent: 'center', alignItems: 'center'},
});
