/**
 * Flat fee service for managing flat fees.
 * @module core/services/flatfeesService
 *
 * Provides functions to:
 * - Fetch flat fees list with pagination and filtering
 * - Get flat fee details by ID
 * - Create new flat fees
 * - Update existing flat fees
 * - Delete flat fees
 */

import api from "./api";

/**
 * Get flat fees list with pagination and filtering
 * @param {Object} [params={}] - Optional query parameters for flat fees list
 * @param {number} [params.limit] - Number of items per page
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search query string
 * @param {string} [params.sortBy] - Field to sort by
 * @param {string} [params.order] - Sort order (asc/desc)
 * @param {string} [params.status] - Filter by status (active/inactive)
 * @param {string} [params.matterId] - Filter by matter ID
 * @param {string} [params.startDate] - Filter by start date
 * @param {string} [params.endDate] - Filter by end date
 * @returns {Promise} API response with flat fees list
 *
 * @example
 * // Get all flat fees
 * await getFlatfees();
 *
 * @example
 * // Get flat fees with pagination
 * await getFlatfees({ page: 1, limit: 10 });
 *
 * @example
 * // Search flat fees with filters
 * await getFlatfees({
 *   search: "consultation",
 *   matterId: "matter-123",
 *   sortBy: "date",
 *   order: "desc"
 * });
 */
export const getFlatfees = async (params = {}) => {
  try {
    // Build query string if params are provided
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);
    if (params.status) queryParams.append("status", params.status);
    if (params.matterId) queryParams.append("matterId", params.matterId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const url = queryParams.toString()
      ? `/flat-fees?${queryParams.toString()}`
      : "/flat-fees";

    const response = await api.get(url);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create a new flat fee
 * @param {Object} flatfeeData - Flat fee data to create
 * @param {string} flatfeeData.name - Flat fee name/description
 * @param {number} flatfeeData.amount - Flat fee amount
 * @param {string} [flatfeeData.matterId] - Matter ID
 * @param {string} [flatfeeData.date] - Flat fee date
 * @param {string} [flatfeeData.description] - Flat fee description
 * @param {string} [flatfeeData.billingStatus] - Billing status
 * @param {string} [flatfeeData.paymentStatus] - Payment status
 * @param {boolean} [flatfeeData.isActive] - Flat fee status (active/inactive)
 * @returns {Promise} API response with created flat fee
 *
 * @example
 * // Create a new flat fee
 * await createFlatfee({
 *   name: "Legal Consultation Fee",
 *   amount: 500.00,
 *   matterId: "matter-123",
 *   date: "2025-01-15"
 * });
 */
export const createFlatfee = async (flatfeeData) => {
  try {
    const response = await api.post("/flat-fees", flatfeeData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get a flat fee by ID
 * @param {string|number} flatfeeId - Flat fee ID
 * @returns {Promise} API response with flat fee details
 *
 * @example
 * // Get a flat fee by ID
 * await getFlatfeeById("123");
 */
export const getFlatfeeById = async (flatfeeId) => {
  try {
    const response = await api.get(`/flat-fees/${flatfeeId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update a flat fee
 * @param {string|number} flatfeeId - Flat fee ID to update
 * @param {Object} flatfeeData - Flat fee data to update
 * @param {string} [flatfeeData.name] - Flat fee name/description
 * @param {number} [flatfeeData.amount] - Flat fee amount
 * @param {string} [flatfeeData.matterId] - Matter ID
 * @param {string} [flatfeeData.date] - Flat fee date
 * @param {string} [flatfeeData.description] - Flat fee description
 * @param {string} [flatfeeData.billingStatus] - Billing status
 * @param {string} [flatfeeData.paymentStatus] - Payment status
 * @param {boolean} [flatfeeData.isActive] - Flat fee status (active/inactive)
 * @returns {Promise} API response with updated flat fee
 *
 * @example
 * // Update a flat fee
 * await updateFlatfee("123", {
 *   name: "Updated Flat Fee Name",
 *   amount: 600.00
 * });
 */
export const updateFlatfee = async (flatfeeId, flatfeeData) => {
  try {
    const response = await api.patch(`/flat-fees/${flatfeeId}`, flatfeeData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a flat fee
 * @param {string|number} flatfeeId - Flat fee ID to delete
 * @returns {Promise} API response with deleted flat fee
 *
 * @example
 * // Delete a flat fee
 * await deleteFlatfee("123");
 */
export const deleteFlatfee = async (flatfeeId) => {
  try {
    const response = await api.delete(`/flat-fees/${flatfeeId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

