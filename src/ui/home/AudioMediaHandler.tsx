import * as React from "react";
import { Image, View, StyleSheet, Pressable } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { useDispatch, useSelector } from "react-redux";
import FlexSBContainer from "../../components/FlexSBContainer";
import { FILE_BASE_URL } from "../../config/constant";
import imagePath from "../../config/imagePath";
import { selectedIndexAudio } from "../../redux/reducer/AudioSlice/audioSlice";
import { moderateScale } from "../../theme/responsiveSize";
import Sliders from "../../components/Sliders";

interface AudioMediaHandlerProps {
  audio: string;
  // outerIndex: number;
}
// let audioRecorderPlayer = new AudioRecorderPlayer();
// audioRecorderPlayer?.setSubscriptionDuration(0.09);

const AudioMediaHandler = ({ audio,  }: AudioMediaHandlerProps) => {
  // const customEqual = (oldValue, newValue) => outerIndex === newValue;
  // const isSelected = useSelector((state) => state?.audio.selectedIndex);
  // const progressRef = React.useRef();
  // const dispatch = useDispatch();
  // const isPlaying = isSelected === outerIndex;

  // const playAudio = async () => {
  //   audioRecorderPlayer.addPlayBackListener((placeBack) => {
  //     progressRef?.current?.progress(
  //       parseInt(
  //         Math.abs(
  //           (placeBack.currentPosition / placeBack.duration) * 100
  //         ).toFixed(0),
  //         10
  //       )
  //     );
  //     if (placeBack.currentPosition === placeBack.duration) {
  //       dispatch(selectedIndexAudio(-1));
  //     }
  //   });
  //   if (isPlaying) {
  //     await audioRecorderPlayer.stopPlayer();
  //     dispatch(selectedIndexAudio(-1));
  //     return;
  //   }
  //   if (isSelected !== -1) {
  //     await audioRecorderPlayer.stopPlayer();
  //   }
  //   await audioRecorderPlayer.startPlayer(FILE_BASE_URL + audio);
  //   dispatch(selectedIndexAudio(outerIndex));
  // };
  // const getaudio = async () => {
  //   try {
  //     let url =
  //       "https://helpersfamily.s3.ap-south-1.amazonaws.com/posts/audios/postpic_AW798mo460.mp3";
  //     await SoundPlayer.loadUrl(url, (url) => {
  //       console.log("url--=-=-=", url);
  //     });
  //     var finish = SoundPlayer.onFinishedLoading((ll) => {
  //       console.log("fiish log", ll);
  //     });
  //     console.log("finish 22222", finish);
  //     const info = await SoundPlayer.getInfo(); // Also, you need to await this because it is async
  //     console.log("getInfo", info);
  //     // await SoundPlayer.play()
  //   } catch (e) {
  //     console.log(`cannot play the sound file`, e);
  //   }
  // };

  // React.useEffect(() => {
  //   getaudio();
  // }, [audio]);

  const URL = React.useMemo(()=>{return audio},[])

  return (
    <View style={styles.container}>
      {/* <FlexSBContainer containerStyle={{ justifyContent: "center" }}> */}
        {/* <Image
          style={{ marginHorizontal: moderateScale(10) }}
          source={imagePath.audioWave}
        /> */}
        {/* <Pressable onPress={playAudio}>
          {isPlaying ? (
            // <AudioCircleLoaderMemo ref={progressRef} />
            <></>
          ) : (
            <Image
              style={{
                marginHorizontal: moderateScale(20),
                width: 30,
                height: 30,
              }}
              source={isPlaying ? imagePath.fi_pause_circle : imagePath.play}
            />
          )}
          <Image
            style={{
              marginHorizontal: moderateScale(20),
              width: 30,
              height: 30,
            }}
            source={isPlaying ? imagePath.fi_pause_circle : imagePath.play}
          />
        </Pressable> */}
        <Sliders url={URL} />
      {/* </FlexSBContainer> */}
    </View>
  );
};

export default React.memo(AudioMediaHandler);

// const AudioCircleLoader = React.forwardRef<any, any>((props, ref) => {
//   const [loadingPercentage, setLoadingPercentage] = React.useState<number>(0);
//   const progress = (percentage: number | string) => {
//     setLoadingPercentage(percentage);
//   };

//   React.useImperativeHandle(ref, () => {
//     return {
//       progress,
//     };
//   });

//   return <AnimatedCircularProgress size={30} width={3} fill={loadingPercentage} tintColor="#00e0ff" onAnimationComplete={() => console.log('onAnimationComplete')} backgroundColor="#3d5875" />;
// });

// const AudioCircleLoaderMemo = React.memo(AudioCircleLoader);

const styles = StyleSheet.create({
  container: {},
});
