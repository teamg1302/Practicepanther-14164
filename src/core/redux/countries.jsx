/**
 * Masters slice for managing masters data (timezones, etc.)
 * @module core/redux/mastersReducer
 * Uses Redux Toolkit's createSlice and createAsyncThunk for modern Redux patterns
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCountries } from "@/core/services/mastersService";

/**
 * Initial state for masters slice.
 * @type {Object}
 */
const initialState = {
  data: null,
  loading: false,
  error: null,
};

/**
 * Async thunk for fetching countries from API
 * @type {Function}
 * @returns {Promise} Promise that resolves with countries data
 * @example
 * dispatch(fetchCountries());
 */
export const fetchCountries = createAsyncThunk(
  "country/fetchCountries",
  async (params = {}, { rejectWithValue }) => {
    try {
      const countriesData = await getCountries(params);

      // Transform API response to match Select component format
      const formattedCountries = Array.isArray(countriesData?.list)
        ? countriesData.list.map((country) => ({
            label: country.name,
            value: country._id,
          }))
        : Array.isArray(countriesData?.data)
        ? countriesData.data.map((country) => ({
            label: country.name || country.label,
            value: country._id || country.value,
          }))
        : Array.isArray(countriesData)
        ? countriesData.map((country) => ({
            label: country.name || country.label,
            value: country._id || country.value,
          }))
        : [];
      console.log("formattedCountries", formattedCountries);
      return formattedCountries;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch countries"
      );
    }
  }
);

/**
 * Masters slice using Redux Toolkit's createSlice
 * @type {Object}
 */
const countriesSlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    clearCountriesError: (state) => {
      state.countriesError = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch countries - pending
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch countries - fulfilled (success)
      .addCase(fetchCountries.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      // Fetch countries - rejected (error)
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.payload || action.error.message;
      });
  },
});

// Export actions
export const { clearCountriesError } = countriesSlice.actions;

// Export reducer
export default countriesSlice.reducer;
