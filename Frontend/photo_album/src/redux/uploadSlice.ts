import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
  name: "uploads",
  initialState: {
    // progress: 0,
    uploading: false,
    error: null,
  },
  reducers: {
    startUpload(state) {
      state.uploading = true;
      // state.progress = 0;
    },
    // setProgress(state, action) {
    //   state.progress = action.payload;
    // },
    uploadSuccess(state) {
      state.uploading = false;
      // state.progress = 100;
    },
    uploadFail(state, action) {
      state.uploading = false;
      state.error = action.payload;
    },
  },
});

export const {
  startUpload,
  setProgress,
  uploadSuccess,
  uploadFail,
} = uploadSlice.actions;

export default uploadSlice.reducer;
