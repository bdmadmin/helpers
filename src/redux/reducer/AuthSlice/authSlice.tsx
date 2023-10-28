import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../store';

interface AuthState {
  authUser: {
    firstName?: string;
    accessToken?: string;
    guest?: boolean;
    id?:number;
  };
}

const initialState: AuthState = {
  authUser: '',
};

export const authSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    updateAuthUserData: (state, action) => {
      state.authUser = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {updateAuthUserData} = authSlice.actions;
export default authSlice.reducer;
export const authSliceSelector = (state: RootState) => state.authUser.authUser;
