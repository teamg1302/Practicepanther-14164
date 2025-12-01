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
 * @property {Object} masters - Masters data state object
 * @property {Array} masters.timezones - Array of timezone options
 * @property {boolean} masters.timezonesLoading - Loading state for timezones
 * @property {string|null} masters.timezonesError - Error message for timezones fetch
 * @property {Array} masters.jobTitles - Array of job title options
 * @property {boolean} masters.jobTitlesLoading - Loading state for job titles
 * @property {string|null} masters.jobTitlesError - Error message for job titles fetch
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
  masters: {
    timezones: [],
    timezonesLoading: false,
    timezonesError: null,
    jobTitles: [],
    jobTitlesLoading: false,
    jobTitlesError: null,
  },
};

export default initialState;
