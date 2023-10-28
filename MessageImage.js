/**
 * I have done some changes in react-native-gifted-chat in MessageImage so show loading of image
 * so when we install npm in that case just copy this code in MessageImage class
 */

// import PropTypes from 'prop-types';
// import React, {useState} from 'react';
// import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
// // TODO: support web
// import Lightbox from 'react-native-lightbox-v2';
// import {StylePropType} from './utils';
// import FastImage from 'react-native-fast-image';
// const styles = StyleSheet.create({
//   container: {},
//   image: {
//     width: 150,
//     height: 100,
//     borderRadius: 13,
//     margin: 3,
//     resizeMode: 'cover',
//   },
//   imageActive: {
//     flex: 1,
//     resizeMode: 'contain',
//   },
// });
// export function MessageImage({containerStyle, lightboxProps = {}, imageProps = {}, imageStyle, currentMessage}) {
//   const [isLoading, setLoading] = useState(true);
//   if (currentMessage == null) {
//     return null;
//   }
//   return (
//     <View style={[styles.container, containerStyle]}>
//       <Lightbox
//         activeProps={{
//           style: styles.imageActive,
//         }}
//         {...lightboxProps}>
//         <FastImage {...imageProps} style={[styles.image, imageStyle]} onLoadEnd={() => setLoading(false)} onLoadStart={() => setLoading(true)} source={{uri: currentMessage.image}}>
//           {isLoading && (
//             <View style={{flex: 1, justifyContent: 'center'}}>
//               <ActivityIndicator style={{alignSelf: 'center'}} size={30} color={'red'} />
//             </View>
//           )}
//         </FastImage>
//       </Lightbox>
//     </View>
//   );
// }
// MessageImage.propTypes = {
//   currentMessage: PropTypes.object,
//   containerStyle: StylePropType,
//   imageStyle: StylePropType,
//   imageProps: PropTypes.object,
//   lightboxProps: PropTypes.object,
// };
// //# sourceMappingURL=MessageImage.js.map
