import {ActionCreator, AnyAction, ThunkAction, configureStore} from '@reduxjs/toolkit';
import authSlice from './reducer/AuthSlice/authSlice';
import logoutSlice from './reducer/Logout/logoutSlice';
import audioSlice from './reducer/AudioSlice/audioSlice';
import audioVideoList from './reducer/AudioVideoList/audioVideoList';
import homeRefreshSlice from './reducer/HomeRefresh/homeRefreshSlice';
import locationUpdateSlice from './reducer/LocationSlice/locationUpdateSlice';
import reportSlice from './reducer/ReportSlice/reportSlice';
import markAsSoldSlice from './reducer/MarkAsSold/markAsSoldSlice';
import mobileNumberSlice from './reducer/MobileNumberSlice/mobileNumberSlice';
import dotSlice from './reducer/DotSlice/dotSlice';
import editPostSlice from './reducer/ReportSlice/editPostSlice';

import {useSelector as useReduxSelector, useDispatch as useReduxDispatch, TypedUseSelectorHook} from 'react-redux';
import cahtReducer from './reducer/chatprev/cahtReducer';

export const store = configureStore({
  reducer: {
    authUser: authSlice,
    logout: logoutSlice,
    audio: audioSlice,
    audioVideoList: audioVideoList,
    homeRefresh: homeRefreshSlice,
    locationUpdate: locationUpdateSlice,
    reportSheet: reportSlice,
    markAsSold: markAsSoldSlice,
    mobileNumber: mobileNumberSlice,
    dotSlice: dotSlice,
    editPostSlice: editPostSlice,
    chat:cahtReducer
  },
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useAppDispatch: () => AppDispatch = useReduxDispatch;
export type AppThunk = ActionCreator<ThunkAction<void, RootState, null, AnyAction>>;
