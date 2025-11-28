import api from "./api";

/**
 * Get user details by user ID
 * @param {string|number} userId - User ID to fetch details for
 * @returns {Promise} API response with user details
 */
export const getUserDetails = async (userId) => {
  try {
    const response = await api.get(`/masters/user/${userId}`);
    return response.data.data.user;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update user details by user ID
 * Supports both JSON and FormData for file uploads
 * Automatically handles multipart/form-data when FormData is passed
 *
 * @param {string|number} userId - User ID to update
 * @param {FormData|Object} userData - User data to update
 *   - FormData: For file uploads (multipart/form-data)
 *   - Object: For JSON requests
 *
 * @param {string} [userData.firstName] - First name
 * @param {string} [userData.middleName] - Middle name
 * @param {string} [userData.lastName] - Last name
 * @param {string} [userData.jobTitle] - Job title
 * @param {string} [userData.mobile] - Mobile number
 * @param {string} [userData.email] - Email address
 * @param {string} [userData.timezone] - Timezone
 * @param {string} [userData.home] - Home address
 * @param {string} [userData.office] - Office address
 * @param {number} [userData.hourlyRate] - Hourly rate
 * @param {boolean} [userData.roundTimeEntries] - Round time entries flag
 * @param {string} [userData.roundTimeEntryType] - Round time entry type
 * @param {boolean} [userData.dailyAgendaEmail] - Daily agenda email flag
 * @param {File} [userData.profilePhoto] - Profile photo file (when using FormData)
 *
 * @returns {Promise} API response with updated user details
 *
 * @example
 * // JSON request (no files)
 * await updateUserDetails(userId, { firstName: "John", email: "john@example.com" });
 *
 * @example
 * // Multipart request (with files)
 * const formData = new FormData();
 * formData.append("firstName", "John");
 * formData.append("profilePhoto", file);
 * await updateUserDetails(userId, formData);
 */
export const updateUserDetails = async (userId, userData) => {
  try {
    // Handles both FormData (multipart/form-data) and regular objects (JSON):
    //
    // For FormData (file uploads):
    // - The API interceptor automatically detects FormData
    // - Removes the default Content-Type header
    // - Browser sets Content-Type with boundary automatically
    // - Enables proper multipart/form-data handling for file uploads
    //
    // For regular objects (JSON):
    // - Uses default application/json Content-Type
    // - Standard JSON request

    const response = await api.patch(`/masters/user/${userId}`, userData);

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
