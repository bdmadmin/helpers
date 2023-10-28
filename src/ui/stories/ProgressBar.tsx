// import React, {useState, useEffect} from 'react';
// import {View, StyleSheet, Animated} from 'react-native';
// import colors from '../../theme/colors';

// const styles = StyleSheet.create({
//   progressBar: {
//     backgroundColor: 'black',
//     borderRadius: 5,
//     flex: 1,
//     height: 2,
//     margin: 7,
//   },
//   activeProgress: {
//     backgroundColor: 'white',
//     borderRadius: 5,
//     flex: 1,
//   },

//   backgroundContainer: {flex: 1, backgroundColor: colors.grey_072, justifyContent: 'center'},
// });

// interface ProgressPros {
//   duration: number;
//   index: number;
//   activeProgressIndex: number;
//   onProgressComplete: () => void;
//   onHold: number;
//   onStoryComplete: () => void;
//   isNext: boolean;
//   totalLength: number;
//   isHold: number;
// }

// const ProgressBar = ({duration, index, activeProgressIndex, onProgressComplete, isHold, onStoryComplete, isNext, totalLength}: ProgressPros) => {
//   let listener: any;
//   let [progressDuration, setProgressDuration] = useState(0);
//   let [position, setPosition] = useState(1);

//   let startProgress = () => {
//     listener = setTimeout(() => {
//       if (!isHold) {
//         let mBy = 100 / duration;
//         console.log('mBymBy', mBy);
//         let value = position * mBy;
//         console.log('====================================');
//         console.log('valuevaluevalue', value);
//         console.log('====================================');

//         // setPosition(position + 1);
//         setProgressDuration(value);
//       }
//     }, 40);
//   };

//   let blockProgress = () => {
//     clearTimeout(listener);
//   };

//   useEffect(() => {
//     if (index === activeProgressIndex) {
//       if (position <= duration) {
//         startProgress();
//       } else {
//         blockProgress();
//         if (index === totalLength - 1) {
//           onStoryComplete();
//         } else {
//           onProgressComplete();
//         }
//       }
//     } else if (index > activeProgressIndex) {
//       setProgressDuration(0);
//       setPosition(1);
//     } else if (index < activeProgressIndex) {
//       if (isNext) {
//         setPosition(duration);
//         setProgressDuration(100);
//       }
//     }
//   }, [position, isHold]);

//   useEffect(() => {
//     if (index === activeProgressIndex) {
//       if (position <= duration) {
//         if (!isNext) {
//           setProgressDuration(0);
//           setPosition(1);
//         } else {
//           startProgress();
//         }
//       } else {
//         setProgressDuration(0);
//         setPosition(1);
//       }
//     } else if (index > activeProgressIndex) {
//       setPosition(0);
//       setProgressDuration(0);
//     } else if (index < activeProgressIndex) {
//       setPosition(duration);
//       setProgressDuration(100);
//     }
//     return () => {
//       blockProgress();
//     };
//   }, [activeProgressIndex]);

//   return (
//     <View style={styles.progressBar}>
//       <View style={[styles.activeProgress, styles.backgroundContainer]}>
//         <Animated.View style={[styles.activeProgress, {width: `${progressDuration}%`}]} />
//       </View>
//     </View>
//   );
// };

// export default ProgressBar;
