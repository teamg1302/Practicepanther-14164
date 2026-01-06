/**
 * Role service for managing roles and permissions.
 * @module core/services/roleService
 *
 * Provides functions to:
 * - Fetch roles list with pagination and filtering
 * - Get role details by ID
 * - Create new roles
 * - Update existing roles
 * - Delete roles
 * - Fetch permissions
 * - Get role modules
 */

import api from "./api";

/**
 * Get roles list with pagination and filtering
 * @param {Object} params - Query parameters for roles list
 * @param {number} [params.limit=10] - Number of items per page
 * @param {number} [params.pageSize=10] - Page size (same as limit)
 * @param {number} [params.page=1] - Page number
 * @param {string} [params.search=""] - Search query string
 * @param {string} [params.sortBy="updatedAt"] - Field to sort by
 * @param {string} [params.order="desc"] - Sort order (asc/desc)
 * @param {string} [params.tab="all"] - Tab filter (all/active/inactive)
 * @param {string|number} [params.id=""] - Filter by specific role ID
 * @param {boolean} [params.includeCounts=true] - Include count information
 * @returns {Promise} API response with roles list
 *
 * @example
 * // Get first page of roles
 * await getRoles({ page: 1, limit: 10 });
 *
 * @example
 * // Search roles with filters
 * await getRoles({ search: "admin", tab: "active", sortBy: "name", order: "asc" });
 */
export const getRoles = async (params = {}) => {
  try {
    const {
      limit = 50,
      pageSize = 1,
      page = 1,
      search = "",
      sortBy = "updatedAt",
      order = "desc",
      tab = "all",
      id = "",
      includeCounts = true,
    } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      pageSize: pageSize.toString(),
      page: page.toString(),
      search: search.toString(),
      sortBy: sortBy.toString(),
      order: order.toString(),
      tab: tab.toString(),
      id: id.toString(),
      includeCounts: includeCounts.toString(),
    });

    const response = await api.get(`/masters/role?${queryParams.toString()}`);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get role details by role ID
 * @param {string|number} roleId - Role ID to fetch details for
 * @returns {Promise} API response with role details
 *
 * @example
 * await getRoleDetails(1);
 */
export const getRoleDetails = async (roleId) => {
  try {
    const response = await api.get(`/masters/role/${roleId}`);
    // Handle nested response structure (e.g., response.data.data.role)
    return response.data?.data?.role || response.data?.role || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create a new role
 * @param {Object} roleData - Role data to create
 * @param {string} roleData.name - Role name
 * @param {string} [roleData.description] - Role description
 * @param {Array<string>} [roleData.permissions] - Array of permission IDs
 * @param {boolean} [roleData.isActive] - Whether the role is active
 * @returns {Promise} API response with created role
 *
 * @example
 * await createRole({ name: "Admin", description: "Administrator role", permissions: ["1", "2"] });
 */
export const createRole = async (roleData) => {
  try {
    const response = await api.post("/masters/role", roleData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Add a new role
 * @param {Object} roleData - Role data to add
 * @param {string} roleData.name - Role name
 * @param {string} [roleData.description] - Role description
 * @param {string} [roleData.firmId] - Firm ID
 * @param {Array<Object>} [roleData.permissions] - Array of permission objects with moduleName and actions
 * @param {boolean} [roleData.isActive] - Whether the role is active
 * @returns {Promise} API response with created role
 *
 * @example
 * await addRole({ 
 *   name: "Admin", 
 *   description: "Administrator role", 
 *   permissions: [{ moduleName: "manage_contacts", actions: { create: true, read: true } }] 
 * });
 */
export const addRole = async (roleData) => {
  try {
    const response = await api.post("/masters/role", roleData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update role details by role ID
 * @param {string|number} roleId - Role ID to update
 * @param {Object} roleData - Role data to update
 * @param {string} [roleData.name] - Role name
 * @param {string} [roleData.description] - Role description
 * @param {Array<string>} [roleData.permissions] - Array of permission IDs
 * @param {boolean} [roleData.isActive] - Whether the role is active
 * @returns {Promise} API response with updated role details
 *
 * @example
 * await updateRole(1, { name: "Super Admin", description: "Updated description" });
 */
export const updateRole = async (roleId, roleData) => {
  try {
    const response = await api.patch(`/masters/role/${roleId}`, roleData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



/**
 * Delete role by role ID
 * @param {string|number} roleId - Role ID to delete
 * @returns {Promise} API response
 *
 * @example
 * await deleteRole(1);
 */
export const deleteRole = async (roleId) => {
  try {
    const response = await api.delete(`/masters/role/${roleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get permissions list
 * @param {Object} [params={}] - Optional query parameters
 * @returns {Promise} API response with permissions list
 *
 * @example
 * await getPermissions();
 */
export const getPermissions = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams
      ? `/masters/permission?${queryParams}`
      : "/masters/permission";

    const response = await api.get(url);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get role modules list
 * @returns {Promise} API response with role modules list
 *
 * @example
 * await getRoleModules();
 */
export const getRoleModules = async () => {
  try {
    const response = await api.get("/masters/role/modules");
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};