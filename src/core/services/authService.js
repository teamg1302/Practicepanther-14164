import api from "./api";

/**
 * Login service
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {boolean} credentials.rememberMe - Remember me option
 * @returns {Promise} API response with user data and token
 */
export const login = async (credentials) => {
  try {
    const response = await api.post("/masters/user/login", credentials);

    // Store token in localStorage if provided
    if (response.data?.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Verify token service
 * @param {Object} tokenData - Token verification data
 * @param {string} tokenData.token - Verification token
 * @returns {Promise} API response with verification result
 */
export const verifyToken = async (tokenData) => {
  try {
    const response = await api.post(
      `/masters/user/${
        tokenData.type === "forgot-password"
          ? "verify-forgot-password-otp"
          : "verify-login-otp"
      }`,
      tokenData
    );

    // Extract data from response structure: { status, data: { token, user }, message }
    const responseData = response.data?.data || response.data;

    // Store token in localStorage if provided after verification
    if (responseData?.token) {
      localStorage.setItem("authToken", responseData.token);
    }

    // Return the data object with token and user
    return responseData;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Logout service
 * Clears the stored token
 */
export const logout = () => {
  localStorage.removeItem("authToken");
};

/**
 * Forgot password service
 * @param {Object} data - Forgot password data
 * @param {string} data.email - User email
 * @returns {Promise} API response
 */
export const forgotPassword = async (data) => {
  try {
    const response = await api.post("/masters/user/forgot-password", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Reset password service
 * @param {Object} data - Reset password data
 * @param {string} data.token - Reset token
 * @param {string} data.newPassword - New password
 * @returns {Promise} API response
 */
export const resetPassword = async (data) => {
  try {
    const response = await api.post("/masters/user/reset-password", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get stored auth token
 * @returns {string|null} Stored authentication token
 */
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};
