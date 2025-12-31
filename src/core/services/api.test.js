/**
 * Test suite for API service module.
 * @module core/services/api.test
 *
 * Tests cover:
 * - Axios instance configuration
 * - Request interceptor (authentication token, FormData handling)
 * - Response interceptor (success handling, 401 error handling, other errors)
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import axios from "axios";

// Mock dependencies before importing api
vi.mock("@/environment", () => ({
  api_base_url: "https://api.example.com",
}));

vi.mock("@/Router/all_routes", () => ({
  all_routes: {
    signin: "/signin",
  },
}));

const mockDispatch = vi.fn();
vi.mock("@/core/redux/store", () => ({
  default: {
    dispatch: mockDispatch,
  },
}));

const mockClearAuth = vi.fn();
vi.mock("@/core/redux/action", () => ({
  clearAuth: mockClearAuth,
}));

// Import api after mocks are set up
// We need to dynamically import to ensure mocks are applied
let api;

describe("API Service", () => {
  // Store original window.location
  const originalLocation = window.location;
  let mockLocation;

  beforeEach(async () => {
    // Clear all mocks
    vi.clearAllMocks();
    localStorage.clear();

    // Mock window.location
    delete window.location;
    mockLocation = {
      pathname: "/dashboard",
      href: "",
    };
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
      configurable: true,
    });

    // Mock console.log to avoid noise in test output (will be restored in afterEach)
    if (console.log.mockRestore) {
      console.log.mockRestore();
    }
    vi.spyOn(console, "log").mockImplementation(() => {});

    // Dynamically import api to ensure mocks are applied
    const apiModule = await import("./api.js");
    api = apiModule.default;
  });

  afterEach(() => {
    // Restore original location
    window.location = originalLocation;
    vi.restoreAllMocks();
  });

  describe("Axios Instance Configuration", () => {
    it("should have correct baseURL from environment", () => {
      expect(api.defaults.baseURL).toBe("https://api.example.com");
    });

    it("should have correct timeout configuration", () => {
      expect(api.defaults.timeout).toBe(30000);
    });

    it("should have correct default headers", () => {
      expect(api.defaults.headers["Content-Type"]).toBe("application/json");
    });
  });

  describe("Request Interceptor", () => {
    it("should add Authorization header when token exists in localStorage", async () => {
      localStorage.setItem("authToken", "test-token-123");

      const config = {
        headers: {},
        url: "/test",
        method: "get",
      };

      // Test the interceptor directly
      const requestInterceptor = api.interceptors.request.handlers[0];
      const processedConfig = await requestInterceptor.fulfilled(config);

      expect(processedConfig.headers.Authorization).toBe(
        "Bearer test-token-123"
      );
    });

    it("should not add Authorization header when token does not exist", async () => {
      localStorage.removeItem("authToken");

      const config = {
        headers: {},
        url: "/test",
        method: "get",
      };

      // Test the interceptor directly
      const requestInterceptor = api.interceptors.request.handlers[0];
      const processedConfig = await requestInterceptor.fulfilled(config);

      // Verify Authorization header was not added
      expect(processedConfig.headers.Authorization).toBeUndefined();
    });

    it("should remove Content-Type header when data is FormData", async () => {
      const formData = new FormData();
      formData.append("file", new Blob(["test"], { type: "text/plain" }));

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        data: formData,
        url: "/upload",
        method: "post",
      };

      // Test the interceptor logic directly
      const requestInterceptor = api.interceptors.request.handlers[0];
      const processedConfig = await requestInterceptor.fulfilled(config);

      expect(processedConfig.headers["Content-Type"]).toBeUndefined();
    });

    it("should keep Content-Type header when data is not FormData", async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        data: { key: "value" },
        url: "/test",
        method: "post",
      };

      const requestInterceptor = api.interceptors.request.handlers[0];
      const processedConfig = await requestInterceptor.fulfilled(config);

      expect(processedConfig.headers["Content-Type"]).toBe("application/json");
    });

    it("should handle request interceptor error", async () => {
      const error = new Error("Request error");
      const requestInterceptor = api.interceptors.request.handlers[0];

      await expect(requestInterceptor.rejected(error)).rejects.toBe(error);
    });
  });

  describe("Response Interceptor", () => {
    it("should return response unchanged on success", async () => {
      const response = {
        data: { message: "Success" },
        status: 200,
        statusText: "OK",
      };

      const responseInterceptor = api.interceptors.response.handlers[0];
      const result = await responseInterceptor.fulfilled(response);

      expect(result).toBe(response);
    });

    it("should handle 401 error by clearing auth and redirecting", async () => {
      mockLocation.pathname = "/dashboard";
      localStorage.setItem("authToken", "test-token");

      const error = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
        config: {
          url: "/protected",
        },
      };

      const responseInterceptor = api.interceptors.response.handlers[0];

      // Mock clearAuth to return an action
      mockClearAuth.mockReturnValue({ type: "CLEAR_AUTH" });

      await expect(responseInterceptor.rejected(error)).rejects.toBe(error);

      // Verify clearAuth was called
      expect(mockClearAuth).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith({ type: "CLEAR_AUTH" });

      // Verify redirect
      expect(mockLocation.href).toBe("/signin");
    });

    it("should not redirect on 401 if already on signin page", async () => {
      mockLocation.pathname = "/signin";
      mockLocation.href = "";

      const error = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
      };

      const responseInterceptor = api.interceptors.response.handlers[0];
      mockClearAuth.mockReturnValue({ type: "CLEAR_AUTH" });

      await expect(responseInterceptor.rejected(error)).rejects.toBe(error);

      // Verify clearAuth was still called
      expect(mockClearAuth).toHaveBeenCalled();

      // Verify no redirect (href should remain empty)
      expect(mockLocation.href).toBe("");
    });

    it("should handle non-401 errors without clearing auth", async () => {
      mockLocation.pathname = "/dashboard";

      const error = {
        response: {
          status: 500,
          data: { message: "Internal Server Error" },
        },
      };

      const responseInterceptor = api.interceptors.response.handlers[0];

      await expect(responseInterceptor.rejected(error)).rejects.toBe(error);

      // Verify clearAuth was NOT called
      expect(mockClearAuth).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();

      // Verify no redirect
      expect(mockLocation.href).toBe("");
    });

    it("should handle errors without response object", async () => {
      const error = {
        message: "Network Error",
        // No response property
      };

      const responseInterceptor = api.interceptors.response.handlers[0];

      await expect(responseInterceptor.rejected(error)).rejects.toBe(error);

      // Verify clearAuth was NOT called
      expect(mockClearAuth).not.toHaveBeenCalled();
    });

    it("should handle errors and reject promise", async () => {
      const error = {
        response: {
          status: 500,
          data: { message: "Error" },
        },
      };

      const responseInterceptor = api.interceptors.response.handlers[0];

      // Verify the interceptor rejects with the error
      await expect(responseInterceptor.rejected(error)).rejects.toBe(error);
    });
  });

  describe("Integration Tests", () => {
    it("should apply request interceptor and add token to headers", async () => {
      localStorage.setItem("authToken", "integration-test-token");

      // Test that the interceptor properly adds the token
      const config = {
        headers: {},
        url: "/test-endpoint",
        method: "get",
      };

      const requestInterceptor = api.interceptors.request.handlers[0];
      const processedConfig = await requestInterceptor.fulfilled(config);

      // Verify Authorization header was added by the interceptor
      expect(processedConfig.headers.Authorization).toBe(
        "Bearer integration-test-token"
      );
      expect(processedConfig.url).toBe("/test-endpoint");
    });
  });
});
