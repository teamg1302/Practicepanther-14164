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
    const response = await api.get(`/recycle-bin?${queryParams.toString()}`);

    // Handle nested response structure (API may return { data: { data: [...] } } or { data: [...] })
    // Return the inner data if it exists, otherwise return the response data directly
    return response.data?.data || response.data;
  } catch (error) {
    // Throw API error response data if available, otherwise throw error message
    // This ensures consistent error handling across the application
    throw error.response?.data || error.message;
  }
};

/**
 * Permanently delete an item from the recycle bin.
 *
 * Deletes a specific item from the recycle bin by its ID. This operation is permanent
 * and cannot be undone. The item will be completely removed from the system.
 *
 * @param {string|number} id - The unique identifier of the recycle bin item to delete
 * @returns {Promise<Object>} API response confirming the deletion
 *
 * @throws {Object|string} Throws error response data from API or error message
 *
 * @example
 * // Delete a recycle bin item by ID
 * await deleteRecyclebin("123");
 *
 * @example
 * // Delete with numeric ID
 * await deleteRecyclebin(456);
 */
export const deleteRecycleBin = async (id) => {
  try {
    // Validate that id is provided
    if (!id) {
      throw new Error("ID is required to delete recycle bin item");
    }

    // Make API request to delete recycle bin item
    const response = await api.delete(`/recycle-bin/${id}`);

    // Handle nested response structure (API may return { data: { data: {...} } } or { data: {...} })
    // Return the inner data if it exists, otherwise return the response data directly
    return response.data?.data || response.data;
  } catch (error) {
    // Throw API error response data if available, otherwise throw error message
    // This ensures consistent error handling across the application
    throw error.response?.data || error.message;
  }
};

/**
 * Restore an item from the recycle bin.
 *
 * Restores a specific item from the recycle bin by its ID. This operation will bring the item back to its original location.
 *
 * @param {string|number} id - The unique identifier of the recycle bin item to restore
 * @returns {Promise<Object>} API response confirming the restoration
 * @returns {Array} returns.data - Array of restored items
 *
 * @throws {Object|string} Throws error response data from API or error message
 *
 * @example
 * // Restore a recycle bin item by ID
 * await restoreRecyclebin("123");
 *
 * @example
 * // Restore with numeric ID
 * await restoreRecyclebin(456);
 */
export const restoreRecycleBin = async (id) => {
  try {
    const response = await api.post(`/recycle-bin/${id}/restore`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
