import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  notificationTabCount: 0,
  messageTabCount: 0,
};

export const dotSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    notificationTabCount: (state, action) => {
      state.notificationTabCount = action.payload.notificationTabCount;
    },
    messageTabCount: (state, action) => {
      console.log('messageTabCount');
      state.messageTabCount = action.payload.messageTabCount;
    },
  },
});

// Action creators are generated for each case reducer function
export const {notificationTabCount, messageTabCount} = dotSlice.actions;
export default dotSlice.reducer;
