import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const uploadPhoto = createAsyncThunk(
  "photo/upload",
  async ({ file, publicToken }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch(`${API_URL}/upload/${publicToken}`, {
        method: "POST",
        body: formData,
    
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchAlbumPhotos = createAsyncThunk(
  "photo/fetchAlbum",
  async (albumId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/albums/${albumId}/photos`, {
        credentials: "include", // auth protected
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data; // array of photos
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (photoId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/photos/${photoId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return photoId; // return deleted id
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const photoSlice = createSlice({
  name: "photo",
  initialState: {
    photos: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPhotoError(state) {
      state.error = null;
    },
    clearPhotos(state) {
      state.photos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // UPLOAD
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photos.unshift(action.payload); // newest on top
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH
      .addCase(fetchAlbumPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbumPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchAlbumPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.photos = state.photos.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearPhotoError, clearPhotos } = photoSlice.actions;
export default photoSlice.reducer;
