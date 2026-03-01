import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Album {
  id: string;
  name: string;
  eventId: string;
  shareToken?: string;
  [key: string]: unknown;
}

interface AlbumState {
  albums: Album[];
  currentAlbum: Album | null;
  loading: boolean;
  error: string | null;
}

export const createAlbum = createAsyncThunk<Album, Record<string, unknown>, { rejectValue: string }>(
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
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);


export const fetchMyAlbums = createAsyncThunk<Album[], void, { rejectValue: string }>(
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
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);


export const fetchAlbumById = createAsyncThunk<Album, string, { rejectValue: string }>(
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
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);


export const fetchAlbumByToken = createAsyncThunk<Album, string, { rejectValue: string }>(
  "album/fetchByToken",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/album/public/${token}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);


export const updateAlbum = createAsyncThunk<Album, { id: string; payload: Record<string, unknown> }, { rejectValue: string }>(
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
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);



export const deleteAlbum = createAsyncThunk<string, string, { rejectValue: string }>(
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
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);



const initialState: AlbumState = {
  albums: [],
  currentAlbum: null,
  loading: false,
  error: null,
};

const albumSlice = createSlice({
  name: "album",
  initialState,
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
        state.error = action.payload ?? null;
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
        state.error = action.payload ?? null;
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
        state.error = action.payload ?? null;
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
        state.error = action.payload ?? null;
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
