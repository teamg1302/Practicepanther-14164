/**
 * Recyclebin service module for managing recycle bin operations.
 * 
 * This module provides services for interacting with the recycle bin API,
 * allowing users to retrieve deleted items that can be restored or permanently deleted.
 * 
 * @module core/services/recyclebinService
 * @see {@link module:core/services/api} for the underlying API client
 */

import api from "./api";

/**
 * Get recycle bin items with pagination, search, and sorting support.
 * 
 * Fetches a paginated list of items from the recycle bin. Supports filtering by search term,
 * sorting by various fields, and pagination controls.
 * 
 * @param {Object} [params={}] - Query parameters for recycle bin list
 * @param {number} [params.limit=50] - Number of items per page (default: 50)
 * @param {number} [params.page=1] - Page number to retrieve (default: 1)
 * @param {string} [params.search=""] - Search query string to filter items by name or content
 * @param {string} [params.sortBy="updatedAt"] - Field to sort by (e.g., "updatedAt", "deletedAt", "name")
 * @param {string} [params.order="desc"] - Sort order: "asc" for ascending, "desc" for descending
 * @returns {Promise<Object>} API response containing recycle bin items
 * @returns {Array} returns.data - Array of recycle bin items
 * @returns {number} returns.total - Total number of items (if provided by API)
 * @returns {number} returns.page - Current page number
 * @returns {number} returns.limit - Items per page
 * 
 * @throws {Object|string} Throws error response data from API or error message
 * 
 * @example
 * // Get first page of recycle bin items with default settings
 * const items = await getRecyclebin();
 * 
 * @example
 * // Get first page with custom limit
 * const items = await getRecyclebin({ page: 1, limit: 10 });
 * 
 * @example
 * // Search for specific items
 * const items = await getRecyclebin({ 
 *   search: "document", 
 *   sortBy: "deletedAt", 
 *   order: "desc" 
 * });
 * 
 * @example
 * // Get second page with search and sorting
 * const items = await getRecyclebin({ 
 *   page: 2, 
 *   limit: 20, 
 *   search: "invoice", 
 *   sortBy: "name", 
 *   order: "asc" 
 * });
 */
export const getRecyclebin = async (params = {}) => {
  try {
    // Extract and set default values for query parameters
    const {
      limit = 50,
      page = 1,
      search = "",
      sortBy = "updatedAt",
      order = "desc",
    } = params;

    // Build query string with URLSearchParams for proper encoding
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      search: search.toString(),
      sortBy: sortBy.toString(),
      order: order.toString(),
    });

    // Make API request to recycle bin endpoint
    const response = await api.get(
      `/recycle-bin?${queryParams.toString()}`
    );

    // Handle nested response structure (API may return { data: { data: [...] } } or { data: [...] })
    // Return the inner data if it exists, otherwise return the response data directly
    return response.data?.data || response.data;
  } catch (error) {
    // Throw API error response data if available, otherwise throw error message
    // This ensures consistent error handling across the application
    throw error.response?.data || error.message;
  }
};

