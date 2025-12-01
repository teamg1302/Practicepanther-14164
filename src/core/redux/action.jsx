/**
 * Redux action creators for the application state management.
 * @module core/redux/action
 */

/**
 * Action creator to set layout style change.
 * @param {string} payload - The layout style data to set
 * @returns {Object} Redux action object with type "Layoutstyle_data" and payload
 * @example
 * dispatch(setLayoutChange('dark'));
 */
export const setLayoutChange = (payload) => ({
  type: "Layoutstyle_data",
  payload,
});

/**
 * Action creator to toggle header visibility.
 * @param {boolean} payload - The toggle state for the header
 * @returns {Object} Redux action object with type "toggle_header" and payload
 * @example
 * dispatch(setToogleHeader(true));
 */
export const setToogleHeader = (payload) => ({
  type: "toggle_header",
  payload,
});

/**
 * Action creator to set authenticated user data.
 * @param {Object|null} payload - The user object containing user information
 * @returns {Object} Redux action object with type "SET_AUTH_USER" and payload
 * @example
 * dispatch(setAuthUser({ id: 1, name: 'John Doe', email: 'john@example.com' }));
 */
export const setAuthUser = (payload) => ({
  type: "SET_AUTH_USER",
  payload,
});

/**
 * Action creator to set authentication token.
 * @param {string|null} payload - The authentication token string
 * @returns {Object} Redux action object with type "SET_AUTH_TOKEN" and payload
 * @example
 * dispatch(setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'));
 */
export const setAuthToken = (payload) => ({
  type: "SET_AUTH_TOKEN",
  payload,
});

/**
 * Action creator to set user role.
 * @param {string|null} payload - The user role (e.g., 'admin', 'user', 'super_admin')
 * @returns {Object} Redux action object with type "SET_AUTH_ROLE" and payload
 * @example
 * dispatch(setAuthRole('admin'));
 */
export const setAuthRole = (payload) => ({
  type: "SET_AUTH_ROLE",
  payload,
});

/**
 * Action creator to set user permissions.
 * @param {Array<string>} payload - Array of permission strings
 * @returns {Object} Redux action object with type "SET_AUTH_PERMISSIONS" and payload
 * @example
 * dispatch(setAuthPermissions(['read:users', 'write:users', 'delete:users']));
 */
export const setAuthPermissions = (payload) => ({
  type: "SET_AUTH_PERMISSIONS",
  payload,
});

/**
 * Action creator to set complete authentication data.
 * This is a convenience action that can set multiple auth properties at once.
 * @param {Object} payload - Object containing auth data (user, token, role, permissions, etc.)
 * @param {Object} [payload.user] - User object
 * @param {string} [payload.token] - Authentication token
 * @param {string} [payload.role] - User role
 * @param {Array<string>} [payload.permissions] - User permissions
 * @returns {Object} Redux action object with type "SET_AUTH_DATA" and payload
 * @example
 * dispatch(setAuthData({
 *   user: { id: 1, name: 'John' },
 *   token: 'token123',
 *   role: 'admin',
 *   permissions: ['read', 'write']
 * }));
 */
export const setAuthData = (payload) => ({
  type: "SET_AUTH_DATA",
  payload,
});

/**
 * Action creator to set login email.
 * Used to store the email used during login for pre-filling forms.
 * @param {string|null} payload - The email address used for login
 * @returns {Object} Redux action object with type "SET_LOGIN_EMAIL" and payload
 * @example
 * dispatch(setLoginEmail('user@example.com'));
 */
export const setLoginEmail = (payload) => ({
  type: "SET_LOGIN_EMAIL",
  payload,
});

/**
 * Action creator to clear all authentication data.
 * This action removes user, token, role, permissions, and login email from the store.
 * Also removes the token from localStorage.
 * @returns {Object} Redux action object with type "CLEAR_AUTH"
 * @example
 * dispatch(clearAuth());
 */
export const clearAuth = () => ({
  type: "CLEAR_AUTH",
});

/**
 * Action creator to set timezones list.
 * @param {Array} payload - Array of timezone objects with label and value
 * @returns {Object} Redux action object with type "SET_TIMEZONES" and payload
 * @example
 * dispatch(setTimezones([{ label: "UTC+00:00", value: "UTC+00:00" }]));
 */
export const setTimezones = (payload) => ({
  type: "SET_TIMEZONES",
  payload,
});

/**
 * Action creator to set timezones loading state.
 * @param {boolean} payload - Loading state (true/false)
 * @returns {Object} Redux action object with type "SET_TIMEZONES_LOADING" and payload
 * @example
 * dispatch(setTimezonesLoading(true));
 */
export const setTimezonesLoading = (payload) => ({
  type: "SET_TIMEZONES_LOADING",
  payload,
});