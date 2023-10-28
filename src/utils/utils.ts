import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {store} from '../redux/store';
const {dispatch} = store;
export async function getHeaders() {
  let userData = await AsyncStorage.getItem('userData');
  if (userData) {
    userData = JSON.parse(userData);
    return {
      authorization: `${userData?.accessToken}`,
    };
  }
  return {};
}

export async function getChooseLanguage() {
  let language = await AsyncStorage.getItem('chooseLanguage');
  if (language) {
    return JSON.parse(language);
  }
  return {};
}

export const showError = (message: string) => {
  showMessage({type: 'danger', message});
};

export const showSuccess = (message: string) => {
  showMessage({type: 'success', message});
};

export async function apiReq(endPoint: string, data: any = {}, method: any, headers: any, requestOptions = {}) {
  return new Promise(async (res, rej) => {
    const getTokenHeader = await getHeaders();

    headers = {
      ...getTokenHeader,
      ...headers,
    };

    if (method === 'get') {
      data = {
        ...requestOptions,
        ...data,
        headers,
      };
    }

    if (method === 'delete') {
      axios
        .delete(endPoint, {
          data: data,
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          //  {headers: any}
        })
        .then((result: any) => {
          const {data: resultData} = result;
          if (data.status === false) {
            return rej(data);
          }
          return res(resultData?.data);
        })
        .catch((error: any) => {
          console.log(error);
          console.log(error && error.response, 'the error respne');
          if (error && error.response && error.response.status === 401) {
            // clearUserData();
            // dispatch(updateClearReduxData())
            // NavigationService.resetNavigation();
            // notAuth();
            // dispat(updateClearReduxData({}));
            // dispatch({
            //   type: types.NO_INTERNET,
            //   payload: {internetConnection: true},
            // });
          }
          if (error && error.response && error.response.data) {
            if (!error.response.data.message) {
              return rej({
                ...error.response.data,
                msg: error.response.data.message || 'Network Error',
              });
            }
            return rej(error.response.data);
          } else {
            return rej({message: 'Network Error', msg: 'Network Error'});
          }
          // return rej(error);
        });

      return;
    }

    axios[method](endPoint, data, {headers})
      .then((result: any) => {
        const {data: resultData} = result;
        if (data.status === false) {
          return rej(data);
        }
        return res(resultData?.data);
      })
      .catch((error: any) => {
        console.log(error);
        console.log(error && error.response, 'the error respne');
        if (error && error.response && error.response.status === 401) {
          // clearUserData();
          // NavigationServices.resetNavigation();
          // NavigationServices.navigate('loginUsingEmailScreen');
          // dispat(updateClearReduxData({}));
          // dispatch({
          //   type: types.NO_INTERNET,
          //   payload: {internetConnection: true},
          // });
        }
        if (error && error.response && error.response.data) {
          if (!error.response.data.message) {
            return rej({
              ...error.response.data,
              msg: error.response.data.message || 'Network Error',
            });
          }
          return rej(error.response.data);
        } else {
          return rej({message: 'Network Error', msg: 'Network Error'});
        }
        // return rej(error);
      });
  });
}

//LANGUAGE SET IN AUTH SCREEN FUNCTION CHOOSELANGUAGE
export function setLanguage(data: any) {
  return AsyncStorage.setItem('chooseLanguage', JSON.stringify(data));
}
export function getLanguage() {
  return new Promise(resolve => {
    AsyncStorage.getItem('chooseLanguage').then((data: any) => {
      resolve(JSON.parse(data));
    });
  });
}
//GOT A MATCH
export function setMatch(data: any) {
  return AsyncStorage.setItem('isMatched', JSON.stringify(data));
}

export function getMatch() {
  return new Promise(resolve => {
    AsyncStorage.getItem('isMatched').then((data: any) => {
      resolve(JSON.parse(data));
      console.log(JSON.parse(data), 'newMatchAsyncValue');
    });
  });
}

export function setItem(key: string, data: any) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem(key, data);
}
export function getItem(key: string) {
  return new Promise(resolve => {
    AsyncStorage.getItem(key).then((data: any) => {
      resolve(JSON.parse(data));
    });
  });
}
export function apiPost(endPoint: string, data: any, headers = {}) {
  return apiReq(endPoint, data, 'post', headers);
}
export function apiDelete(endPoint: string, data: any, headers = {}) {
  return apiReq(endPoint, data, 'delete', headers);
}
export function apiGet(endPoint: string, data?: any, headers = {}, requestOptions?: any) {
  return apiReq(endPoint, data, 'get', headers, requestOptions);
}
export function apiPut(endPoint: string, data: any, headers = {}) {
  return apiReq(endPoint, data, 'put', headers);
}
export function removeItem(key: string) {
  return AsyncStorage.removeItem(key);
}
export function clearAsyncStorage() {
  return AsyncStorage.clear();
}
export function setUserData(data: any) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem('userData', data);
}

export async function getUserData() {
  return new Promise(resolve => {
    AsyncStorage.getItem('userData').then((data: any) => {
      resolve(JSON.parse(data));
    });
  });
}

export function setFirstTime(data: any) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem('isFirstTime', data);
}

export async function getFirstTime() {
  return new Promise(resolve => {
    AsyncStorage.getItem('isFirstTime').then((data: any) => {
      resolve(JSON.parse(data));
    });
  });
}

export async function clearUserData() {
  console.log('ASYNC_storage_empty');
  return AsyncStorage.removeItem('userData');
}

// console.log('====================================');
// console.log('userDatauserDatauserData', userData);
// console.log('====================================');

// const DEFAULT_COORDINATE: LatLng = {
//   lat: 30.746483691534372,
//   lng: 76.76580246936282,
// };

// const DEFAULT_COORDINATE_1: LatLng = {
//   lat: 30.746483691534372,
//   lng: 79.76580246936282,
// };

//

// const get = <Tobj, TFirstKey extends keyof Tobj, TSoundKey extends keyof Tobj[TFirstKey]>(obj: Tobj, firstValue: TFirstKey, s: TSoundKey) => {
//   return obj[firstValue][s];
// };

// function sum<T, U>(first: T, _s: U): T {
//   return first;
// }

// const value = sum<number, number>(11, 1);

// const foo = {
//   one: {
//     a: 1,
//     b: 'c',
//   },
//   two: {
//     c: 1,
//     d: 'c',
//   },
// };

// const value = get(foo, 'one', 'a');

// type User = {
//   name: string;
// };

// type Require<User> = {
//   readonly [P in keyof User]-?: User[P];
// };

// type RequiredUser = Require<User>;

// type Colors = 'red' | 'green' | 'blue';
// type RGB = [red: number, green: number, blue: number];

// const palette: Record<Colors, string | RGB> = satif {
//   red: [255, 0, 0],
//   green: '#00ff00',
//   blue: [0, 0, 255],
//   //  ~~~~ The typo is now correctly detected
// };

// const redComponent = palette.red.find();
