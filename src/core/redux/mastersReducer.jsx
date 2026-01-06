/**
 * Masters slice for managing masters data (timezones, etc.)
 * @module core/redux/mastersReducer
 * Uses Redux Toolkit's createSlice and createAsyncThunk for modern Redux patterns
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTimezone,
  getTitles,
  getCountries,
  getCurrencies,
  getStatesByCountry,
  getTax,
} from "@/core/services/mastersService";

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
  countries: [],
  countriesLoading: false,
  countriesError: null,
  currencies: [],
  currenciesLoading: false,
  currenciesError: null,
  states: [],
  statesLoading: false,
  statesError: null,
  taxes: [],
  taxesLoading: false,
  taxesError: null,
};

const formatTimezoneLabel = (item) => {
  if (!item?.description) return "";

  // Extract UTC offset
  const utcMatch = item.description.match(/\(UTC[+-]\d{2}:\d{2}\)/);
  const utc = utcMatch ? utcMatch[0] : "";

  // Extract location (before UTC)
  const location = item.description.split("(")[0].trim();

  return `${utc} ${location}`;
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
            label: formatTimezoneLabel(tz),
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

      const formattedTitles = Array.isArray(titlesData?.data)
        ? titlesData.data.map((title) => ({
            label: title.label,
            value: title.value,
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
 * Async thunk for fetching countries from API
 * @type {Function}
 * @returns {Promise} Promise that resolves with countries data
 * @example
 * dispatch(fetchCountries());
 */
export const fetchCountries = createAsyncThunk(
  "masters/fetchCountries",
  async (params = {}, { rejectWithValue }) => {
    try {
      const countriesData = await getCountries(params);

      // Transform API response to match Select component format
      const formattedCountries = Array.isArray(countriesData?.data)
        ? countriesData.data.map((country) => ({
            label: country.label,
            value: country.value,
          }))
        : Array.isArray(countriesData?.data)
        ? countriesData.data.map((country) => ({
            label: country.label,
            value: country.value,
          }))
        : Array.isArray(countriesData)
        ? countriesData.map((country) => ({
            label: country.label,
            value: country.value,
          }))
        : [];

      return formattedCountries;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch countries"
      );
    }
  }
);

/**
 * Async thunk for fetching currencies from API
 * @type {Function}
 * @returns {Promise} Promise that resolves with currencies data
 * @example
 * dispatch(fetchCurrencies());
 */
export const fetchCurrencies = createAsyncThunk(
  "masters/fetchCurrencies",
  async (params = {}, { rejectWithValue }) => {
    try {
      const currenciesData = await getCurrencies(params);

      // Transform API response to match Select component format
      const formattedCurrencies = Array.isArray(currenciesData?.data)
        ? currenciesData.data.map((currency) => ({
            label: currency.label,
            value: currency.value,
          }))
        : Array.isArray(currenciesData?.data)
        ? currenciesData.data.map((currency) => ({
            label: currency.label,
            value: currency.value,
          }))
        : Array.isArray(currenciesData)
        ? currenciesData.map((currency) => ({
            label: currency.label,
            value: currency.value,
          }))
        : [];

      return formattedCurrencies;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch currencies"
      );
    }
  }
);

/**
 * Async thunk for fetching states by country from API
 * @type {Function}
 * @returns {Promise} Promise that resolves with states data
 * @example
 * dispatch(fetchStatesByCountry({ countryId: "123" }));
 */
export const fetchStatesByCountry = createAsyncThunk(
  "masters/fetchStatesByCountry",
  async (params, { rejectWithValue }) => {
    try {
      const statesData = await getStatesByCountry(params);

      // Transform API response to match Select component format
      const formattedStates = Array.isArray(statesData?.data)
        ? statesData.data.map((state) => ({
            label: state.label,
            value: state.value,
          }))
        : [];

      return formattedStates;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch states"
      );
    }
  }
);

/**
 * Async thunk for fetching tax rates from API
 * @type {Function}
 * @returns {Promise} Promise that resolves with tax rates data
 * @example
 * dispatch(fetchTaxes());
 * @example
 * dispatch(fetchTaxes({ search: "VAT", limit: 100 }));
 */
export const fetchTaxes = createAsyncThunk(
  "masters/fetchTaxes",
  async (params = {}, { rejectWithValue }) => {
    try {
      const taxesData = await getTax(params);

      // Transform API response to match AsyncSelectPagination format
      // Return raw data array for AsyncSelectPagination to handle
      // It expects the data in the response.data.data or response.data format
      if (Array.isArray(taxesData?.data)) {
        return taxesData.data;
      } else if (Array.isArray(taxesData?.list)) {
        return taxesData.list;
      } else if (Array.isArray(taxesData)) {
        return taxesData;
      }

      return [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch taxes"
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
     * Clear countries error
     */
    clearCountriesError: (state) => {
      state.countriesError = null;
    },
    /**
     * Clear currencies error
     */
    clearCurrenciesError: (state) => {
      state.currenciesError = null;
    },
    /**
     * Clear states error
     */
    clearStatesError: (state) => {
      state.statesError = null;
    },
    /**
     * Clear states data (when country changes)
     */
    clearStates: (state) => {
      state.states = [];
      state.statesError = null;
    },
    /**
     * Clear taxes error
     */
    clearTaxesError: (state) => {
      state.taxesError = null;
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
      })
      // Fetch countries - pending
      .addCase(fetchCountries.pending, (state) => {
        state.countriesLoading = true;
        state.countriesError = null;
      })
      // Fetch countries - fulfilled (success)
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countriesLoading = false;
        state.countries = action.payload;
        state.countriesError = null;
      })
      // Fetch countries - rejected (error)
      .addCase(fetchCountries.rejected, (state, action) => {
        state.countriesLoading = false;
        state.countriesError = action.payload || action.error.message;
      })
      // Fetch currencies - pending
      .addCase(fetchCurrencies.pending, (state) => {
        state.currenciesLoading = true;
        state.currenciesError = null;
      })
      // Fetch currencies - fulfilled (success)
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.currenciesLoading = false;
        state.currencies = action.payload;
        state.currenciesError = null;
      })
      // Fetch currencies - rejected (error)
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.currenciesLoading = false;
        state.currenciesError = action.payload || action.error.message;
      })
      // Fetch states by country - pending
      .addCase(fetchStatesByCountry.pending, (state) => {
        state.statesLoading = true;
        state.statesError = null;
      })
      // Fetch states by country - fulfilled (success)
      .addCase(fetchStatesByCountry.fulfilled, (state, action) => {
        state.statesLoading = false;
        state.states = action.payload;
        state.statesError = null;
      })
      // Fetch states by country - rejected (error)
      .addCase(fetchStatesByCountry.rejected, (state, action) => {
        state.statesLoading = false;
        state.statesError = action.payload || action.error.message;
      })
      // Fetch taxes - pending
      .addCase(fetchTaxes.pending, (state) => {
        state.taxesLoading = true;
        state.taxesError = null;
      })
      // Fetch taxes - fulfilled (success)
      .addCase(fetchTaxes.fulfilled, (state, action) => {
        state.taxesLoading = false;
        state.taxes = action.payload;
        state.taxesError = null;
      })
      // Fetch taxes - rejected (error)
      .addCase(fetchTaxes.rejected, (state, action) => {
        state.taxesLoading = false;
        state.taxesError = action.payload || action.error.message;
      });
  },
});

// Export actions
export const {
  clearTimezonesError,
  clearJobTitlesError,
  clearCountriesError,
  clearCurrenciesError,
  clearStatesError,
  clearStates,
  clearTaxesError,
  resetMasters,
} = mastersSlice.actions;

// Export reducer
export default mastersSlice.reducer;
