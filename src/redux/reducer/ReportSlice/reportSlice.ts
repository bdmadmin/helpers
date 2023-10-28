import {createSlice} from '@reduxjs/toolkit';
import { RootState } from '../../store';

const initialState = {
  openReportSheet: {
    isOpen: false,
    postId: '',
  },
};

export const reportSlice = createSlice({
  name: 'homeRefresh',
  initialState,
  reducers: {
    openReportSheet: (state, action) => {
      state.openReportSheet = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function

export const {openReportSheet} = reportSlice.actions;

export default reportSlice.reducer;
export const reportSliceSelector = (state: RootState) => state.reportSheet.openReportSheet;
