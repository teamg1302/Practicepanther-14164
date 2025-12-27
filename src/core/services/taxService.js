import api from "./api";

/**
 * Get tax rates list with pagination and filtering
 * @param {Object} [params={}] - Optional query parameters for tax rates list
 * @param {number} [params.limit] - Number of items per page
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search query string
 * @param {string} [params.sortBy] - Field to sort by
 * @param {string} [params.order] - Sort order (asc/desc)
 * @param {boolean} [params.isActive] - Filter by active status
 * @returns {Promise} API response with tax rates list
 *
 * @example
 * // Get all tax rates
 * await getTaxRates();
 *
 * @example
 * // Get tax rates with pagination
 * await getTaxRates({ page: 1, limit: 10 });
 *
 * @example
 * // Search tax rates
 * await getTaxRates({
 *   search: "VAT",
 *   isActive: true
 * });
 */
export const getTaxRates = async (params = {}) => {
  try {
    // Build query string if params are provided
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);
    if (params.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());

    const url = queryParams.toString()
      ? `/masters/tax?${queryParams.toString()}`
      : "/masters/tax";

    const response = await api.get(url);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get a tax rate by ID
 * @param {string|number} taxId - Tax rate ID
 * @returns {Promise} API response with tax rate details
 *
 * @example
 * // Get a tax rate by ID
 * await getTaxRateById("123");
 */
export const getTaxRateById = async (taxId) => {
  try {
    const response = await api.get(`/masters/tax/${taxId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

