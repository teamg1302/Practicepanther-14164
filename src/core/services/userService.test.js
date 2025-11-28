/**
 * Test suite for user service.
 * @module core/services/userService.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as userService from "./userService";
import api from "./api";

// Mock the API module
vi.mock("./api", () => {
  const mockApi = {
    get: vi.fn(),
    put: vi.fn(),
  };
  return {
    default: mockApi,
  };
});

describe("User Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserDetails", () => {
    it("should fetch user details successfully", async () => {
      const userId = "123";
      const mockResponse = {
        data: {
          id: 123,
          name: "John Doe",
          email: "john.doe@example.com",
          role: "admin",
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await userService.getUserDetails(userId);

      expect(api.get).toHaveBeenCalledWith(`/masters/user/${userId}`);
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch user details with numeric userId", async () => {
      const userId = 456;
      const mockResponse = {
        data: {
          id: 456,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          role: "user",
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await userService.getUserDetails(userId);

      expect(api.get).toHaveBeenCalledWith(`/masters/user/${userId}`);
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API error with response data", async () => {
      const userId = "999";
      const errorResponse = {
        response: {
          data: { message: "User not found" },
        },
      };

      api.get.mockRejectedValue(errorResponse);

      await expect(userService.getUserDetails(userId)).rejects.toEqual(
        errorResponse.response.data
      );
    });

    it("should handle API error without response data", async () => {
      const userId = "999";
      const errorMessage = "Network Error";

      api.get.mockRejectedValue(new Error(errorMessage));

      await expect(userService.getUserDetails(userId)).rejects.toEqual(
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

      await expect(userService.getUserDetails(userId)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("updateUserDetails", () => {
    it("should update user details successfully", async () => {
      const userId = "123";
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        jobTitle: "Software Engineer",
        mobile: "1234567890",
        timezone: "UTC+05:30",
        hourlyRate: 100,
      };

      const mockResponse = {
        data: {
          id: 123,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          jobTitle: "Software Engineer",
          mobile: "1234567890",
          timezone: "UTC+05:30",
          hourlyRate: 100,
        },
      };

      api.put.mockResolvedValue(mockResponse);

      const result = await userService.updateUserDetails(userId, userData);

      expect(api.put).toHaveBeenCalledWith(`/masters/user/${userId}`, userData);
      expect(result).toEqual(mockResponse.data);
    });

    it("should update user details with numeric userId", async () => {
      const userId = 456;
      const userData = {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
      };

      const mockResponse = {
        data: {
          id: 456,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
        },
      };

      api.put.mockResolvedValue(mockResponse);

      const result = await userService.updateUserDetails(userId, userData);

      expect(api.put).toHaveBeenCalledWith(`/masters/user/${userId}`, userData);
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API error with response data", async () => {
      const userId = "999";
      const userData = {
        email: "invalid-email",
      };

      const errorResponse = {
        response: {
          data: { message: "Invalid email format" },
        },
      };

      api.put.mockRejectedValue(errorResponse);

      await expect(
        userService.updateUserDetails(userId, userData)
      ).rejects.toEqual(errorResponse.response.data);
    });

    it("should handle API error without response data", async () => {
      const userId = "999";
      const userData = {
        firstName: "Test",
      };
      const errorMessage = "Network Error";

      api.put.mockRejectedValue(new Error(errorMessage));

      await expect(
        userService.updateUserDetails(userId, userData)
      ).rejects.toEqual(errorMessage);
    });

    it("should handle 401 unauthorized error", async () => {
      const userId = "123";
      const userData = {
        firstName: "John",
      };

      const errorResponse = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
      };

      api.put.mockRejectedValue(errorResponse);

      await expect(
        userService.updateUserDetails(userId, userData)
      ).rejects.toEqual(errorResponse.response.data);
    });

    it("should handle validation errors", async () => {
      const userId = "123";
      const userData = {
        email: "invalid-email-format",
      };

      const errorResponse = {
        response: {
          status: 400,
          data: {
            message: "Validation failed",
            errors: {
              email: "Invalid email format",
            },
          },
        },
      };

      api.put.mockRejectedValue(errorResponse);

      await expect(
        userService.updateUserDetails(userId, userData)
      ).rejects.toEqual(errorResponse.response.data);
    });
  });
});

