import api from "./api";

/**
 * Get timezone list
 * Fetches available timezones from the API
 * @param {Object} [params={}] - Optional query parameters
 * @returns {Promise} API response with timezone list
 *
 * @example
 * // Get all timezones
 * await getTimezone();
 *
 * @example
 * // Get timezones with search/filter parameters
 * await getTimezone({ search: "America" });
 */
export const getTimezone = async (params = {}) => {
  try {
    // Build query string if params are provided
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams
      ? `/masters/search/timezone?${queryParams}`
      : "/masters/search/timezone";

    const response = await api.get(url);
    // Handle nested response structure if needed
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get job titles list
 * Fetches available job titles from the API
 * @param {Object} [params={}] - Optional query parameters
 * @param {number} [params.limit=100] - Number of items to fetch
 * @param {number} [params.pageSize=60] - Page size
 * @param {number} [params.page=1] - Page number
 * @returns {Promise} API response with job titles list
 *
 * @example
 * // Get all job titles with default pagination
 * await getTitles();
 *
 * @example
 * // Get job titles with custom pagination
 * await getTitles({ limit: 50, pageSize: 30, page: 1 });
 */
export const getTitles = async (params = {}) => {
  try {
    const { limit = 100, pageSize = 60, page = 1, ...otherParams } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      pageSize: pageSize.toString(),
      page: page.toString(),
      ...otherParams, // Allow additional params to be passed
    });

    const response = await api.get(
      `/masters/job-title?${queryParams.toString()}`
    );

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
