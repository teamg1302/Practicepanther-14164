/**
 * Test suite for recyclebin service.
 * @module core/services/recyclebinService.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as recyclebinService from "./recyclebinService";
import api from "./api";

// Mock the API module
vi.mock("./api", () => {
  const mockApi = {
    get: vi.fn(),
  };
  return {
    default: mockApi,
  };
});

describe("Recyclebin Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRecyclebin", () => {
    it("should fetch recycle bin items successfully with default parameters", async () => {
      // Service returns response.data?.data || response.data
      // So we need to structure the mock so that response.data.data contains the full object
      const responseData = {
        data: [
          {
            id: 1,
            name: "Deleted Document",
            type: "document",
            deletedAt: "2024-01-15T10:00:00Z",
          },
          {
            id: 2,
            name: "Deleted Invoice",
            type: "invoice",
            deletedAt: "2024-01-14T10:00:00Z",
          },
        ],
        total: 2,
        page: 1,
        limit: 50,
      };

      const mockResponse = {
        data: {
          data: responseData,
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await recyclebinService.getRecyclebin();

      expect(api.get).toHaveBeenCalledWith(
        "/recycle-bin?limit=50&page=1&search=&sortBy=updatedAt&order=desc"
      );
      expect(result).toEqual(responseData);
    });

    it("should fetch recycle bin items with custom pagination parameters", async () => {
      const params = {
        page: 2,
        limit: 10,
      };
      // Service returns response.data?.data || response.data
      const responseData = {
        data: [
          {
            id: 11,
            name: "Item 11",
            type: "document",
          },
        ],
        total: 25,
        page: 2,
        limit: 10,
      };

      const mockResponse = {
        data: {
          data: responseData,
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await recyclebinService.getRecyclebin(params);

      expect(api.get).toHaveBeenCalledWith(
        "/recycle-bin?limit=10&page=2&search=&sortBy=updatedAt&order=desc"
      );
      expect(result).toEqual(responseData);
    });

    it("should fetch recycle bin items with search parameter", async () => {
      const params = {
        search: "invoice",
        page: 1,
        limit: 20,
      };
      const responseData = {
        data: [
          {
            id: 3,
            name: "Invoice #123",
            type: "invoice",
            deletedAt: "2024-01-13T10:00:00Z",
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      const mockResponse = {
        data: {
          data: responseData,
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await recyclebinService.getRecyclebin(params);

      expect(api.get).toHaveBeenCalledWith(
        "/recycle-bin?limit=20&page=1&search=invoice&sortBy=updatedAt&order=desc"
      );
      expect(result).toEqual(responseData);
    });

    it("should fetch recycle bin items with custom sorting parameters", async () => {
      const params = {
        sortBy: "deletedAt",
        order: "asc",
        page: 1,
        limit: 15,
      };
      const responseData = {
        data: [
          {
            id: 5,
            name: "Oldest Item",
            type: "document",
            deletedAt: "2024-01-01T10:00:00Z",
          },
        ],
        total: 1,
        page: 1,
        limit: 15,
      };

      const mockResponse = {
        data: {
          data: responseData,
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await recyclebinService.getRecyclebin(params);

      expect(api.get).toHaveBeenCalledWith(
        "/recycle-bin?limit=15&page=1&search=&sortBy=deletedAt&order=asc"
      );
      expect(result).toEqual(responseData);
    });

    it("should fetch recycle bin items with all parameters combined", async () => {
      const params = {
        page: 3,
        limit: 25,
        search: "document",
        sortBy: "name",
        order: "asc",
      };
      const responseData = {
        data: [
          {
            id: 51,
            name: "Alpha Document",
            type: "document",
          },
          {
            id: 52,
            name: "Beta Document",
            type: "document",
          },
        ],
        total: 50,
        page: 3,
        limit: 25,
      };

      const mockResponse = {
        data: {
          data: responseData,
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await recyclebinService.getRecyclebin(params);

      expect(api.get).toHaveBeenCalledWith(
        "/recycle-bin?limit=25&page=3&search=document&sortBy=name&order=asc"
      );
      expect(result).toEqual(responseData);
    });

    it("should handle response with nested data structure", async () => {
      const responseData = {
        data: [
          {
            id: 1,
            name: "Test Item",
          },
        ],
      };

      const mockResponse = {
        data: {
          data: responseData,
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await recyclebinService.getRecyclebin();

      expect(result).toEqual(responseData);
    });

    it("should handle response without nested data structure", async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            name: "Test Item",
          },
        ],
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await recyclebinService.getRecyclebin();

      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API error with response data", async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: {
            message: "Recycle bin not found",
            error: "NOT_FOUND",
          },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(recyclebinService.getRecyclebin()).rejects.toEqual(
        errorResponse.response.data
      );
    });

    it("should handle API error without response data", async () => {
      const errorMessage = "Network Error";
      const error = new Error(errorMessage);

      api.get.mockRejectedValue(error);

      await expect(recyclebinService.getRecyclebin()).rejects.toEqual(
        errorMessage
      );
    });

    it("should handle 401 unauthorized error", async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: {
            message: "Unauthorized",
            error: "UNAUTHORIZED",
          },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(recyclebinService.getRecyclebin()).rejects.toEqual(
        errorResponse.response.data
      );
    });

    it("should handle 403 forbidden error", async () => {
      const errorResponse = {
        response: {
          status: 403,
          data: {
            message: "Forbidden: Insufficient permissions",
            error: "FORBIDDEN",
          },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(recyclebinService.getRecyclebin()).rejects.toEqual(
        errorResponse.response.data
      );
    });

    it("should handle 500 server error", async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: {
            message: "Internal server error",
            error: "INTERNAL_SERVER_ERROR",
          },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(recyclebinService.getRecyclebin()).rejects.toEqual(
        errorResponse.response.data
      );
    });

    it("should handle empty search results", async () => {
      const params = {
        search: "nonexistent",
      };
      const responseData = {
        data: [],
        total: 0,
        page: 1,
        limit: 50,
      };

      const mockResponse = {
        data: {
          data: responseData,
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await recyclebinService.getRecyclebin(params);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it("should handle numeric parameters correctly", async () => {
      const params = {
        page: "2", // String number
        limit: "10", // String number
      };
      const responseData = {
        data: [],
        total: 0,
        page: 2,
        limit: 10,
      };

      const mockResponse = {
        data: {
          data: responseData,
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await recyclebinService.getRecyclebin(params);

      expect(api.get).toHaveBeenCalledWith(
        "/recycle-bin?limit=10&page=2&search=&sortBy=updatedAt&order=desc"
      );
      expect(result).toEqual(responseData);
    });

    it("should encode special characters in search parameter", async () => {
      const params = {
        search: "test & document",
      };
      const mockResponse = {
        data: {
          data: [],
        },
      };

      api.get.mockResolvedValue(mockResponse);

      await recyclebinService.getRecyclebin(params);

      // URLSearchParams should handle encoding automatically
      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("search=test+%26+document");
    });
  });
});

