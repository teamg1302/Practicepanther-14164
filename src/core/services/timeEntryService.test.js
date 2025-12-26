/**
 * Test suite for time entry service.
 * @module core/services/timeEntryService.test
 *
 * Tests all time entry-related API service functions including:
 * - getTimeEntries
 * - createTimeEntry
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as timeEntryService from "./timeEntryService";
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

describe("Time Entry Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTimeEntries", () => {
    it("should fetch time entries list without params", async () => {
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: "1",
                contact: "contact-123",
                matter: "matter-456",
                date: "2024-12-26",
                description: "Client meeting",
                hours: 2,
                minutes: 30,
                isBillable: true,
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries();

      expect(api.get).toHaveBeenCalledWith("/time-entries");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch time entries with pagination params", async () => {
      const params = { page: 1, limit: 10 };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: "1",
                contact: "contact-123",
                matter: "matter-456",
                date: "2024-12-26",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("page=1");
      expect(callArgs).toContain("limit=10");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch time entries with search and sort params", async () => {
      const params = {
        search: "meeting",
        sortBy: "date",
        order: "desc",
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: "1",
                description: "Client meeting",
                date: "2024-12-26",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries(params);

      expect(api.get).toHaveBeenCalledWith(
        "/time-entries?search=meeting&sortBy=date&order=desc"
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch time entries with date range filters", async () => {
      const params = {
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: "1",
                date: "2024-06-15",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("startDate=2024-01-01");
      expect(callArgs).toContain("endDate=2024-12-31");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch time entries with contact filter", async () => {
      const params = {
        contactId: "contact-123",
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: "1",
                contact: "contact-123",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries(params);

      expect(api.get).toHaveBeenCalledWith(
        "/time-entries?contactId=contact-123"
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch time entries with matter filter", async () => {
      const params = {
        matterId: "matter-456",
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: "1",
                matter: "matter-456",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries(params);

      expect(api.get).toHaveBeenCalledWith(
        "/time-entries?matterId=matter-456"
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch time entries with user filter", async () => {
      const params = {
        userId: "user-789",
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: "1",
                userId: "user-789",
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries(params);

      expect(api.get).toHaveBeenCalledWith("/time-entries?userId=user-789");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch time entries with isBillable filter (true)", async () => {
      const params = {
        isBillable: true,
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: "1",
                isBillable: true,
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries(params);

      expect(api.get).toHaveBeenCalledWith("/time-entries?isBillable=true");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch time entries with isBillable filter (false)", async () => {
      const params = {
        isBillable: false,
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: "1",
                isBillable: false,
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries(params);

      expect(api.get).toHaveBeenCalledWith("/time-entries?isBillable=false");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should fetch time entries with multiple filters", async () => {
      const params = {
        contactId: "contact-123",
        matterId: "matter-456",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        isBillable: true,
        page: 1,
        limit: 20,
        sortBy: "date",
        order: "desc",
      };
      const mockResponse = {
        data: {
          data: {
            list: [
              {
                id: "1",
                contact: "contact-123",
                matter: "matter-456",
                date: "2024-06-15",
                isBillable: true,
              },
            ],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries(params);

      expect(api.get).toHaveBeenCalled();
      const callArgs = api.get.mock.calls[0][0];
      expect(callArgs).toContain("contactId=contact-123");
      expect(callArgs).toContain("matterId=matter-456");
      expect(callArgs).toContain("startDate=2024-01-01");
      expect(callArgs).toContain("endDate=2024-12-31");
      expect(callArgs).toContain("isBillable=true");
      expect(callArgs).toContain("page=1");
      expect(callArgs).toContain("limit=20");
      expect(callArgs).toContain("sortBy=date");
      expect(callArgs).toContain("order=desc");
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle nested response structure", async () => {
      const mockResponse = {
        data: {
          data: {
            list: [{ id: "1", description: "Test" }],
            total: 1,
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries();

      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle flat response structure", async () => {
      const mockResponse = {
        data: {
          list: [{ id: "1", description: "Test" }],
          total: 1,
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await timeEntryService.getTimeEntries();

      expect(result).toEqual(mockResponse.data);
    });

    it("should handle error response with response data", async () => {
      const errorResponse = {
        response: {
          data: { message: "Failed to fetch time entries" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(timeEntryService.getTimeEntries()).rejects.toEqual(
        errorResponse.response.data
      );
    });

    it("should handle error response without response data", async () => {
      const errorMessage = "Network Error";

      api.get.mockRejectedValue(new Error(errorMessage));

      await expect(timeEntryService.getTimeEntries()).rejects.toEqual(
        errorMessage
      );
    });

    it("should handle 401 unauthorized error", async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(timeEntryService.getTimeEntries()).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("createTimeEntry", () => {
    it("should create a new time entry with required fields", async () => {
      const timeEntryData = {
        contact: "contact-123",
        matter: "matter-456",
        date: "2024-12-26",
      };
      const mockResponse = {
        data: {
          data: {
            id: "1",
            ...timeEntryData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await timeEntryService.createTimeEntry(timeEntryData);

      expect(api.post).toHaveBeenCalledWith("/time-entries", timeEntryData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should create a new time entry with all fields", async () => {
      const timeEntryData = {
        contact: "contact-123",
        matter: "matter-456",
        date: "2024-12-26",
        description: "Client meeting and consultation",
        hours: 2,
        minutes: 30,
        totalTime: "02:30:00",
        isBillable: true,
        billedBy: "user-789",
        rate: 150.0,
        item: "item-001",
      };
      const mockResponse = {
        data: {
          data: {
            id: "1",
            ...timeEntryData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await timeEntryService.createTimeEntry(timeEntryData);

      expect(api.post).toHaveBeenCalledWith("/time-entries", timeEntryData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should create a new time entry with totalTime string", async () => {
      const timeEntryData = {
        contact: "contact-123",
        matter: "matter-456",
        date: "2024-12-26",
        description: "Document review",
        totalTime: "01:30:00",
        isBillable: true,
      };
      const mockResponse = {
        data: {
          data: {
            id: "1",
            ...timeEntryData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await timeEntryService.createTimeEntry(timeEntryData);

      expect(api.post).toHaveBeenCalledWith("/time-entries", timeEntryData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should create a new time entry with hours and minutes", async () => {
      const timeEntryData = {
        contact: "contact-123",
        matter: "matter-456",
        date: "2024-12-26",
        description: "Client consultation",
        hours: 1,
        minutes: 45,
        isBillable: false,
      };
      const mockResponse = {
        data: {
          data: {
            id: "1",
            ...timeEntryData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await timeEntryService.createTimeEntry(timeEntryData);

      expect(api.post).toHaveBeenCalledWith("/time-entries", timeEntryData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle nested response structure", async () => {
      const timeEntryData = {
        contact: "contact-123",
        matter: "matter-456",
        date: "2024-12-26",
      };
      const mockResponse = {
        data: {
          data: {
            id: "1",
            ...timeEntryData,
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await timeEntryService.createTimeEntry(timeEntryData);

      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle flat response structure", async () => {
      const timeEntryData = {
        contact: "contact-123",
        matter: "matter-456",
        date: "2024-12-26",
      };
      const mockResponse = {
        data: {
          id: "1",
          ...timeEntryData,
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await timeEntryService.createTimeEntry(timeEntryData);

      expect(result).toEqual(mockResponse.data);
    });

    it("should handle error response with response data", async () => {
      const timeEntryData = {
        contact: "contact-123",
        matter: "matter-456",
        date: "2024-12-26",
      };
      const errorResponse = {
        response: {
          data: { message: "Failed to create time entry" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(
        timeEntryService.createTimeEntry(timeEntryData)
      ).rejects.toEqual(errorResponse.response.data);
    });

    it("should handle error response without response data", async () => {
      const timeEntryData = {
        contact: "contact-123",
        matter: "matter-456",
        date: "2024-12-26",
      };
      const errorMessage = "Network Error";

      api.post.mockRejectedValue(new Error(errorMessage));

      await expect(
        timeEntryService.createTimeEntry(timeEntryData)
      ).rejects.toEqual(errorMessage);
    });

    it("should handle 401 unauthorized error", async () => {
      const timeEntryData = {
        contact: "contact-123",
        matter: "matter-456",
        date: "2024-12-26",
      };
      const errorResponse = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(
        timeEntryService.createTimeEntry(timeEntryData)
      ).rejects.toEqual(errorResponse.response.data);
    });

    it("should handle validation errors", async () => {
      const timeEntryData = {
        contact: "",
        matter: "matter-456",
        date: "2024-12-26",
      };
      const errorResponse = {
        response: {
          status: 400,
          data: {
            message: "Validation failed",
            errors: {
              contact: "Contact is required",
            },
          },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(
        timeEntryService.createTimeEntry(timeEntryData)
      ).rejects.toEqual(errorResponse.response.data);
    });

    it("should handle 404 not found error", async () => {
      const timeEntryData = {
        contact: "contact-123",
        matter: "invalid-matter",
        date: "2024-12-26",
      };
      const errorResponse = {
        response: {
          status: 404,
          data: { message: "Matter not found" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(
        timeEntryService.createTimeEntry(timeEntryData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });
});

