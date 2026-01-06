/**
 * Category service for managing categories.
 * @module core/services/categoryService
 *
 * Provides functions to:
 * - Fetch categories list with pagination and filtering
 * - Get category details by ID
 * - Create new categories
 * - Update existing categories
 * - Delete categories
 */

import api from "./api";

/**
 * Get categories list with pagination and filtering
 * @param {Object} [params={}] - Optional query parameters for categories list
 * @param {number} [params.limit] - Number of items per page
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search query string
 * @param {string} [params.sortBy] - Field to sort by
 * @param {string} [params.order] - Sort order (asc/desc)
 * @param {string} [params.status] - Filter by status (active/inactive)
 * @returns {Promise} API response with categories list
 *
 * @example
 * // Get all categories
 * await getCategories();
 *
 * @example
 * // Get categories with pagination
 * await getCategories({ page: 1, limit: 10 });
 *
 * @example
 * // Search categories with filters
 * await getCategories({
 *   search: "legal",
 *   sortBy: "name",
 *   order: "asc"
 * });
 */
export const getCategories = async (params = {}) => {
  try {
    // Build query string if params are provided
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);
    if (params.status) queryParams.append("status", params.status);

    const url = queryParams.toString()
      ? `/masters/category?${queryParams.toString()}`
      : "/masters/category";

    const response = await api.get(url);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create a new category
 * @param {Object} categoryData - Category data to create
 * @param {string} categoryData.name - Category name
 * @param {string} [categoryData.description] - Category description
 * @param {string} [categoryData.status] - Category status (active/inactive)
 * @param {string} [categoryData.color] - Category color code
 * @param {string} [categoryData.icon] - Category icon
 * @returns {Promise} API response with created category
 *
 * @example
 * // Create a new category
 * await createCategory({
 *   name: "Legal Services",
 *   description: "Legal service category",
 *   status: "active"
 * });
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post("/masters/category", categoryData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get a category by ID
 * @param {string|number} categoryId - Category ID
 * @returns {Promise} API response with category details
 *
 * @example
 * // Get a category by ID
 * await getCategoryById("123");
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await api.get(`/masters/category/${categoryId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update a category
 * @param {string|number} categoryId - Category ID to update
 * @param {Object} categoryData - Category data to update
 * @param {string} [categoryData.name] - Category name
 * @param {string} [categoryData.description] - Category description
 * @param {string} [categoryData.status] - Category status (active/inactive)
 * @param {string} [categoryData.color] - Category color code
 * @param {string} [categoryData.icon] - Category icon
 * @returns {Promise} API response with updated category
 *
 * @example
 * // Update a category
 * await updateCategory("123", {
 *   name: "Updated Category Name",
 *   description: "Updated description"
 * });
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.patch(
      `/masters/category/${categoryId}`,
      categoryData
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a category
 * @param {string|number} categoryId - Category ID to delete
 * @returns {Promise} API response with deleted category
 *
 * @example
 * // Delete a category
 * await deleteCategory("123");
 */
export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/masters/category/${categoryId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

