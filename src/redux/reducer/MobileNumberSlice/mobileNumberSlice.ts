import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  openReportSheet: {
    isOpen: false,
  },
};

export const mobileNumberSlice = createSlice({
  name: 'homeRefresh',
  initialState,
  reducers: {
    openMobileAlert: (state, action) => {
      state.openReportSheet = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {openMobileAlert} = mobileNumberSlice.actions;
export default mobileNumberSlice.reducer;
