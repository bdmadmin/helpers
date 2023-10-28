import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import AuthScreen from './AuthScreen';
import {getItem, getUserData} from '../utils/utils';
import {authSliceSelector, updateAuthUserData} from '../redux/reducer/AuthSlice/authSlice';
import MainScreen from './MainScreen';
import {MenuProvider} from 'react-native-popup-menu';
import GuestScreen from './GuestScreen';
import {isReadyRef, _navigator} from '../service/NavigationService';
import {updateLocation} from '../redux/reducer/LocationSlice/locationUpdateSlice';
import SplashScreen from 'react-native-splash-screen';
import {messageTabCount} from '../redux/reducer/DotSlice/dotSlice';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {logoutSliceSelector} from '../redux/reducer/Logout/logoutSlice';
import { setchangeWidth } from '../redux/reducer/AudioVideoList/audioVideoList';
import { Dimensions } from 'react-native';

const Stack = createStackNavigator();

export default function Routes() {
  const userData = useAppSelector(authSliceSelector);
  const splashAndBoarding = useAppSelector(logoutSliceSelector);

  console.log('userData', userData);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const width = Dimensions.addEventListener("change", (status) => {
      const newWidth = status.window.width;
      dispatch(setchangeWidth(newWidth));
    });
    return () => {
      width.remove();
    };
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const user = await getUserData();
        const locationUpdated = await getItem('LocationUpdated');
        const messageCount = await getItem('messageCount');
        if (user) {
          dispatch(updateAuthUserData(user));
          dispatch(updateLocation(!!locationUpdated));
        }
        if (messageCount) {
          dispatch(messageTabCount({messageTabCount: true}));
        }
        SplashScreen.hide();
      } catch (error) {}
    })();
  }, [dispatch]);

  return (
    <NavigationContainer
      onReady={() => {
        isReadyRef.current = true;
      }}
      ref={_navigator}>
      <MenuProvider>
        <Stack.Navigator
          screenOptions={{
            animationEnabled: true,
            ...TransitionPresets.SlideFromRightIOS,
            cardOverlayEnabled: true,
            presentation: 'modal',
          }}>
          {userData?.firstName && userData?.accessToken ? <>{MainScreen(Stack)}</> : userData?.guest ? <>{GuestScreen(Stack)}</> : <>{AuthScreen(Stack, splashAndBoarding)}</>}
        </Stack.Navigator>
      </MenuProvider>
    </NavigationContainer>
  );
}
