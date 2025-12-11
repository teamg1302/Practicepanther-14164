/**
 * Root Redux reducer for the application.
 * @module core/redux/reducer
 * @param {Object} state - Current state object
 * @param {Object} action - Redux action object
 * @param {string} action.type - Action type identifier
 * @param {*} action.payload - Action payload data
 * @returns {Object} New state object
 */

import initialState from "./initial.value";
import mastersReducer from "./mastersReducer";
import countriesReducer from "./countries";

/**
 * Root reducer function that handles all Redux actions.
 * @param {Object} state - Current application state, defaults to initialState
 * @param {Object} action - Redux action object containing type and payload
 * @returns {Object} New state object after applying the action
 * @example
 * const newState = rootReducer(currentState, { type: 'SET_AUTH_USER', payload: user });
 */
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "toggle_header":
      return { ...state, toggle_header: action.payload };
    case "Layoutstyle_data":
      return { ...state, layoutstyledata: action.payload };
    case "SET_AUTH_USER":
      return {
        ...state,
        auth: {
          ...state.auth,
          user: action.payload,
        },
      };
    case "SET_AUTH_TOKEN":
      // Sync token to localStorage for API interceptor
      if (action.payload) {
        localStorage.setItem("authToken", action.payload);
      } else {
        localStorage.removeItem("authToken");
      }
      return {
        ...state,
        auth: {
          ...state.auth,
          token: action.payload,
        },
      };
    case "SET_AUTH_ROLE":
      return {
        ...state,
        auth: {
          ...state.auth,
          role: action.payload,
        },
      };
    case "SET_AUTH_PERMISSIONS":
      return {
        ...state,
        auth: {
          ...state.auth,
          permissions: action.payload,
        },
      };
    case "SET_AUTH_DATA":
      // Sync token to localStorage for API interceptor
      if (action.payload?.token) {
        localStorage.setItem("authToken", action.payload.token);
      }
      return {
        ...state,
        auth: {
          ...state.auth,
          ...action.payload,
        },
      };
    case "SET_LOGIN_EMAIL":
      return {
        ...state,
        auth: {
          ...state.auth,
          loginEmail: action.payload,
        },
      };
    case "CLEAR_AUTH":
      // Clear token from localStorage
      localStorage.removeItem("authToken");
      return {
        ...state,
        auth: {
          user: null,
          token: null,
          role: null,
          permissions: [],
          loginEmail: null,
        },
      };
    case "SET_PAGE_LOADER":
      return { ...state, pageLoader: action.payload };
    default: {
      // Delegate all actions to mastersReducer (handles its own actions via slice)
      // This allows the slice to handle both sync and async actions
      const newMastersState = mastersReducer(state.masters, action);

      // Check countriesReducer for country-specific actions
      const newCountriesState = countriesReducer(
        state.masters?.country || { data: null, loading: false, error: null },
        action
      );

      // Check if either reducer handled the action
      const mastersChanged = newMastersState !== state.masters;
      const countriesChanged = newCountriesState !== state.masters?.country;

      if (mastersChanged || countriesChanged) {
        return {
          ...state,
          masters: {
            ...newMastersState,
            country: newCountriesState,
          },
        };
      }
      return state;
    }
  }
};

export default rootReducer;
