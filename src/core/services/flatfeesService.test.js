/**
 * Test suite for flat fees service.
 * @module core/services/flatfeesService.test
 *
 * Tests all flat fee-related API service functions including:
 * - getFlatfees
 * - createFlatfee
 * - getFlatfeeById
 * - updateFlatfee
 * - deleteFlatfee
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as flatfeesService from "./flatfeesService";
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

describe("Flat Fees Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFlatfees", () => {
    it("should fetch flat fees list without params", async () => {
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                _id: "1",
                name: "Legal Consultation Fee",
                amount: 500.0,
                date: "2025-01-15",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await flatfeesService.getFlatfees();

      expect(api.get).toHaveBeenCalledWith("/flat-fees");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch flat fees with pagination params", async () => {
      const params = { page: 1, limit: 10 };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Flat Fee 1" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await flatfeesService.getFlatfees(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("/flat-fees");
      expect(callArgs).toContain("page=1");
      expect(callArgs).toContain("limit=10");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch flat fees with search and sort params", async () => {
      const params = {
        search: "consultation",
        sortBy: "date",
        order: "desc",
      };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Consultation Fee" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await flatfeesService.getFlatfees(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("/flat-fees");
      expect(callArgs).toContain("search=consultation");
      expect(callArgs).toContain("sortBy=date");
      expect(callArgs).toContain("order=desc");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch flat fees with matterId and date filters", async () => {
      const params = {
        matterId: "matter-123",
        startDate: "2025-01-01",
        endDate: "2025-01-31",
      };
      const mockResponse = {
        data: {
          data: {
            list: [{ _id: "1", name: "Matter Flat Fee" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await flatfeesService.getFlatfees(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("matterId=matter-123");
      expect(callArgs).toContain("startDate=2025-01-01");
      expect(callArgs).toContain("endDate=2025-01-31");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const errorResponse = {
        response: {
          data: { message: "Failed to fetch flat fees" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(flatfeesService.getFlatfees()).rejects.toEqual(
        errorResponse.response.data
      );
    });

    it("should handle error without response object", async () => {
      const error = new Error("Network error");

      api.get.mockRejectedValue(error);

      await expect(flatfeesService.getFlatfees()).rejects.toEqual(
        error.message
      );
    });
  });

  describe("getFlatfeeById", () => {
    it("should fetch flat fee by id", async () => {
      const flatfeeId = "123";
      const mockResponse = {
        data: {
          data: {
            _id: flatfeeId,
            name: "Legal Consultation Fee",
            amount: 500.0,
            date: "2025-01-15",
            matterId: "matter-123",
            isActive: true,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await flatfeesService.getFlatfeeById(flatfeeId);

      expect(api.get).toHaveBeenCalledWith(`/flat-fees/${flatfeeId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const flatfeeId = "123";
      const errorResponse = {
        response: {
          data: { message: "Flat fee not found" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(
        flatfeesService.getFlatfeeById(flatfeeId)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("createFlatfee", () => {
    it("should create a new flat fee", async () => {
      const flatfeeData = {
        name: "Legal Consultation Fee",
        amount: 500.0,
        matterId: "matter-123",
        date: "2025-01-15",
      };
      const mockResponse = {
        data: {
          data: {
            _id: "123",
            ...flatfeeData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await flatfeesService.createFlatfee(flatfeeData);

      expect(api.post).toHaveBeenCalledWith("/flat-fees", flatfeeData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should create flat fee with minimal data", async () => {
      const flatfeeData = {
        name: "Minimal Flat Fee",
        amount: 300.0,
      };
      const mockResponse = {
        data: {
          data: {
            _id: "123",
            ...flatfeeData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await flatfeesService.createFlatfee(flatfeeData);

      expect(api.post).toHaveBeenCalledWith("/flat-fees", flatfeeData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const flatfeeData = { name: "New Flat Fee", amount: 300.0 };
      const errorResponse = {
        response: {
          data: { message: "Failed to create flat fee" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(
        flatfeesService.createFlatfee(flatfeeData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("updateFlatfee", () => {
    it("should update a flat fee", async () => {
      const flatfeeId = "123";
      const flatfeeData = { name: "Updated Flat Fee" };
      const mockResponse = {
        data: {
          data: {
            _id: flatfeeId,
            ...flatfeeData,
          },
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await flatfeesService.updateFlatfee(
        flatfeeId,
        flatfeeData
      );

      expect(api.patch).toHaveBeenCalledWith(
        `/flat-fees/${flatfeeId}`,
        flatfeeData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should update flat fee with multiple fields", async () => {
      const flatfeeId = "123";
      const flatfeeData = {
        name: "Updated Flat Fee",
        amount: 600.0,
        matterId: "matter-456",
        billingStatus: "billed",
        isActive: false,
      };
      const mockResponse = {
        data: {
          data: {
            _id: flatfeeId,
            ...flatfeeData,
          },
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await flatfeesService.updateFlatfee(
        flatfeeId,
        flatfeeData
      );

      expect(api.patch).toHaveBeenCalledWith(
        `/flat-fees/${flatfeeId}`,
        flatfeeData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const flatfeeId = "123";
      const flatfeeData = { name: "Updated Flat Fee" };
      const errorResponse = {
        response: {
          data: { message: "Failed to update flat fee" },
        },
      };

      api.patch.mockRejectedValue(errorResponse);

      await expect(
        flatfeesService.updateFlatfee(flatfeeId, flatfeeData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("deleteFlatfee", () => {
    it("should delete a flat fee", async () => {
      const flatfeeId = "123";
      const mockResponse = {
        data: {
          data: {
            _id: flatfeeId,
            deleted: true,
          },
        },
      };

      api.delete.mockResolvedValue(mockResponse);

      const result = await flatfeesService.deleteFlatfee(flatfeeId);

      expect(api.delete).toHaveBeenCalledWith(`/flat-fees/${flatfeeId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const flatfeeId = "123";
      const errorResponse = {
        response: {
          data: { message: "Failed to delete flat fee" },
        },
      };

      api.delete.mockRejectedValue(errorResponse);

      await expect(flatfeesService.deleteFlatfee(flatfeeId)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });
});

