/**
 * Item service for managing items.
 * @module core/services/itemService
 *
 * Provides functions to:
 * - Fetch items list with pagination and filtering
 * - Get item details by ID
 * - Create new items
 * - Update existing items
 * - Delete items
 */

import api from "./api";

/**
 * Get items list with pagination and filtering
 * @param {Object} [params={}] - Optional query parameters for items list
 * @param {number} [params.limit] - Number of items per page
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search query string
 * @param {string} [params.sortBy] - Field to sort by
 * @param {string} [params.order] - Sort order (asc/desc)
 * @param {string} [params.status] - Filter by status (active/inactive)
 * @param {string} [params.categoryId] - Filter by category ID
 * @returns {Promise} API response with items list
 *
 * @example
 * // Get all items
 * await getItems();
 *
 * @example
 * // Get items with pagination
 * await getItems({ page: 1, limit: 10 });
 *
 * @example
 * // Search items with filters
 * await getItems({
 *   search: "legal",
 *   categoryId: "category-123",
 *   sortBy: "name",
 *   order: "asc"
 * });
 */
export const getItems = async (params = {}) => {
  try {
    // Build query string if params are provided
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);
    if (params.status) queryParams.append("status", params.status);
    if (params.categoryId) queryParams.append("categoryId", params.categoryId);

    const url = queryParams.toString()
      ? `/masters/item?${queryParams.toString()}`
      : "/masters/item";

    const response = await api.get(url);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create a new item
 * @param {Object} itemData - Item data to create
 * @param {string} itemData.name - Item name
 * @param {string} [itemData.description] - Item description
 * @param {string} [itemData.categoryId] - Category ID
 * @param {string} [itemData.status] - Item status (active/inactive)
 * @param {number} [itemData.price] - Item price
 * @param {string} [itemData.unit] - Item unit (e.g., "hour", "piece")
 * @param {string} [itemData.color] - Item color code
 * @param {string} [itemData.icon] - Item icon
 * @returns {Promise} API response with created item
 *
 * @example
 * // Create a new item
 * await createItem({
 *   name: "Legal Consultation",
 *   description: "Hourly legal consultation service",
 *   categoryId: "category-123",
 *   status: "active",
 *   price: 150.00,
 *   unit: "hour"
 * });
 */
export const createItem = async (itemData) => {
  try {
    const response = await api.post("/masters/item", itemData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get an item by ID
 * @param {string|number} itemId - Item ID
 * @returns {Promise} API response with item details
 *
 * @example
 * // Get an item by ID
 * await getItemById("123");
 */
export const getItemById = async (itemId) => {
  try {
    const response = await api.get(`/masters/item/${itemId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update an item
 * @param {string|number} itemId - Item ID to update
 * @param {Object} itemData - Item data to update
 * @param {string} [itemData.name] - Item name
 * @param {string} [itemData.description] - Item description
 * @param {string} [itemData.categoryId] - Category ID
 * @param {string} [itemData.status] - Item status (active/inactive)
 * @param {number} [itemData.price] - Item price
 * @param {string} [itemData.unit] - Item unit (e.g., "hour", "piece")
 * @param {string} [itemData.color] - Item color code
 * @param {string} [itemData.icon] - Item icon
 * @returns {Promise} API response with updated item
 *
 * @example
 * // Update an item
 * await updateItem("123", {
 *   name: "Updated Item Name",
 *   description: "Updated description",
 *   price: 175.00
 * });
 */
export const updateItem = async (itemId, itemData) => {
  try {
    const response = await api.patch(`/masters/item/${itemId}`, itemData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete an item
 * @param {string|number} itemId - Item ID to delete
 * @returns {Promise} API response with deleted item
 *
 * @example
 * // Delete an item
 * await deleteItem("123");
 */
export const deleteItem = async (itemId) => {
  try {
    const response = await api.delete(`/masters/item/${itemId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

