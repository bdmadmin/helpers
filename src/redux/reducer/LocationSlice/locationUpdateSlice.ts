import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../store';

const initialState = {
  locationUpdate: false,
};

export const locationUpdateSlice = createSlice({
  name: 'homeRefresh',
  initialState,
  reducers: {
    updateLocation: (state, action) => {
      state.locationUpdate = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {updateLocation} = locationUpdateSlice.actions;
export default locationUpdateSlice.reducer;

export const locationUpdateSliceSelector = (state: RootState) => state.locationUpdate.locationUpdate;
