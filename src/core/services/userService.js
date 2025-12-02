import api from "./api";

/**
 * Get users list with pagination and filtering
 * @param {Object} params - Query parameters for users list
 * @param {number} [params.limit=50] - Number of items per page
 * @param {number} [params.pageSize=50] - Page size (same as limit)
 * @param {number} [params.page=1] - Page number
 * @param {string} [params.search=""] - Search query string
 * @param {string} [params.sortBy="updatedAt"] - Field to sort by
 * @param {string} [params.order="desc"] - Sort order (asc/desc)
 * @param {string} [params.tab="all"] - Tab filter (all/active/inactive)
 * @param {string|number} [params.id=""] - Filter by specific user ID
 * @param {boolean} [params.includeCounts=true] - Include count information
 * @returns {Promise} API response with users list
 *
 * @example
 * // Get first page of users
 * await getUsers({ page: 1, limit: 10 });
 *
 * @example
 * // Search users with filters
 * await getUsers({ search: "john", tab: "active", sortBy: "name", order: "asc" });
 */
export const getUsers = async (params = {}) => {
  try {
    const {
      limit = 50,
      pageSize = 50,
      page = 1,
      search = "",
      sortBy = "updatedAt",
      order = "desc",
      tab = "all",
      id = "",
      includeCounts = true,
    } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      pageSize: pageSize.toString(),
      page: page.toString(),
      search: search.toString(),
      sortBy: sortBy.toString(),
      order: order.toString(),
      tab: tab.toString(),
      id: id.toString(),
      includeCounts: includeCounts.toString(),
    });

    const response = await api.get(`/masters/user?${queryParams.toString()}`);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

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
/**
 * Create a new user
 * Supports both JSON and FormData for file uploads
 * Automatically handles multipart/form-data when FormData is passed
 *
 * @param {FormData|Object} userData - User data to create
 *   - FormData: For file uploads (multipart/form-data)
 *   - Object: For JSON requests
 *
 * @param {string} [userData.name] - Full name
 * @param {string} [userData.jobTitleId] - Job title ID
 * @param {string} [userData.mobile] - Mobile number
 * @param {string} [userData.email] - Email address
 * @param {string} [userData.timezoneId] - Timezone ID
 * @param {string} [userData.home] - Home address
 * @param {string} [userData.office] - Office address
 * @param {number} [userData.hourlyRate] - Hourly rate
 * @param {boolean} [userData.roundTimeEntries] - Round time entries flag
 * @param {string} [userData.roundTimeEntryType] - Round time entry type
 * @param {boolean} [userData.dailyAgendaEmail] - Daily agenda email flag
 * @param {File} [userData.profileImage] - Profile photo file (when using FormData)
 *
 * @returns {Promise} API response with created user details
 *
 * @example
 * // JSON request (no files)
 * await createUser({ name: "John Doe", email: "john@example.com" });
 *
 * @example
 * // Multipart request (with files)
 * const formData = new FormData();
 * formData.append("name", "John Doe");
 * formData.append("profileImage", file);
 * await createUser(formData);
 */
export const createUser = async (userData) => {
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

    const response = await api.post(`/masters/user`, userData);

    return response.data;
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
