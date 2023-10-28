import {Dimensions, Platform} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
export const HOME_HEADER = 58 * 2.4;
export const DURATIONS = [2, 4, 6, 8, 16, 24];

export const MODAL_TYPE = {
  1: 'Add Identity',
  2: 'Company type',
  3: 'Country',
  4: 'State',
  5: 'City',
  6: 'Employment type',
  7: 'Department',
};

export const STATIC_MODAL_TYPE = {
  1: 'Workplace type',
  2: 'Time Period',
};

export const DEVICE_TYPE = 'mobile';

// export const CANDIDATE_ACTION = [
//   {text: 'Request for verification', image: imagePath.request_verify_ic},
//   {text: 'Interview questions', image: imagePath.interview_ques_ic},
//   {text: 'Face to face interview', image: imagePath.face_interview_ic},
//   {text: 'Video Call ', image: imagePath.video_interview_ic},
//   {text: 'Audio Call', image: imagePath.call_ic},
//   {text: 'Send Message', image: imagePath.send_msg_ic},
// ];

// export const fileUrl = 'https://kultureapp-assets.s3.us-west-2.amazonaws.com/public/';

export const T_AND_C = 'https://helpersfamily.com/terms';
export const ABOUT = 'https://helpersfamily.com/about';
export const PRIVACY_POLICY = 'https://helpersfamily.com/privacypolicy';
export const HELP = 'https://helpersfamily.com/contact';

export const FILE_BASE_URL = 'https://helpersfamily.s3.ap-south-1.amazonaws.com/';

export const CONTENT_SPACING = 15;

const SAFE_BOTTOM =
  Platform.select({
    ios: StaticSafeAreaInsets?.safeAreaInsetsBottom,
  }) ?? 0;

export const SAFE_AREA_PADDING = {
  paddingLeft: StaticSafeAreaInsets?.safeAreaInsetsLeft + CONTENT_SPACING,
  paddingTop: StaticSafeAreaInsets?.safeAreaInsetsTop + CONTENT_SPACING,
  paddingRight: StaticSafeAreaInsets?.safeAreaInsetsRight + CONTENT_SPACING,
  paddingBottom: SAFE_BOTTOM + CONTENT_SPACING,
};

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 20;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android: Dimensions.get('screen').height - StaticSafeAreaInsets?.safeAreaInsetsBottom,
  ios: Dimensions.get('window').height,
}) as number;

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;

export const ANDROID_URL = 'market://details?id=com.helpersfamily';

export const IPHONE_URL = 'https://itunes.apple.com/app/id1611893849';
