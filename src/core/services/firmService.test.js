/**
 * Test suite for firm service.
 * @module core/services/firmService.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as firmService from "./firmService";
import api from "./api";

// Mock the API module
vi.mock("./api", () => {
  const mockApi = {
    get: vi.fn(),
    patch: vi.fn(),
  };
  return {
    default: mockApi,
  };
});

describe("Firm Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFirmDetails", () => {
    it("should fetch firm details successfully", async () => {
      const userId = "123";
      const mockResponse = {
        data: {
          id: 123,
          legalBusinessName: "ABC Law Firm",
          firmEmailAddress: "info@abclaw.com",
          country: "US",
          primaryPracticeArea: "corporate",
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await firmService.getFirmDetails(userId);

      expect(api.get).toHaveBeenCalledWith(`/masters/firm/${userId}`);
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch firm details with numeric userId", async () => {
      const userId = 456;
      const mockResponse = {
        data: {
          id: 456,
          legalBusinessName: "XYZ Legal Services",
          firmEmailAddress: "contact@xyzlegal.com",
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await firmService.getFirmDetails(userId);

      expect(api.get).toHaveBeenCalledWith(`/masters/firm/${userId}`);
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API error with response data", async () => {
      const userId = "999";
      const errorResponse = {
        response: {
          data: { message: "Firm not found" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(firmService.getFirmDetails(userId)).rejects.toEqual(
        errorResponse.response.data
      );
    });

    it("should handle API error without response data", async () => {
      const userId = "999";
      const errorMessage = "Network Error";

      api.get.mockRejectedValue(new Error(errorMessage));

      await expect(firmService.getFirmDetails(userId)).rejects.toEqual(
        errorMessage
      );
    });

    it("should handle 401 unauthorized error", async () => {
      const userId = "123";
      const errorResponse = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(firmService.getFirmDetails(userId)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("updateFirmDetails", () => {
    it("should update firm details successfully", async () => {
      const userId = "123";
      const firmData = {
        legalBusinessName: "ABC Law Firm",
        firmEmailAddress: "info@abclaw.com",
        country: "US",
        primaryPracticeArea: "corporate",
        ownerFirstName: "John",
        ownerLastName: "Doe",
      };

      const mockResponse = {
        data: {
          id: 123,
          legalBusinessName: "ABC Law Firm",
          firmEmailAddress: "info@abclaw.com",
          country: "US",
          primaryPracticeArea: "corporate",
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await firmService.updateFirmDetails(userId, firmData);

      expect(api.patch).toHaveBeenCalledWith(`/masters/firm/${userId}`, firmData);
      expect(result).toEqual(mockResponse.data);
    });

    it("should update firm details with FormData (file upload)", async () => {
      const userId = "123";
      const formData = new FormData();
      formData.append("legalBusinessName", "ABC Law Firm");
      formData.append("firmEmailAddress", "info@abclaw.com");
      const file = new File(["test"], "logo.png", { type: "image/png" });
      formData.append("firmLogo", file);

      const mockResponse = {
        data: {
          id: 123,
          legalBusinessName: "ABC Law Firm",
          firmEmailAddress: "info@abclaw.com",
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await firmService.updateFirmDetails(userId, formData);

      expect(api.patch).toHaveBeenCalledWith(`/masters/firm/${userId}`, formData);
      expect(result).toEqual(mockResponse.data);
    });

    it("should update firm details with numeric userId", async () => {
      const userId = 456;
      const firmData = {
        legalBusinessName: "XYZ Legal Services",
        firmEmailAddress: "contact@xyzlegal.com",
      };

      const mockResponse = {
        data: {
          id: 456,
          legalBusinessName: "XYZ Legal Services",
          firmEmailAddress: "contact@xyzlegal.com",
        },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await firmService.updateFirmDetails(userId, firmData);

      expect(api.patch).toHaveBeenCalledWith(`/masters/firm/${userId}`, firmData);
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API error with response data", async () => {
      const userId = "999";
      const firmData = {
        firmEmailAddress: "invalid-email",
      };

      const errorResponse = {
        response: {
          data: { message: "Invalid email format" },
        },
      };

      api.patch.mockRejectedValue(errorResponse);

      await expect(
        firmService.updateFirmDetails(userId, firmData)
      ).rejects.toEqual(errorResponse.response.data);
    });

    it("should handle API error without response data", async () => {
      const userId = "999";
      const firmData = {
        legalBusinessName: "Test Firm",
      };
      const errorMessage = "Network Error";

      api.patch.mockRejectedValue(new Error(errorMessage));

      await expect(
        firmService.updateFirmDetails(userId, firmData)
      ).rejects.toEqual(errorMessage);
    });

    it("should handle 401 unauthorized error", async () => {
      const userId = "123";
      const firmData = {
        legalBusinessName: "Test Firm",
      };

      const errorResponse = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
      };

      api.patch.mockRejectedValue(errorResponse);

      await expect(
        firmService.updateFirmDetails(userId, firmData)
      ).rejects.toEqual(errorResponse.response.data);
    });

    it("should handle validation errors", async () => {
      const userId = "123";
      const firmData = {
        firmEmailAddress: "invalid-email-format",
      };

      const errorResponse = {
        response: {
          status: 400,
          data: {
            message: "Validation failed",
            errors: {
              firmEmailAddress: "Invalid email format",
            },
          },
        },
      };

      api.patch.mockRejectedValue(errorResponse);

      await expect(
        firmService.updateFirmDetails(userId, firmData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });
});

