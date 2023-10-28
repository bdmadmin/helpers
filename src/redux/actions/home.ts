import {apiPost, apiGet, setUserData, apiPut, apiDelete} from '../../utils/utils';
import * as urls from '../../config/urls';

export function homeApi(skip: number, limit: number = 50) {
  console.log('SKIPPING', skip);

  return apiGet(urls.HOME_FEED + `?limit=${limit}&skip=${skip}`);
}
export function homeApiWithTag(skip: number, tag: string) {
  return apiGet(urls.HOME_FEED + `?tags=${tag}`);
}

export function getCausesList() {
  return apiGet(urls.CAUSES);
}

export function profileDetailFeed() {
  return apiGet(urls.PROFILE_DETAIL);
}

export function emergencyStories() {
  return apiGet(urls.EMERGENCY_STORIES);
}

export function feedLike(data: any) {
  return apiPost(urls.FEED_LIKE, data);
}

export function feedDislike(data: any) {
  return apiPost(urls.FEED_DISLIKE, data);
}

export function chatRequestApi() {
  return apiGet(urls.CHAT_REQUEST);
}
export function chatReceiverPostNotCreatedApi() {
  return apiGet(urls.CHAT_RECEIVER_POST_NOT_CREATED);
}

export function chatWithRoomId(postId: string, roomId: string) {
  return apiGet(urls.CHAT_WITH_ROOM_ID + '?postId=' + postId + '&room=' + roomId);
}

export function chatWithWithoutRoomId(postId: string) {
  return apiGet(urls.CHAT_WITHOUT_ROOM_ID + postId);
}

export function notificationApi() {
  return apiGet(urls.NOTIFICATION_LISTING);
}
export function pushNotificationChatApi(data:any) {
  return apiPost(urls.PUSH_NOTIFICATION_CHAT,data);
}

export function createEmergencyFeed(data: any) {
  return apiPost(urls.CREATE_EMERGENCY_FEED, data, {
    'Content-Type': 'multipart/form-data',
  });
}

export function createFeed(data: any) {
  return apiPost(urls.CREATE_FEED, data, {
    'Content-Type': 'multipart/form-data',
  });
}

export function deleteOwnFeed(data: any) {
  return apiDelete(urls.FEED_MEDIA_DELETE, data);
}

export function otherUserDetail(userId: string) {
  return apiGet(urls.OTHER_USER_DETAIL + userId);
}

export function getWhoMessageMe(postId: string) {
  return apiGet(urls.REQUEST_USERS + postId);
}

export function chatAcceptRequest(requestStatus: string, data: any) {
  return apiPost(urls.CHAT_ACCEPT_REQUEST + requestStatus, data);
}

export function reportFeed(data: any) {
  return apiPost(urls.REPORT_FEED, data);
}

export function sendMessage(data: any) {
  return apiPost(urls.SEND_MESSAGE, data, {
    'Content-Type': 'multipart/form-data',
  });
}

export function uploadFile(data: any) {
  console.log("urls.UPLOAD_FILE====",urls.UPLOAD_FILE)
  console.log("images=formData====",data)
  return apiPost(urls.UPLOAD_FILE, data, {
    'Content-Type': 'multipart/form-data',
  });
}

export function getUserStories(userId: string) {
  return apiGet(urls.USER_STORIES + userId);
}

export function isUserExist(socialMediaId: string, loginType: string) {
  return apiGet(urls.IS_USER_EXIST + `?socialMediaId=${socialMediaId}&loginType=${loginType}`);
}

export function deleteEmergencyPost(data: any) {
  return apiDelete(urls.DELETE_FEED_EMERGENCY, data, {
    'Content-Type': 'multipart/form-data',
  });
}

/**
 *
 * CREATE_FEED And Mark Complete End Point Is Same
 */
export function markAsCompletePostApi(data: any) {
  console.log('data', JSON.stringify(data));
  return apiPut(urls.CREATE_FEED, data);
}

export function getFeedById(id: any) {
  return apiGet(urls.FEED_INFO_WITH_ID + `?id=${id}`);
}

export function globalSearch(searchText: string) {
  return apiGet(urls.GLOBAL_SEARCH + `${searchText}`);
}

export function logoutApi() {
  return apiPost(urls.LOGOUT, {});
}

export function deleteAccount() {
  return apiDelete(urls.DELETE_USER, {});
}

/**
 *
 * @param type 1 is Android and 2 is IOS
 * @returns
 */
export function updateVersion(type: '1' | '2') {
  return apiGet(urls.UPDATE_VERSION + type, {});
}

export function updateFeed(data: any) {
  return apiPut(urls.UPDATE_FEED, data);
}

export function reportEmpergencyPost(data: any) {
  return apiPost(urls.REPORT_EMERGENCY, data);
}
