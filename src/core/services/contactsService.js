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

/**
 * Create a new contact
 * @param {Object} contactData - Contact data to create
 * @returns {Promise} API response with created contact
 *
 * @example
 * // Create a new contact
 * await createContact({
 *   firstName: "John",
 *   lastName: "Doe",
 *   email: "john.doe@example.com",
 *   // ... other contact fields
 * });
 */
export const createContact = async (contactData) => {
  try {
    const response = await api.post("/contacts", contactData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get a contact by id
 * @param {string} contactId - Contact id
 * @returns {Promise} API response with contact
 *
 * @example
 * // Get a contact by id
 * await getContactById("123");
 */
export const getContactById = async (contactId) => {
  try {
    const response = await api.get(`/contacts/${contactId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update a contact
 * @param {string} contactId - Contact id
 * @param {Object} contactData - Contact data to update
 * @returns {Promise} API response with updated contact
 *
 * @example
 * // Update a contact
 * await updateContact("123", { name: "John Doe" });
 */
export const updateContact = async (contactId, contactData) => {
  try {
    const response = await api.patch(`/contacts/${contactId}`, contactData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a contact
 * @param {string} contactId - Contact id
 * @returns {Promise} API response with deleted contact
 *
 * @example
 * // Delete a contact
 * await deleteContact("123");
 */
export const deleteContact = async (contactId) => {
  try {
    const response = await api.delete(`/contacts/${contactId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get matters by contact id
 * @param {string} contactId - Contact id
 * @param {Object} [params={}] - Optional query parameters for matters list
 * @param {number} [params.limit] - Number of items per page
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search query string
 * @param {string} [params.sortBy] - Field to sort by
 * @param {string} [params.order] - Sort order (asc/desc)
 * @returns {Promise} API response with matters list
 *
 * @example
 * // Get all matters for a contact
 * await getMattersByContactId("123");
 *
 * @example
 * // Get matters with pagination
 * await getMattersByContactId("123", { page: 1, limit: 10 });
 *
 * @example
 * // Search matters
 * await getMattersByContactId("123", { search: "matter", sortBy: "name", order: "asc" });
 */
export const getMattersByContactId = async (params = {}) => {
  try {
    // Extract contactId from params
    const { contactId, ...queryParams } = params;

    if (!contactId) {
      throw new Error("contactId is required");
    }

    // Build query string if params are provided
    const urlParams = new URLSearchParams();

    if (queryParams.limit)
      urlParams.append("limit", queryParams.limit.toString());
    if (queryParams.page) urlParams.append("page", queryParams.page.toString());
    if (queryParams.search) urlParams.append("search", queryParams.search);
    if (queryParams.sortBy) urlParams.append("sortBy", queryParams.sortBy);
    if (queryParams.order) urlParams.append("order", queryParams.order);

    const url = urlParams.toString()
      ? `/matters/contact/${contactId}?${urlParams.toString()}`
      : `/matters/contact/${contactId}`;

    const response = await api.get(url);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get activities log by contact id
 * @param {string} contactId - Contact id
 * @param {Object} [params={}] - Optional query parameters for activities list
 * @param {number} [params.limit] - Number of items per page
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search query string
 * @param {string} [params.sortBy] - Field to sort by
 * @param {string} [params.order] - Sort order (asc/desc)
 * @returns {Promise} API response with activities list
 *
 * @example
 * // Get all activities for a contact
 * await getActivitiesLogByContactId("123");
 *
 * @example
 * // Get activities with pagination
 * await getActivitiesLogByContactId("123", { page: 1, limit: 10 });
 *
 * @example
 * // Search activities
 * await getActivitiesLogByContactId("123", { search: "update", sortBy: "createdAt", order: "desc" });
 */
export const getActivitiesLogByContactId = async (params = {}) => {
  try {
    // Extract contactId from params
    const { contactId, ...queryParams } = params;

    if (!contactId) {
      throw new Error("contactId is required");
    }

    // Build query string if params are provided
    const urlParams = new URLSearchParams();

    if (queryParams.limit)
      urlParams.append("limit", queryParams.limit.toString());
    if (queryParams.page) urlParams.append("page", queryParams.page.toString());
    if (queryParams.search) urlParams.append("search", queryParams.search);
    if (queryParams.sortBy) urlParams.append("sortBy", queryParams.sortBy);
    if (queryParams.order) urlParams.append("order", queryParams.order);

    const url = urlParams.toString()
      ? `/contacts/${contactId}/activity-log?${urlParams.toString()}`
      : `/contacts/${contactId}/activity-log`;

    const response = await api.get(url);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
