import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  refresh: false,
};

export const homeRefreshSlice = createSlice({
  name: 'homeRefresh',
  initialState,
  reducers: {
    updateAuthUserData: (state, action) => {
      state.refresh = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {updateAuthUserData} = homeRefreshSlice.actions;
export default homeRefreshSlice.reducer;
