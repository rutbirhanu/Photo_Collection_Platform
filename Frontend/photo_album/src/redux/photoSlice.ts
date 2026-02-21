import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/* ========================
   TYPES
======================== */

interface Photo {
  id: string;
  secureUrl: string;
  albumId: string;
}

interface PhotoState {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  deletingPhotoId: string | null;
}

/* ========================
   THUNKS
======================== */

export const uploadPhoto = createAsyncThunk<
  Photo,
  { files: File[]; albumId: string },
  { rejectValue: string }
>("photo/upload", async ({ files, albumId }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));

    const res = await fetch(`${API_URL}/photo/${albumId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchAlbumPhotos = createAsyncThunk<
  Photo[],
  string,
  { rejectValue: string }
>("photo/fetchAlbum", async (albumId, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/photo/${albumId}`, {
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deletePhoto = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("photo/delete", async (photoId, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/photo/${photoId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    return photoId;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

/* ========================
   SLICE
======================== */

const initialState: PhotoState = {
  photos: [],
  loading: false,
  error: null,
  deletingPhotoId: null,
};

const photoSlice = createSlice({
  name: "photo",
  initialState,
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

      /* ========= UPLOAD ========= */
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photos.unshift(action.payload);
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Upload failed";
      })

      /* ========= FETCH ========= */
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
        state.error = action.payload || "Failed to fetch photos";
      })

      /* ========= DELETE ========= */
      .addCase(deletePhoto.pending, (state, action) => {
        state.deletingPhotoId = action.meta.arg;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.photos = state.photos.filter(
          (photo) => photo.id !== action.payload
        );
        state.deletingPhotoId = null;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.error = action.payload || "Delete failed";
        state.deletingPhotoId = null;
      });
  },
});

export const { clearPhotoError, clearPhotos } = photoSlice.actions;
export default photoSlice.reducer;