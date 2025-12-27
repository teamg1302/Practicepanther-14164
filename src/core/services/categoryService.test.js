/**
 * Test suite for category service.
 * @module core/services/categoryService.test
 *
 * Tests all category-related API service functions including:
 * - getCategories
 * - createCategory
 * - getCategoryById
 * - updateCategory
 * - deleteCategory
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as categoryService from "./categoryService";
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

describe("Category Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCategories", () => {
    it("should fetch categories list without params", async () => {
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Category 1", description: "Test category" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await categoryService.getCategories();

      expect(api.get).toHaveBeenCalledWith("/masters/category");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch categories with pagination params", async () => {
      const params = { page: 1, limit: 10 };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Category 1" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await categoryService.getCategories(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("/masters/category");
      expect(callArgs).toContain("page=1");
      expect(callArgs).toContain("limit=10");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch categories with search and sort params", async () => {
      const params = {
        search: "legal",
        sortBy: "name",
        order: "asc",
      };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Legal Category" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await categoryService.getCategories(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("/masters/category");
      expect(callArgs).toContain("search=legal");
      expect(callArgs).toContain("sortBy=name");
      expect(callArgs).toContain("order=asc");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch categories with status filter", async () => {
      const params = { status: "active" };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Active Category", isActive: true }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await categoryService.getCategories(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("status=active");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const errorResponse = {
        response: {
          data: { message: "Failed to fetch categories" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(categoryService.getCategories()).rejects.toEqual(
        errorResponse.response.data
      );
    });

    it("should handle error without response object", async () => {
      const error = new Error("Network error");

      api.get.mockRejectedValue(error);

      await expect(categoryService.getCategories()).rejects.toEqual(
        error.message
      );
    });
  });

  describe("getCategoryById", () => {
    it("should fetch category by id", async () => {
      const categoryId = "123";
      const mockResponse = {
        data: {
          data: {
            _id: categoryId,
            name: "Category 1",
            description: "Test category",
            isActive: true,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await categoryService.getCategoryById(categoryId);

      expect(api.get).toHaveBeenCalledWith(`/masters/category/${categoryId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const categoryId = "123";
      const errorResponse = {
        response: {
          data: { message: "Category not found" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(
        categoryService.getCategoryById(categoryId)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("createCategory", () => {
    it("should create a new category", async () => {
      const categoryData = {
        name: "New Category",
        description: "Test category",
        isActive: true,
      };
      const mockResponse = {
        data: {
          data: {
            _id: "123",
            ...categoryData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await categoryService.createCategory(categoryData);

      expect(api.post).toHaveBeenCalledWith(
        "/masters/category",
        categoryData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should create category with minimal data", async () => {
      const categoryData = {
        name: "Minimal Category",
      };
      const mockResponse = {
        data: {
          data: {
            _id: "123",
            ...categoryData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await categoryService.createCategory(categoryData);

      expect(api.post).toHaveBeenCalledWith(
        "/masters/category",
        categoryData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const categoryData = { name: "New Category" };
      const errorResponse = {
        response: {
          data: { message: "Failed to create category" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(
        categoryService.createCategory(categoryData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("updateCategory", () => {
    it("should update a category", async () => {
      const categoryId = "123";
      const categoryData = { name: "Updated Category" };
      const mockResponse = {
        data: {
          data: {
            _id: categoryId,
            ...categoryData,
          },
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await categoryService.updateCategory(
        categoryId,
        categoryData
      );

      expect(api.patch).toHaveBeenCalledWith(
        `/masters/category/${categoryId}`,
        categoryData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should update category with multiple fields", async () => {
      const categoryId = "123";
      const categoryData = {
        name: "Updated Category",
        description: "Updated description",
        isActive: false,
      };
      const mockResponse = {
        data: {
          data: {
            _id: categoryId,
            ...categoryData,
          },
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await categoryService.updateCategory(
        categoryId,
        categoryData
      );

      expect(api.patch).toHaveBeenCalledWith(
        `/masters/category/${categoryId}`,
        categoryData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const categoryId = "123";
      const categoryData = { name: "Updated Category" };
      const errorResponse = {
        response: {
          data: { message: "Failed to update category" },
        },
      };

      api.patch.mockRejectedValue(errorResponse);

      await expect(
        categoryService.updateCategory(categoryId, categoryData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category", async () => {
      const categoryId = "123";
      const mockResponse = {
        data: {
          data: {
            _id: categoryId,
            deleted: true,
          },
        },
      };

      api.delete.mockResolvedValue(mockResponse);

      const result = await categoryService.deleteCategory(categoryId);

      expect(api.delete).toHaveBeenCalledWith(`/masters/category/${categoryId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const categoryId = "123";
      const errorResponse = {
        response: {
          data: { message: "Failed to delete category" },
        },
      };

      api.delete.mockRejectedValue(errorResponse);

      await expect(
        categoryService.deleteCategory(categoryId)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });
});

