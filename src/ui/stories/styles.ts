// // import * as React from 'react';
// // import {ScrollView} from 'react-native';
// // import HeaderArrowWithText from '../../components/HeaderArrowWithText';
// // import WrapperContainer from '../../components/WrapperContainer';
// // import {termsAndConditions, privacyPolicy, aboutKulture} from '../../redux/actions/openApi';
// // import {moderateScaleVertical} from '../../theme/responsiveSize';
// // // import commonStyles from '../../utils/commonStyles';
// // import {showError} from '../../utils/utils';
// // import RenderHtml from 'react-native-render-html';
// // import colors from '../../theme/colors';
// // import fontFamily from '../../theme/fontFamily';
// // interface GeneralProps {
// //   route: {
// //     params: Params;
// //   };
// // }

// // interface Params {
// //   type: string;
// // }

// // const General = (props: GeneralProps) => {
// //   const [text, setText] = React.useState<string>();
// //   const [loading, setLoading] = React.useState<boolean>();

// //   const {type} = props.route?.params;

// //   const API_TYPE = {
// //     'Terms and conditions': async () => {
// //       try {
// //         const data = await termsAndConditions();
// //         console.log('datadatadatadata', data);
// //         data?.length > 0 && setText(data[0]?.terms_conditions);
// //       } catch (error) {
// //         showError(error?.message);
// //       }
// //     },
// //     'Privacy policy': async () => {
// //       try {
// //         const data = await privacyPolicy();

// //         data?.length > 0 && setText(data[0]?.policy_terms);
// //       } catch (error) {
// //         showError(error?.message);
// //       }
// //     },
// //     About: async () => {
// //       try {
// //         const data = await aboutKulture();
// //         data?.length > 0 && setText(data[0]?.about);
// //       } catch (error) {
// //         showError(error?.message);
// //       }
// //     },
// //   };

// //   React.useEffect(() => {
// //     API_TYPE[type]();
// //   }, []);

// //   // if (loading) {
// //   //   return (

// //   //   )
// //   // }

// //   return (
// //     <WrapperContainer>
// //       <HeaderArrowWithText headerText={type} />

// //       {/* <View style={{flex: 1, backgroundColor: 'red'}} /> */}

// //       <ScrollView style={{padding: 10, flex: 1}} showsVerticalScrollIndicator={false}>
// //         <RenderHtml
// //           defaultTextProps={{
// //             style: {
// //               color: colors.black,
// //               fontFamily: fontFamily.regular,
// //               marginBottom: moderateScaleVertical(20),
// //             },
// //           }}
// //           source={{html: text?.toString()}}
// //         />
// //       </ScrollView>
// //     </WrapperContainer>
// //   );
// // };

// // export default General;

// import * as React from 'react';
// import {StyleSheet, Animated, Dimensions, Platform, View} from 'react-native';

// import Story, {type StoryModel} from './Story';

// const {width} = Dimensions.get('window');
// const perspective = width - 70;
// const angle = Math.atan(perspective / (width / 2));
// const ratio = Platform.OS === 'ios' ? 2 : 1.2;

// type StoriesProps = {
//   stories: StoryModel[];
// };

// type StoriesState = {
//   x: Animated.Value;
// };

// export default class Stories extends React.PureComponent<StoriesProps, StoriesState> {
//   stories = [];

//   state = {
//     x: new Animated.Value(0),
//   };

//   constructor(props) {
//     super(props);
//     this.stories = [1, 2, 3, 4, 5, 5].map(() => React.createRef());
//   }

//   componentDidMount() {
//     const {x} = this.state;
//     x.addListener(() =>
//       this.stories.forEach((story, index) => {
//         const offset = index * width;
//         const inputRange = [offset - width, offset + width];
//         const translateX = x
//           .interpolate({
//             inputRange,
//             outputRange: [width / ratio, -width / ratio],
//             extrapolate: 'clamp',
//           })
//           .__getValue();

//         const rotateY = x
//           .interpolate({
//             inputRange,
//             outputRange: [`${angle}rad`, `-${angle}rad`],
//             extrapolate: 'clamp',
//           })
//           .__getValue();

//         const parsed = parseFloat(rotateY.substr(0, rotateY.indexOf('rad')), 10);
//         const alpha = Math.abs(parsed);
//         const gamma = angle - alpha;
//         const beta = Math.PI - alpha - gamma;
//         const w = width / 2 - ((width / 2) * Math.sin(gamma)) / Math.sin(beta);
//         const translateX2 = parsed > 0 ? w : -w;

//         const style = {
//           transform: [{perspective}, {translateX}, {rotateY}, {translateX: translateX2}],
//         };

//         console.log('stylestyle', style);

//         story.current.setNativeProps({style});
//       }),
//     );
//   }
//   // {"transform": [{"perspective": 360}, {"translateX": 300}, {"rotateY": "1.1071487177940904rad"}, {"translateX": 180}]}
//   // {"transform": [{"perspective": 360}, {"translateX": 300}, {"rotateY": "1.1071487177940904rad"}, {"translateX": 180}]}
//   render(): React.Node {
//     const {x} = this.state;
//     const {stories} = this.props;
//     return (
//       <View style={styles.container}>
//         {[1, 2, 3, 4, 5, 5]
//           .map((story, i) => (
//             <Animated.View ref={this.stories[i]} style={StyleSheet.absoluteFill} key={story.id}>
//               <Story {...{story}} />
//             </Animated.View>
//           ))
//           .reverse()}
//         <Animated.ScrollView
//           ref={this.scroll}
//           style={StyleSheet.absoluteFillObject}
//           showsHorizontalScrollIndicator={false}
//           scrollEventThrottle={16}
//           snapToInterval={width}
//           contentContainerStyle={{width: width * [1, 2, 3, 4, 5, 5].length}}
//           onScroll={Animated.event(
//             [
//               {
//                 nativeEvent: {
//                   contentOffset: {x},
//                 },
//               },
//             ],
//             {useNativeDriver: true},
//           )}
//           decelerationRate={0.99}
//           horizontal
//         />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
// });
