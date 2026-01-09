import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all events
export const fetchEvents = createAsyncThunk(
  "events/fetch",
  async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }

    const data = await res.json();
    return data;
  }
);

// Create a new event
export const createEvent = createAsyncThunk(
  "events/create",
  async (data: { name: string }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create event");
    }

    const result = await res.json();
    return result;
  }
);

interface EventState {
  list: any[];
  loading: boolean;
}

const initialState: EventState = {
  list: [],
  loading: false,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state) => {
        // Optionally handle create failure
      });
  },
});

export default eventSlice.reducer;
