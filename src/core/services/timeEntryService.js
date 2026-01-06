/**
 * Time entry service for managing time entries.
 * @module core/services/timeEntryService
 *
 * Provides functions to:
 * - Fetch time entries list with pagination and filtering
 * - Create new time entries
 */

import api from "./api";

/**
 * Get time entries list with pagination and filtering
 * @param {Object} [params={}] - Optional query parameters for time entries list
 * @param {number} [params.limit] - Number of items per page
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search query string
 * @param {string} [params.sortBy] - Field to sort by
 * @param {string} [params.order] - Sort order (asc/desc)
 * @param {string} [params.startDate] - Start date filter (ISO format)
 * @param {string} [params.endDate] - End date filter (ISO format)
 * @param {string} [params.contactId] - Filter by contact ID
 * @param {string} [params.matterId] - Filter by matter ID
 * @param {string} [params.userId] - Filter by user ID
 * @param {boolean} [params.isBillable] - Filter by billable status
 * @returns {Promise} API response with time entries list
 *
 * @example
 * // Get all time entries
 * await getTimeEntries();
 *
 * @example
 * // Get time entries with pagination
 * await getTimeEntries({ page: 1, limit: 10 });
 *
 * @example
 * // Search time entries with filters
 * await getTimeEntries({
 *   search: "meeting",
 *   startDate: "2024-01-01",
 *   endDate: "2024-12-31",
 *   sortBy: "date",
 *   order: "desc"
 * });
 */
export const getTimeEntries = async (params = {}) => {
  try {
    // Build query string if params are provided
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.contactId) queryParams.append("contactId", params.contactId);
    if (params.matterId) queryParams.append("matterId", params.matterId);
    if (params.userId) queryParams.append("userId", params.userId);
    if (params.isBillable !== undefined)
      queryParams.append("isBillable", params.isBillable.toString());

    const url = queryParams.toString()
      ? `/time-entries?${queryParams.toString()}`
      : "/time-entries";

    const response = await api.get(url);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create a new time entry
 * @param {Object} timeEntryData - Time entry data to create
 * @param {string} timeEntryData.contact - Contact ID
 * @param {string} timeEntryData.matter - Matter ID
 * @param {string} timeEntryData.date - Date of time entry (ISO format or YYYY-MM-DD)
 * @param {string} [timeEntryData.description] - Description of work performed
 * @param {number} [timeEntryData.hours] - Hours worked
 * @param {number} [timeEntryData.minutes] - Minutes worked
 * @param {string} [timeEntryData.totalTime] - Total time in HH:MM:SS format
 * @param {boolean} [timeEntryData.isBillable] - Whether the time entry is billable
 * @param {string} [timeEntryData.billedBy] - User ID who billed this entry
 * @param {number} [timeEntryData.rate] - Hourly rate
 * @param {string} [timeEntryData.item] - Item ID or name
 * @returns {Promise} API response with created time entry
 *
 * @example
 * // Create a new time entry
 * await createTimeEntry({
 *   contact: "contact-id-123",
 *   matter: "matter-id-456",
 *   date: "2024-12-26",
 *   description: "Client meeting and consultation",
 *   hours: 2,
 *   minutes: 30,
 *   isBillable: true,
 *   rate: 150.00
 * });
 *
 * @example
 * // Create time entry with total time string
 * await createTimeEntry({
 *   contact: "contact-id-123",
 *   matter: "matter-id-456",
 *   date: "2024-12-26",
 *   description: "Document review",
 *   totalTime: "01:30:00",
 *   isBillable: true
 * });
 */
export const createTimeEntry = async (timeEntryData) => {
  try {
    const response = await api.post("/time-entries", timeEntryData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
