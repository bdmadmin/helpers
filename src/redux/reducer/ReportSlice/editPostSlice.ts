import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../store';

const initialState = {
  isModalOpen: false,
  data: {},
};

export const editPostSlice = createSlice({
  name: 'editPost',
  initialState,
  reducers: {
    openEditPostModal: (state, action) => {
      state.isModalOpen = action.payload.isModalOpen;
      state.data = action.payload.data;
    },
  },
});

// Action creators are generated for each case reducer function
export const {openEditPostModal} = editPostSlice.actions;
export default editPostSlice.reducer;
export const editPostState = (state: RootState) => state.editPostSlice;
