import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch albums
export const fetchAlbums = createAsyncThunk(
  "albums/fetch",
  async (eventId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/albums`, {
      credentials: "include", // equivalent to withCredentials: true
    });

    if (!res.ok) {
      throw new Error("Failed to fetch albums");
    }

    const data = await res.json();
    return data;
  }
);

interface AlbumState {
  list: any[];
  loading: boolean;
}

const initialState: AlbumState = {
  list: [],
  loading: false,
};

const albumSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default albumSlice.reducer;
