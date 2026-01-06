/**
 * Masters service for fetching reference data.
 * @module core/services/mastersService
 *
 * Provides functions to fetch various master/reference data from the API:
 * - Timezones
 * - Job titles
 * - Countries
 * - Currencies
 * - States (by country)
 * - Tax rates
 */

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
      ? `/masters/search/timezone/?${queryParams}&limit=1000`
      : "/masters/search/timezone/?limit=1000";

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
    const { limit = 500, ...otherParams } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      search: "",
      limit: limit.toString(),
      // pageSize: pageSize.toString(),
      // page: page.toString(),
      ...otherParams, // Allow additional params to be passed
    });

    const response = await api.get(
      `/masters/search/job-title?${queryParams.toString()}`
    );

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get countries list
 * Fetches available countries from the API
 * @param {Object} [params={}] - Optional query parameters
 * @param {number} [params.limit=50] - Number of items to fetch
 * @returns {Promise} API response with countries list
 *
 * @example
 * // Get all countries with default limit
 * await getCountries();
 *
 * @example
 * // Get countries with custom limit
 * await getCountries({ limit: 100 });
 */
export const getCountries = async (params = {}) => {
  try {
    const { limit = 500, ...otherParams } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      search: "",
      limit: limit.toString(),
      ...otherParams, // Allow additional params to be passed
    });

    const response = await api.get(
      `/masters/search/country?${queryParams.toString()}`
    );

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get currencies list
 * Fetches available currencies from the API
 * @param {Object} [params={}] - Optional query parameters
 * @param {number} [params.limit=50] - Number of items to fetch
 * @returns {Promise} API response with currencies list
 *
 * @example
 * // Get all currencies with default limit
 * await getCurrencies();
 *
 * @example
 * // Get currencies with custom limit
 * await getCurrencies({ limit: 100 });
 */
export const getCurrencies = async (params = {}) => {
  try {
    const { limit = 500, ...otherParams } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      search: "",
      limit: limit.toString(),
      ...otherParams, // Allow additional params to be passed
    });

    const response = await api.get(
      `/masters/search/currency?${queryParams.toString()}`
    );

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get states by country
 * Fetches available states for a specific country from the API
 * @param {Object} params - Query parameters
 * @param {string} params.countryId - Country ID to fetch states for
 * @param {number} [params.limit=500] - Number of items to fetch
 * @returns {Promise} API response with states list
 *
 * @example
 * // Get states for a country
 * await getStatesByCountry({ countryId: "123", limit: 500 });
 */
export const getStatesByCountry = async (params) => {
  try {
    const { countryId, limit = 500, ...otherParams } = params;

    if (!countryId) {
      throw new Error("countryId is required");
    }

    // Build query string
    const queryParams = new URLSearchParams({
      search: "",
      countryId: countryId.toString(),
      limit: limit.toString(),
      ...otherParams, // Allow additional params to be passed
    });

    const response = await api.get(
      `/masters/search/state?${queryParams.toString()}`
    );

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get tax rates list
 * Fetches available tax rates from the API
 * @param {Object} [params={}] - Optional query parameters
 * @param {string} [params.search=""] - Search query string
 * @param {number} [params.limit=50] - Number of items to fetch
 * @returns {Promise} API response with tax rates list
 *
 * @example
 * // Get all tax rates with default limit
 * await getTax();
 *
 * @example
 * // Get tax rates with search and custom limit
 * await getTax({ search: "VAT", limit: 100 });
 */
export const getTax = async (params = {}) => {
  try {
    const { search = "", limit = 500, ...otherParams } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      search: search.toString(),
      limit: limit.toString(),
      ...otherParams, // Allow additional params to be passed
    });

    const response = await api.get(
      `/masters/search/tax?${queryParams.toString()}`
    );

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
