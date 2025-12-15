import api from "./api";

/**
 * Get matters list
 * @param {Object} [params={}] - Optional query parameters for matters list
 * @param {number} [params.limit] - Number of items per page
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search query string
 * @param {string} [params.sortBy] - Field to sort by
 * @param {string} [params.order] - Sort order (asc/desc)
 * @returns {Promise} API response with matters list
 *
 * @example
 * // Get all matters
 * await getMatters();
 *
 * @example
 * // Get matters with pagination
 * await getMatters({ page: 1, limit: 10 });
 *
 * @example
 * // Search matters
 * await getMatters({ search: "contract", sortBy: "name", order: "asc" });
 */
export const getMatters = async (params = {}) => {
  try {
    // Build query string if params are provided
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.contactIds) queryParams.append("contactIds", params.contactIds);

    const url = queryParams.toString()
      ? `/matters?${queryParams.toString()}`
      : "/matters";

    const response = await api.get(url);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create a new matter
 * @param {Object} matterData - Matter data to create
 * @returns {Promise} API response with created matter
 *
 * @example
 * // Create a new matter
 * await createMatter({
 *   name: "Contract Review",
 *   description: "Review of client contract",
 *   // ... other matter fields
 * });
 */
export const createMatter = async (matterData) => {
  try {
    const response = await api.post("/matters", matterData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get a matter by id
 * @param {string} matterId - Matter id
 * @returns {Promise} API response with matter
 *
 * @example
 * // Get a matter by id
 * await getMatterById("123");
 */
export const getMatterById = async (matterId) => {
  try {
    const response = await api.get(`/matters/${matterId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update a matter
 * @param {string} matterId - Matter id
 * @param {Object} matterData - Matter data to update
 * @returns {Promise} API response with updated matter
 *
 * @example
 * // Update a matter
 * await updateMatter("123", { name: "Updated Matter Name" });
 */
export const updateMatter = async (matterId, matterData) => {
  try {
    const response = await api.patch(`/matters/${matterId}`, matterData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a matter
 * @param {string} matterId - Matter id
 * @returns {Promise} API response with deleted matter
 *
 * @example
 * // Delete a matter
 * await deleteMatter("123");
 */
export const deleteMatter = async (matterId) => {
  try {
    const response = await api.delete(`/matters/${matterId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get activities log by matter id
 * @param {Object} [params={}] - Optional query parameters for activities list
 * @param {string} params.matterId - Matter id (required)
 * @param {number} [params.limit] - Number of items per page
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search query string
 * @param {string} [params.sortBy] - Field to sort by
 * @param {string} [params.order] - Sort order (asc/desc)
 * @returns {Promise} API response with activities list
 *
 * @example
 * // Get all activities for a matter
 * await getActivitiesLogByMatterId({ matterId: "123" });
 *
 * @example
 * // Get activities with pagination
 * await getActivitiesLogByMatterId({ matterId: "123", page: 1, limit: 10 });
 *
 * @example
 * // Search activities
 * await getActivitiesLogByMatterId({ matterId: "123", search: "update", sortBy: "createdAt", order: "desc" });
 */
export const getActivitiesLogByMatterId = async (params = {}) => {
  try {
    // Extract matterId from params
    const { matterId, ...queryParams } = params;

    if (!matterId) {
      throw new Error("matterId is required");
    }

    // Build query string if params are provided
    const urlParams = new URLSearchParams();

    if (queryParams.limit)
      urlParams.append("limit", queryParams.limit.toString());
    if (queryParams.page) urlParams.append("page", queryParams.page.toString());
    if (queryParams.search) urlParams.append("search", queryParams.search);
    if (queryParams.sortBy) urlParams.append("sortBy", queryParams.sortBy);
    if (queryParams.order) urlParams.append("order", queryParams.order);

    const url = urlParams.toString()
      ? `/matters/${matterId}/activity-log?${urlParams.toString()}`
      : `/matters/${matterId}/activity-log`;

    const response = await api.get(url);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
