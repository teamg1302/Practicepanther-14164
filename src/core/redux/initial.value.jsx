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
 * @property {Array} masters.countries - Array of country options
 * @property {boolean} masters.countriesLoading - Loading state for countries
 * @property {string|null} masters.countriesError - Error message for countries fetch
 * @property {Array} masters.currencies - Array of currency options
 * @property {boolean} masters.currenciesLoading - Loading state for currencies
 * @property {string|null} masters.currenciesError - Error message for currencies fetch
 * @property {Array} masters.states - Array of state options
 * @property {boolean} masters.statesLoading - Loading state for states
 * @property {string|null} masters.statesError - Error message for states fetch
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
    countries: [],
    countriesLoading: false,
    countriesError: null,
    currencies: [],
    currenciesLoading: false,
    currenciesError: null,
    states: [],
    statesLoading: false,
    statesError: null,
  },
};

export default initialState;
