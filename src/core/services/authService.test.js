/**
 * Test suite for authentication service.
 * @module core/services/authService.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as authService from "./authService";
import api from "./api";

// Mock the API module
vi.mock("./api", () => {
  const mockApi = {
    post: vi.fn(),
  };
  return {
    default: mockApi,
  };
});

describe("Auth Service", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should login successfully and store token", async () => {
      const credentials = {
        email: "user@example.com",
        password: "password123",
        rememberMe: true,
      };

      const mockResponse = {
        data: {
          token: "test-token-123",
          user: { id: 1, name: "John Doe" },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.login(credentials);

      expect(api.post).toHaveBeenCalledWith("/masters/user/login", credentials);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem("authToken")).toBe("test-token-123");
    });

    it("should handle login without token in response", async () => {
      const credentials = {
        email: "user@example.com",
        password: "password123",
      };

      const mockResponse = {
        data: {
          user: { id: 1, name: "John Doe" },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.login(credentials);

      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem("authToken")).toBeNull();
    });

    it("should handle login error", async () => {
      const credentials = {
        email: "user@example.com",
        password: "wrong-password",
      };

      const errorResponse = {
        response: {
          data: { message: "Invalid credentials" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(authService.login(credentials)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("verifyToken", () => {
    it("should verify login OTP token", async () => {
      const tokenData = {
        token: "123456",
        type: "login",
      };

      const mockResponse = {
        data: {
          data: {
            token: "verified-token-123",
            user: { id: 1, name: "John Doe" },
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.verifyToken(tokenData);

      expect(api.post).toHaveBeenCalledWith(
        "/masters/user/verify-login-otp",
        tokenData
      );
      expect(result).toEqual(mockResponse.data.data);
      expect(localStorage.getItem("authToken")).toBe("verified-token-123");
    });

    it("should verify forgot password OTP token", async () => {
      const tokenData = {
        token: "123456",
        type: "forgot-password",
      };

      const mockResponse = {
        data: {
          data: {
            token: "reset-token-123",
            user: { id: 1, name: "John Doe" },
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.verifyToken(tokenData);

      expect(api.post).toHaveBeenCalledWith(
        "/masters/user/verify-forgot-password-otp",
        tokenData
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should handle response without nested data structure", async () => {
      const tokenData = {
        token: "123456",
        type: "login",
      };

      const mockResponse = {
        data: {
          token: "direct-token-123",
          user: { id: 1, name: "John Doe" },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.verifyToken(tokenData);

      expect(result).toEqual(mockResponse.data);
    });

    it("should handle verification error", async () => {
      const tokenData = {
        token: "invalid-token",
        type: "login",
      };

      const errorResponse = {
        response: {
          data: { message: "Invalid token" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(authService.verifyToken(tokenData)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("logout", () => {
    it("should remove token from localStorage", () => {
      localStorage.setItem("authToken", "test-token");

      authService.logout();

      expect(localStorage.getItem("authToken")).toBeNull();
    });
  });

  describe("forgotPassword", () => {
    it("should send forgot password request", async () => {
      const data = {
        email: "user@example.com",
      };

      const mockResponse = {
        data: {
          message: "Password reset email sent",
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.forgotPassword(data);

      expect(api.post).toHaveBeenCalledWith(
        "/masters/user/forgot-password",
        data
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle forgot password error", async () => {
      const data = {
        email: "nonexistent@example.com",
      };

      const errorResponse = {
        response: {
          data: { message: "User not found" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(authService.forgotPassword(data)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("resetPassword", () => {
    it("should reset password successfully", async () => {
      const data = {
        token: "reset-token-123",
        newPassword: "newPassword123",
      };

      const mockResponse = {
        data: {
          message: "Password reset successfully",
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.resetPassword(data);

      expect(api.post).toHaveBeenCalledWith(
        "/masters/user/reset-password",
        data
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle reset password error", async () => {
      const data = {
        token: "invalid-token",
        newPassword: "newPassword123",
      };

      const errorResponse = {
        response: {
          data: { message: "Invalid or expired token" },
        },
      };

      api.post.mockRejectedValue(errorResponse);

      await expect(authService.resetPassword(data)).rejects.toEqual(
        errorResponse.response.data
      );
    });
  });

  describe("getAuthToken", () => {
    it("should return stored auth token", () => {
      const token = "test-token-123";
      localStorage.setItem("authToken", token);

      const result = authService.getAuthToken();

      expect(result).toBe(token);
    });

    it("should return null when no token exists", () => {
      localStorage.removeItem("authToken");

      const result = authService.getAuthToken();

      expect(result).toBeNull();
    });
  });
});

