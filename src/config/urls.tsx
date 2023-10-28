import Config from 'react-native-config';

const LIVE_URL ="http://15.206.105.61:8001/"// "https://helpersfamily.com/" //Config.DEV_BASE_URL
const DEV ="http://15.206.105.61:8001/"// "https://helpersfamily.com/" //Config.DEV_BASE_URL
export const FireStore = "https://helpers-family-43557-default-rtdb.asia-southeast1.firebasedatabase.app"

const IS_DEVELPOMENT_URL = !__DEV__;

export const API_BASE_URL = `${IS_DEVELPOMENT_URL ? DEV : LIVE_URL}api/v1/`;

export const BASE_UPLOAD_FILE = `${IS_DEVELPOMENT_URL ? DEV : LIVE_URL}`;

export const getUploadApiUrl = (endpoint: string) => BASE_UPLOAD_FILE + endpoint;

export const getApiUrl = (endpoint: string) => API_BASE_URL + endpoint;

export const LOGIN = getApiUrl('user');

export const OTP_VERIFICATION = getApiUrl('user/verifyOTP');

export const EDIT_PROFILE = getApiUrl('user');

export const SOCIAL_USER_CHECK = getApiUrl('user/socialMediaId');

export const SOCIAL_LOGIN = getApiUrl('login');

export const SPLASH_LOGO = getApiUrl('user/logo');

/************************************************** Home **************************************************/

export const HOME_FEED = getApiUrl('feeds');

export const CAUSES = getApiUrl('causes');

export const PROFILE_DETAIL = getApiUrl('user/detail');

export const EMERGENCY_STORIES = getApiUrl('feeds/emergency/user');

export const FEED_LIKE = getApiUrl('feeds/like');

export const FEED_DISLIKE = getApiUrl('feeds/dislike');

export const CHAT_REQUEST = getApiUrl('chat/request');

export const CHAT_RECEIVER_POST_NOT_CREATED = getApiUrl('chat/receiverChatPostNotCreated');

export const CHAT_WITH_ROOM_ID = getApiUrl('chat');

export const CHAT_WITHOUT_ROOM_ID = getApiUrl('chat/requestHistory?postId=');

export const NOTIFICATION_LISTING = getApiUrl('notification');

export const PUSH_NOTIFICATION_CHAT = getApiUrl('chat/push');

export const CREATE_EMERGENCY_FEED = getApiUrl('feeds/emergency');

export const CREATE_FEED = getApiUrl('feeds');

export const FEED_MEDIA_DELETE = getApiUrl('feeds');

export const OTHER_USER_DETAIL = getApiUrl('user/detail/?id=');

export const REQUEST_USERS = getApiUrl('chat/requestDetail?postId=');

export const CHAT_ACCEPT_REQUEST = getApiUrl('chat/accept?requestStatus=');

export const REPORT_EMERGENCY = getApiUrl('reports/emergency');

export const SEND_MESSAGE = getApiUrl('chat');

export const UPLOAD_FILE = getUploadApiUrl('upload');

export const USER_STORIES = getApiUrl('feeds/emergency?userId=');

export const IS_USER_EXIST = getApiUrl('user/socialMediaId');

export const DELETE_FEED_EMERGENCY = getApiUrl('feeds/emergency');

export const FEED_INFO_WITH_ID = getApiUrl('feeds/detail');

export const GLOBAL_SEARCH = getApiUrl('search?search=');

export const REPORT_FEED = getApiUrl('reports/feeds');

export const LOGOUT = getApiUrl('user/logout');

export const DELETE_USER = getApiUrl('user');

export const UPDATE_VERSION = getApiUrl('version?type=');

export const UPDATE_FEED = getApiUrl('feeds');
