/**
 * Test suite for expense service.
 * @module core/services/expenseService.test
 *
 * Tests all expense-related API service functions including:
 * - getExpenses
 * - createExpense
 * - getExpenseById
 * - updateExpense
 * - deleteExpense
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as expenseService from "./expenseService";
import api from "./api";

// Mock the API module
vi.mock("./api", () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: mockApi,
  };
});

describe("Expense Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getExpenses", () => {
    it("should fetch expenses list without params", async () => {
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                _id: "1",
                name: "Office Supplies",
                amount: 150.0,
                date: "2025-01-15",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await expenseService.getExpenses();

      expect(api.get).toHaveBeenCalledWith("/expenses");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch expenses with pagination params", async () => {
      const params = { page: 1, limit: 10 };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Expense 1" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await expenseService.getExpenses(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("/expenses");
      expect(callArgs).toContain("page=1");
      expect(callArgs).toContain("limit=10");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch expenses with search and sort params", async () => {
      const params = {
        search: "office",
        sortBy: "date",
        order: "desc",
      };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Office Expense" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await expenseService.getExpenses(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("/expenses");
      expect(callArgs).toContain("search=office");
      expect(callArgs).toContain("sortBy=date");
      expect(callArgs).toContain("order=desc");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch expenses with categoryId and date filters", async () => {
      const params = {
        categoryId: "category-123",
        startDate: "2025-01-01",
        endDate: "2025-01-31",
      };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Category Expense" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await expenseService.getExpenses(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("categoryId=category-123");
      expect(callArgs).toContain("startDate=2025-01-01");
      expect(callArgs).toContain("endDate=2025-01-31");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const errorResponse = {
        response: {
          data: { message: "Failed to fetch expenses" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(expenseService.getExpenses()).rejects.toEqual(
        errorResponse.response.data
      );
    });

    it("should handle error without response object", async () => {
      const error = new Error("Network error");

      api.get.mockRejectedValue(error);

      await expect(expenseService.getExpenses()).rejects.toEqual(
        error.message
      );
    });
  });

  describe("getExpenseById", () => {
    it("should fetch expense by id", async () => {
      const expenseId = "123";
      const mockResponse = {
        data: {
          data: {
            _id: expenseId,
            name: "Office Supplies",
            amount: 150.0,
            date: "2025-01-15",
            categoryId: "category-123",
            isActive: true,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await expenseService.getExpenseById(expenseId);

      expect(api.get).toHaveBeenCalledWith(`/expenses/${expenseId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const expenseId = "123";
      const errorResponse = {
        response: {
          data: { message: "Expense not found" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(
        expenseService.getExpenseById(expenseId)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("createExpense", () => {
    it("should create a new expense", async () => {
      const expenseData = {
        name: "Office Supplies",
        amount: 150.0,
        categoryId: "category-123",
        date: "2025-01-15",
      };
      const mockResponse = {
        data: {
          data: {
            _id: "123",
            ...expenseData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await expenseService.createExpense(expenseData);

      expect(api.post).toHaveBeenCalledWith("/expenses", expenseData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should create expense with minimal data", async () => {
      const expenseData = {
        name: "Minimal Expense",
        amount: 100.0,
      };
      const mockResponse = {
        data: {
          data: {
            _id: "123",
            ...expenseData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await expenseService.createExpense(expenseData);

      expect(api.post).toHaveBeenCalledWith("/expenses", expenseData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const expenseData = { name: "New Expense", amount: 100.0 };
      const errorResponse = {
        response: {
          data: { message: "Failed to create expense" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(
        expenseService.createExpense(expenseData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("updateExpense", () => {
    it("should update an expense", async () => {
      const expenseId = "123";
      const expenseData = { name: "Updated Expense" };
      const mockResponse = {
        data: {
          data: {
            _id: expenseId,
            ...expenseData,
          },
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await expenseService.updateExpense(
        expenseId,
        expenseData
      );

      expect(api.patch).toHaveBeenCalledWith(
        `/expenses/${expenseId}`,
        expenseData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should update expense with multiple fields", async () => {
      const expenseId = "123";
      const expenseData = {
        name: "Updated Expense",
        amount: 200.0,
        categoryId: "category-456",
        isActive: false,
      };
      const mockResponse = {
        data: {
          data: {
            _id: expenseId,
            ...expenseData,
          },
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await expenseService.updateExpense(
        expenseId,
        expenseData
      );

      expect(api.patch).toHaveBeenCalledWith(
        `/expenses/${expenseId}`,
        expenseData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const expenseId = "123";
      const expenseData = { name: "Updated Expense" };
      const errorResponse = {
        response: {
          data: { message: "Failed to update expense" },
        },
      };

      api.patch.mockRejectedValue(errorResponse);

      await expect(
        expenseService.updateExpense(expenseId, expenseData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("deleteExpense", () => {
    it("should delete an expense", async () => {
      const expenseId = "123";
      const mockResponse = {
        data: {
          data: {
            _id: expenseId,
            deleted: true,
          },
        },
      };

      api.delete.mockResolvedValue(mockResponse);

      const result = await expenseService.deleteExpense(expenseId);

      expect(api.delete).toHaveBeenCalledWith(`/expenses/${expenseId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const expenseId = "123";
      const errorResponse = {
        response: {
          data: { message: "Failed to delete expense" },
        },
      };

      api.delete.mockRejectedValue(errorResponse);

      await expect(expenseService.deleteExpense(expenseId)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });
});

