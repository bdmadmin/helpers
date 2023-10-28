import {setUserData, apiPost, apiGet, showError, apiPut} from '../../utils/utils';
import * as urls from '../../config/urls';

const saveUserData = data => {
  //   dispatch({
  //     type: types.LOGIN,
  //     payload: data,
  //   });
};

export const saveAdminData = data => dispatch => {
  //   dispatch({
  //     type: types.ADMIN,
  //     payload: data,
  //   });
};

export const loginUser = data => {
  //   dispatch({
  //     type: types.LOGIN,
  //     payload: {...data, isBlocked: true},
  //   });
};

export function loginUserApi(data: any) {
  return new Promise((resolve, reject) => {
    apiPost(urls.LOGIN, data)
      .then(res => {
        setUserData({...res, firstName: data?.loginType !== 'mobile' ? res?.firstName : ''}).then(suc => {
          resolve(res);
        });
      })
      .catch(error => {
        !data?.social_key && showError(error?.message);
        reject(error);
      });
  });
}

export function splashLogo() {
  return new Promise((resolve, reject) => {
    apiGet(urls.SPLASH_LOGO)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function verifyOtpApi(data: unknown) {
  return new Promise((resolve, reject) => {
    apiPost(urls.OTP_VERIFICATION, data)
      .then(res => {
        setUserData(res).then(suc => {
          resolve(res);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function updateProfile(data: unknown) {
  return new Promise((resolve, reject) => {
    apiPut(urls.EDIT_PROFILE, data, {
      'Content-Type': 'multipart/form-data',
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function isSocialIdExist(socialId: string, loginType: string) {
  return new Promise((resolve, reject) => {
    apiGet(urls.SOCIAL_USER_CHECK + '?socialMediaId=' + socialId + '&loginType=' + loginType)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function socialLogin(data: any) {
  return new Promise((resolve, reject) => {
    apiGet(urls.SOCIAL_USER_CHECK)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
