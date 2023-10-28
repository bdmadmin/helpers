import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

import {PermissionsAndroid, Platform} from 'react-native';

export const getCloser = (value: number, checkOne: number, checkTwo: number) => (Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo);

const compareArrays = (a: Array<unknown>, b: Array<unknown>) => a.length === b.length && a.every((element: unknown, index: number) => element === b[index]);

export const log = (message: unknown) => console.log('data----> %Message', 'color: red;', JSON.stringify(message));

export const inBetween = /[a-e]at/;
const ageDays = (old: number, recent: number) => Math.ceil(Math.abs(old - recent) / (1000 * 60 * 60 * 24)) + ' Day(s)';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function isNullOrWhitespace(input: any) {
  if (typeof input === 'undefined' || input == null) {
    return true;
  }

  return input.toString().replace(/\s/g, '').length < 1;
}

export const locationPermission = () =>
  new Promise<Geolocation.AuthorizationResult>(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
        if (permissionStatus === 'granted') {
          return resolve('granted');
        }
        reject('Permission not granted');
      } catch (error) {
        return reject(error);
      }
      return;
    }
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //console.log('You can use the location');

          return resolve('granted');
        }
        //console.log('Location permission denied');
        return reject('Location Permission denied');
      })
      .catch(error => {
        console.log('Ask Location permission error: ', error);
        return reject(error);
      });
  });

export const getCurrentLocation = () =>
  new Promise<GeoPosition>(async (resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        console.log(position);
        resolve(position);
      },
      (error: any) => {
        reject(error.message);
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });

export const getAudioPermission = new Promise(async (resolve, reject) => {
  try {
    const grants = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]);
    if (
      grants['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
      grants['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
      grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      resolve(true);
    } else {
      reject(false);
      // console.log('All required permissions not granted');
      // return;
    }
  } catch (err) {
    reject(false);
    console.warn(err);
    // return;
  }
});

// function pipe(...funcs) {
//   return (...args: Array<any>) => {
//     return funcs.reduce((result, func) => [func.call(this, ...result)], args)[0];
//   };
// }

// function partial(func : , ...args) {
//   return function partiallyApplied(...moreArgs) {
//     return func(...args, ...moreArgs);
//   };
// }
