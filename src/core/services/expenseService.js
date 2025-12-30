import api from "./api";

/**
 * Get expenses list with pagination and filtering
 * @param {Object} [params={}] - Optional query parameters for expenses list
 * @param {number} [params.limit] - Number of items per page
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search query string
 * @param {string} [params.sortBy] - Field to sort by
 * @param {string} [params.order] - Sort order (asc/desc)
 * @param {string} [params.status] - Filter by status (active/inactive)
 * @param {string} [params.categoryId] - Filter by expense category ID
 * @param {string} [params.startDate] - Filter by start date
 * @param {string} [params.endDate] - Filter by end date
 * @returns {Promise} API response with expenses list
 *
 * @example
 * // Get all expenses
 * await getExpenses();
 *
 * @example
 * // Get expenses with pagination
 * await getExpenses({ page: 1, limit: 10 });
 *
 * @example
 * // Search expenses with filters
 * await getExpenses({
 *   search: "office",
 *   categoryId: "category-123",
 *   sortBy: "date",
 *   order: "desc"
 * });
 */
export const getExpenses = async (params = {}) => {
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
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const url = queryParams.toString()
      ? `/expenses?${queryParams.toString()}`
      : "/expenses";

    const response = await api.get(url);

    // Handle nested response structure if needed
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create a new expense
 * @param {Object} expenseData - Expense data to create
 * @param {string} expenseData.name - Expense name/description
 * @param {number} expenseData.amount - Expense amount
 * @param {string} [expenseData.categoryId] - Expense category ID
 * @param {string} [expenseData.date] - Expense date
 * @param {string} [expenseData.paymentMethod] - Payment method
 * @param {string} [expenseData.receipt] - Receipt file URL or path
 * @param {string} [expenseData.notes] - Additional notes
 * @param {string} [expenseData.vendorId] - Vendor/Supplier ID
 * @param {boolean} [expenseData.isActive] - Expense status (active/inactive)
 * @returns {Promise} API response with created expense
 *
 * @example
 * // Create a new expense
 * await createExpense({
 *   name: "Office Supplies",
 *   amount: 150.00,
 *   categoryId: "category-123",
 *   date: "2025-01-15"
 * });
 */
export const createExpense = async (expenseData) => {
  try {
    const response = await api.post("/expenses", expenseData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get an expense by ID
 * @param {string|number} expenseId - Expense ID
 * @returns {Promise} API response with expense details
 *
 * @example
 * // Get an expense by ID
 * await getExpenseById("123");
 */
export const getExpenseById = async (expenseId) => {
  try {
    const response = await api.get(`/expenses/${expenseId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update an expense
 * @param {string|number} expenseId - Expense ID to update
 * @param {Object} expenseData - Expense data to update
 * @param {string} [expenseData.name] - Expense name/description
 * @param {number} [expenseData.amount] - Expense amount
 * @param {string} [expenseData.categoryId] - Expense category ID
 * @param {string} [expenseData.date] - Expense date
 * @param {string} [expenseData.paymentMethod] - Payment method
 * @param {string} [expenseData.receipt] - Receipt file URL or path
 * @param {string} [expenseData.notes] - Additional notes
 * @param {string} [expenseData.vendorId] - Vendor/Supplier ID
 * @param {boolean} [expenseData.isActive] - Expense status (active/inactive)
 * @returns {Promise} API response with updated expense
 *
 * @example
 * // Update an expense
 * await updateExpense("123", {
 *   name: "Updated Expense Name",
 *   amount: 200.00
 * });
 */
export const updateExpense = async (expenseId, expenseData) => {
  try {
    const response = await api.patch(`/expenses/${expenseId}`, expenseData);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete an expense
 * @param {string|number} expenseId - Expense ID to delete
 * @returns {Promise} API response with deleted expense
 *
 * @example
 * // Delete an expense
 * await deleteExpense("123");
 */
export const deleteExpense = async (expenseId) => {
  try {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

