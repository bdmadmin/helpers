import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  selectedIndex: -1,
};

export const audioSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    selectedIndexAudio: (state, action) => {
      state.selectedIndex = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {selectedIndexAudio} = audioSlice.actions;
export default audioSlice.reducer;
