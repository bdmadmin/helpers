import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  photos: [],
  video: "",
  mute: true,
  currentIndex: null,
  sugProfile: [],
  pause: false,
  changeWidth: 0,
  seemessage:false
};

export const audioVideoList = createSlice({
  name: "postFeed",
  initialState,
  reducers: {
    capturePhotos: (state, action) => {
      state.photos = [...(action.payload as [])];
    },
    recordedVideo: (state, action) => {
      state.video = action.payload;
    },
    setmute: (state, action) => {
      state.mute = action.payload;
    },
    setcurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    setsugProfile: (state, action) => {
      state.sugProfile = action.payload;
    },
    setpause: (state, action) => {
      state.pause = action.payload;
    },
    setchangeWidth: (state, action) => {
      state.changeWidth = action.payload;
    },
    setseemessage: (state, action) => {
      state.seemessage = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  capturePhotos,
  recordedVideo,
  setmute,
  setcurrentIndex,
  setsugProfile,
  setpause,
  setchangeWidth,
  setseemessage,
} = audioVideoList.actions;
export default audioVideoList.reducer;
