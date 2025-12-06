import api from "./api";

/**
 * Get contacts list
 * @param {Object} [params={}] - Optional query parameters for contacts list
 * @param {number} [params.limit] - Number of items per page
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search query string
 * @param {string} [params.sortBy] - Field to sort by
 * @param {string} [params.order] - Sort order (asc/desc)
 * @returns {Promise} API response with contacts list
 *
 * @example
 * // Get all contacts
 * await getContacts();
 *
 * @example
 * // Get contacts with pagination
 * await getContacts({ page: 1, limit: 10 });
 *
 * @example
 * // Search contacts
 * await getContacts({ search: "john", sortBy: "name", order: "asc" });
 */
export const getContacts = async (params = {}) => {
  try {
    // Build query string if params are provided
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);

    const url = queryParams.toString()
      ? `/contacts?${queryParams.toString()}`
      : "/contacts";

    const response = await api.get(url);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
