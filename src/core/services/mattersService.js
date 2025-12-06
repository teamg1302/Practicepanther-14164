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
