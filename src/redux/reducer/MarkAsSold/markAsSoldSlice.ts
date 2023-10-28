import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  setModalState: {
    postId: '',
    isModalVisible: false,
  },
};

export const markAsSoldSlice = createSlice({
  name: 'homeRefresh',
  initialState,
  reducers: {
    setModalVisibility: (state, action) => {
      state.setModalState = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setModalVisibility} = markAsSoldSlice.actions;
export default markAsSoldSlice.reducer;
