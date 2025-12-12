/**
 * Test suite for matters service.
 * @module core/services/mattersService.test
 * 
 * Tests all matter-related API service functions including:
 * - getMatters
 * - createMatter
 * - getMatterById
 * - updateMatter
 * - deleteMatter
 * - getActivitiesLogByMatterId
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as mattersService from "./mattersService";
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

describe("Matters Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMatters", () => {
    it("should fetch matters list without params", async () => {
      const mockResponse = {
        data: {
          data: {
            list: [{ id: 1, matterName: "Matter 1" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await mattersService.getMatters();

      expect(api.get).toHaveBeenCalledWith("/matters");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch matters with pagination params", async () => {
      const params = { page: 1, limit: 10 };
      const mockResponse = {
        data: {
          data: {
            list: [{ id: 1, matterName: "Matter 1" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await mattersService.getMatters(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("/matters");
      expect(callArgs).toContain("page=1");
      expect(callArgs).toContain("limit=10");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const errorResponse = {
        response: {
          data: { message: "Failed to fetch matters" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(mattersService.getMatters()).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("getMatterById", () => {
    it("should fetch matter by id", async () => {
      const matterId = "123";
      const mockResponse = {
        data: {
          data: {
            id: matterId,
            matterName: "Matter 1",
            description: "Test matter",
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await mattersService.getMatterById(matterId);

      expect(api.get).toHaveBeenCalledWith(`/matters/${matterId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const matterId = "123";
      const errorResponse = {
        response: {
          data: { message: "Matter not found" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(mattersService.getMatterById(matterId)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("getActivitiesLogByMatterId", () => {
    it("should fetch activities log by matter id without query params", async () => {
      const params = { matterId: "123" };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: 1,
                action: "CREATE",
                description: "Matter created",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await mattersService.getActivitiesLogByMatterId(params);

      expect(api.get).toHaveBeenCalledWith("/matters/123/activity-log");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch activities log with pagination", async () => {
      const params = {
        matterId: "123",
        page: 1,
        limit: 10,
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: 1,
                action: "UPDATE",
                description: "Matter updated",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await mattersService.getActivitiesLogByMatterId(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("/matters/123/activity-log");
      expect(callArgs).toContain("page=1");
      expect(callArgs).toContain("limit=10");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch activities log with search and sort", async () => {
      const params = {
        matterId: "123",
        search: "update",
        sortBy: "createdAt",
        order: "desc",
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: 1,
                action: "UPDATE",
                description: "Matter updated",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await mattersService.getActivitiesLogByMatterId(params);

      expect(api.get).toHaveBeenCalledWith(
        "/matters/123/activity-log?search=update&sortBy=createdAt&order=desc"
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should throw error when matterId is missing", async () => {
      const params = {};

      await expect(
        mattersService.getActivitiesLogByMatterId(params)
      ).rejects.toThrow("matterId is required");
    });

    it("should handle error response", async () => {
      const params = { matterId: "123" };
      const errorResponse = {
        response: {
          data: { message: "Failed to fetch activities" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(
        mattersService.getActivitiesLogByMatterId(params)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("createMatter", () => {
    it("should create a new matter", async () => {
      const matterData = {
        matterName: "New Matter",
        description: "Test matter",
      };
      const mockResponse = {
        data: {
          data: {
            id: "123",
            ...matterData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await mattersService.createMatter(matterData);

      expect(api.post).toHaveBeenCalledWith("/matters", matterData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const matterData = { matterName: "New Matter" };
      const errorResponse = {
        response: {
          data: { message: "Failed to create matter" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(mattersService.createMatter(matterData)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("updateMatter", () => {
    it("should update a matter", async () => {
      const matterId = "123";
      const matterData = { matterName: "Updated Matter" };
      const mockResponse = {
        data: {
          data: {
            id: matterId,
            ...matterData,
          },
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await mattersService.updateMatter(matterId, matterData);

      expect(api.patch).toHaveBeenCalledWith(
        `/matters/${matterId}`,
        matterData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const matterId = "123";
      const matterData = { matterName: "Updated Matter" };
      const errorResponse = {
        response: {
          data: { message: "Failed to update matter" },
        },
      };

      api.patch.mockRejectedValue(errorResponse);

      await expect(
        mattersService.updateMatter(matterId, matterData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });

  describe("deleteMatter", () => {
    it("should delete a matter", async () => {
      const matterId = "123";
      const mockResponse = {
        data: {
          data: {
            id: matterId,
            deleted: true,
          },
        },
      };

      api.delete.mockResolvedValue(mockResponse);

      const result = await mattersService.deleteMatter(matterId);

      expect(api.delete).toHaveBeenCalledWith(`/matters/${matterId}`);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle error response", async () => {
      const matterId = "123";
      const errorResponse = {
        response: {
          data: { message: "Failed to delete matter" },
        },
      };

      api.delete.mockRejectedValue(errorResponse);

      await expect(mattersService.deleteMatter(matterId)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });
});

