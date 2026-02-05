import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const createAlbum = createAsyncThunk(
  "album/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/album`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchMyAlbums = createAsyncThunk(
  "album/fetchMyAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/album`, {
        credentials: "include",
      });

      const data = await res.json();
      console.log("hi", data)
      if (!res.ok) throw new Error(data.message);

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchAlbumById = createAsyncThunk(
  "album/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/album/${id}`, {
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchAlbumByToken = createAsyncThunk(
  "album/fetchByToken",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/album/public/${token}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const updateAlbum = createAsyncThunk(
  "album/update",
  async({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/album/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



export const deleteAlbum = createAsyncThunk(
  "album/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/album/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



const albumSlice = createSlice({
  name: "album",
  initialState: {
    albums: [],
    currentAlbum: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAlbumError(state) {
      state.error = null;
    },
    clearCurrentAlbum(state) {
      state.currentAlbum = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albums.unshift(action.payload);
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ALL
      .addCase(fetchMyAlbums.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload;
      })
      .addCase(fetchMyAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ONE (AUTH)
      .addCase(fetchAlbumById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlbumById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAlbum = action.payload;
      })
      .addCase(fetchAlbumById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BY TOKEN (PUBLIC)
      .addCase(fetchAlbumByToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlbumByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAlbum = action.payload;
      })
      .addCase(fetchAlbumByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAlbum.fulfilled, (state, action) => {
        state.currentAlbum = action.payload;
        state.albums = state.albums.map((a) =>
          a.id === action.payload.id ? action.payload : a
        );
      })

      // DELETE
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.albums = state.albums.filter(
          (a) => a.id !== action.payload
        );
      });
  },
});

export const { clearAlbumError, clearCurrentAlbum } = albumSlice.actions;
export default albumSlice.reducer;
