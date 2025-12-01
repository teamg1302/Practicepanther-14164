/**
 * Masters slice for managing masters data (timezones, etc.)
 * @module core/redux/mastersReducer
 * Uses Redux Toolkit's createSlice and createAsyncThunk for modern Redux patterns
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTimezone, getTitles } from "@/core/services/mastersService";

/**
 * Initial state for masters slice.
 * @type {Object}
 */
const initialState = {
  timezones: [],
  timezonesLoading: false,
  timezonesError: null,
  jobTitles: [],
  jobTitlesLoading: false,
  jobTitlesError: null,
};

/**
 * Async thunk for fetching timezones from API
 * @type {Function}
 * @returns {Promise} Promise that resolves with timezones data
 * @example
 * dispatch(fetchTimezones());
 */
export const fetchTimezones = createAsyncThunk(
  "masters/fetchTimezones",
  async (params = {}, { rejectWithValue }) => {
    try {
      const timezoneData = await getTimezone(params);
      //onsole.log("timezoneData", timezoneData);
      // Transform API response to match Select component format
      // Adjust transformation based on actual API response structure
      const formattedTimezones = Array.isArray(timezoneData.data)
        ? timezoneData.data.map((tz) => ({
            label: tz.label,
            value: tz.value,
          }))
        : [];

      return formattedTimezones;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch timezones"
      );
    }
  }
);

/**
 * Async thunk for fetching job titles from API
 * @type {Function}
 * @returns {Promise} Promise that resolves with job titles data
 * @example
 * dispatch(fetchJobTitles());
 */
export const fetchJobTitles = createAsyncThunk(
  "masters/fetchJobTitles",
  async (params = {}, { rejectWithValue }) => {
    try {
      const titlesData = await getTitles(params);

      // Transform API response to match Select component format
      // Adjust transformation based on actual API response structure

      const formattedTitles = Array.isArray(titlesData?.list)
        ? titlesData.list.map((title) => ({
            label: title.name,
            value: title._id,
          }))
        : [];

      return formattedTitles;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch job titles"
      );
    }
  }
);

/**
 * Masters slice using Redux Toolkit's createSlice
 * @type {Object}
 */
const mastersSlice = createSlice({
  name: "masters",
  initialState,
  reducers: {
    /**
     * Clear timezones error
     */
    clearTimezonesError: (state) => {
      state.timezonesError = null;
    },
    /**
     * Clear job titles error
     */
    clearJobTitlesError: (state) => {
      state.jobTitlesError = null;
    },
    /**
     * Reset masters state to initial
     */
    resetMasters: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch timezones - pending
      .addCase(fetchTimezones.pending, (state) => {
        state.timezonesLoading = true;
        state.timezonesError = null;
      })
      // Fetch timezones - fulfilled (success)
      .addCase(fetchTimezones.fulfilled, (state, action) => {
        state.timezonesLoading = false;
        state.timezones = action.payload;
        state.timezonesError = null;
      })
      // Fetch timezones - rejected (error)
      .addCase(fetchTimezones.rejected, (state, action) => {
        state.timezonesLoading = false;
        state.timezonesError = action.payload || action.error.message;
      })
      // Fetch job titles - pending
      .addCase(fetchJobTitles.pending, (state) => {
        state.jobTitlesLoading = true;
        state.jobTitlesError = null;
      })
      // Fetch job titles - fulfilled (success)
      .addCase(fetchJobTitles.fulfilled, (state, action) => {
        state.jobTitlesLoading = false;
        state.jobTitles = action.payload;
        state.jobTitlesError = null;
      })
      // Fetch job titles - rejected (error)
      .addCase(fetchJobTitles.rejected, (state, action) => {
        state.jobTitlesLoading = false;
        state.jobTitlesError = action.payload || action.error.message;
      });
  },
});

// Export actions
export const { clearTimezonesError, clearJobTitlesError, resetMasters } =
  mastersSlice.actions;

// Export reducer
export default mastersSlice.reducer;
