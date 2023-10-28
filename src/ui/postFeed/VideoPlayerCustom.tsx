// import * as React from 'react';
// import {Text, View, StyleSheet} from 'react-native';
// import {Video} from 'react-native-video';
// import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
// import {useState} from 'react';
// interface VideoPlayerCustomProps {}

// const VideoPlayerCustom = (props: VideoPlayerCustomProps) => {
//   const {file} = props;
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [paused, setPaused] = useState(false);
//   const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
//   return (
//     <View style={styles.container}>
//       <Video style={{width: 300, height: 400}} source={{uri: file}} />
//       <MediaControls
//         isFullScreen={isFullScreen}
//         duration={duration}
//         isLoading={isLoading}
//         mainColor="orange"
//         // onFullScreen={noop}
//         // onPaused={onPaused}
//         // onReplay={onReplay}
//         // onSeek={onSeek}
//         // onSeeking={onSeeking}
//         playerState={playerState}
//         progress={currentTime}
//         children={undefined}
//         containerStyle={undefined}
//         onPaused={function (playerState: PLAYER_STATES): void {
//           throw new Error('Function not implemented.');
//         }}
//         onReplay={function (): void {
//           throw new Error('Function not implemented.');
//         }}
//         onSeek={function (value: number): void {
//           throw new Error('Function not implemented.');
//         }}
//         onSeeking={function (value: number): void {
//           throw new Error('Function not implemented.');
//         }}
//       />
//     </View>
//   );
// };

// export default VideoPlayerCustom;

// const styles = StyleSheet.create({
//   container: {},
// });
