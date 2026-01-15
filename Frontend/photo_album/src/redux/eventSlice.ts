import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface eventData{
  eventType: string;
  description: string;
  date: string;
}


// Fetch all events
export const fetchEvents = createAsyncThunk(
  "events/fetch",
  async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }

    const data = await res.json();
    return data;
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchById",
  async (eventId, { rejectWithValue }) => {
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}`, {
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

// Create a new event
export const createEvent = createAsyncThunk(
  "events/create",
  async (data:eventData , {rejectWithValue}) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/create-event`, {
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
    console.log("Create Event Result:", result);
    return result;
  }
);


export const updateEvent = createAsyncThunk(
  "events/update",
  async ({ eventId, payload }, { rejectWithValue }) => {
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}`, {
        method: "PUT",
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


export const deleteEvent = createAsyncThunk(
  "events/delete",
  async (eventId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      return eventId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    currentEvent: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCurrentEvent(state) {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.events.unshift(action.payload.event);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // FETCH ALL
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ONE
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })

      // UPDATE
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        state.currentEvent = action.payload;
      })

      // DELETE
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(
          (e) => e.id !== action.payload
        );
      });
  },
});

export default eventSlice.reducer;
