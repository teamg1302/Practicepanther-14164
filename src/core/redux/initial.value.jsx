/**
 * Initial state for the Redux store.
 * @module core/redux/initial.value
 * @typedef {Object} InitialState
 * @property {boolean} toggle_header - Toggle state for header visibility
 * @property {string|null} layoutstyledata - Layout styling preference from localStorage
 * @property {Object} auth - Authentication state object
 * @property {Object|null} auth.user - Authenticated user object
 * @property {string|null} auth.token - Authentication token
 * @property {string|null} auth.role - User role
 * @property {Array<string>} auth.permissions - Array of user permissions
 * @property {string|null} auth.loginEmail - Email used during login
 */

/**
 * Initial Redux store state.
 * @type {InitialState}
 */
const initialState = {
  toggle_header: false,
  layoutstyledata: localStorage.getItem("layoutStyling"),
  auth: {
    user: null,
    token: null,
    role: null,
    permissions: [],
    loginEmail: null,
  },
};

export default initialState;
