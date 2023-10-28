import {} from 'react';
import {useEffect} from 'react';
import {getCurrentLocation, locationPermission} from '../utils/helper';
import {updateProfile} from '../redux/actions/auth';
import {setItem} from '../utils/utils';
import {updateLocation} from '../redux/reducer/LocationSlice/locationUpdateSlice';
import {useAppDispatch} from '../redux/store';

export const useUpdateLocation = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    locationPermission()
      .then(async status => {
        if (status === 'granted') {
          const getLocation = await getCurrentLocation();
          updateProfile({
            latitude: getLocation?.coords.latitude,
            longitude: getLocation?.coords.longitude,
          });
          await setItem('LocationUpdated', true);
          dispatch(updateLocation(true));
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  }, [dispatch]);
};
