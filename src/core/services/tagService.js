import api from "./api";

/**
 * Get tags list with pagination and filtering
 * Fetches available tags from the API
 * @param {Object} [params={}] - Optional query parameters
 * @param {number} [params.limit=50] - Number of items per page
 * @param {number} [params.pageSize=50] - Page size (same as limit)
 * @param {number} [params.page=1] - Page number
 * @param {string} [params.search=""] - Search query string
 * @param {string} [params.sortBy="updatedAt"] - Field to sort by
 * @param {string} [params.order="desc"] - Sort order (asc/desc)
 * @returns {Promise} API response with tags list
 *
 * @example
 * // Get first page of tags
 * await getTags({ page: 1, limit: 10 });
 *
 * @example
 * // Search tags with filters
 * await getTags({ search: "important", page: 1, limit: 50 });
 */
export const getTags = async (params = {}) => {
  try {
    const {
      limit = 50,
      pageSize = 50,
      page = 1,
      search = "",
      sortBy = "updatedAt",
      order = "desc",
      ...otherParams
    } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      pageSize: pageSize.toString(),
      page: page.toString(),
      search: search.toString(),
      sortBy: sortBy.toString(),
      order: order.toString(),
      ...otherParams, // Allow additional params to be passed
    });

    const response = await api.get(`/masters/tag?${queryParams.toString()}`);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
