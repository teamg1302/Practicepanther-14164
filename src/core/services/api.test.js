/**
 * Test suite for API service module.
 * @module core/services/api.test
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import api from "./api";

// Mock environment
vi.mock("@/environment", () => ({
  api_base_url: "https://api.example.com",
}));

describe("API Service", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("API Configuration", () => {
    it("should have correct base URL", () => {
      expect(api.defaults.baseURL).toBe("https://api.example.com");
    });

    it("should have correct timeout", () => {
      expect(api.defaults.timeout).toBe(30000);
    });

    it("should have correct default headers", () => {
      expect(api.defaults.headers["Content-Type"]).toBe("application/json");
    });
  });

  describe("Request Interceptor", () => {
    it("should add Authorization header when token exists", async () => {
      const token = "test-token-123";
      localStorage.setItem("authToken", token);

      const config = {
        headers: {},
      };

      // Get the request interceptor
      const requestInterceptor = api.interceptors.request.handlers[0].fulfilled;
      const modifiedConfig = await requestInterceptor(config);

      expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it("should not add Authorization header when token does not exist", async () => {
      localStorage.removeItem("authToken");

      const config = {
        headers: {},
      };

      const requestInterceptor = api.interceptors.request.handlers[0].fulfilled;
      const modifiedConfig = await requestInterceptor(config);

      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    });

    it("should reject promise on request error", async () => {
      const error = new Error("Request error");
      const requestInterceptor = api.interceptors.request.handlers[0].rejected;

      await expect(requestInterceptor(error)).rejects.toThrow("Request error");
    });
  });

  describe("Response Interceptor", () => {
    it("should return response on success", async () => {
      const response = { data: { message: "Success" } };
      const responseInterceptor = api.interceptors.response.handlers[0].fulfilled;

      const result = await responseInterceptor(response);

      expect(result).toEqual(response);
    });

    it("should handle 401 error and redirect to login", async () => {
      const originalLocation = window.location;
      delete window.location;
      window.location = { pathname: "/dashboard", href: "" };

      const error = {
        response: {
          status: 401,
        },
      };

      localStorage.setItem("authToken", "token");
      const responseInterceptor = api.interceptors.response.handlers[0].rejected;

      await expect(responseInterceptor(error)).rejects.toEqual(error);
      expect(localStorage.getItem("authToken")).toBeNull();
      expect(window.location.href).toBe("/signin");

      // Restore window.location
      window.location = originalLocation;
    });

    it("should not redirect if already on signin page", async () => {
      const originalLocation = window.location;
      delete window.location;
      window.location = { pathname: "/signin", href: "" };

      const error = {
        response: {
          status: 401,
        },
      };

      const responseInterceptor = api.interceptors.response.handlers[0].rejected;

      await expect(responseInterceptor(error)).rejects.toEqual(error);
      expect(window.location.href).toBe("");

      // Restore window.location
      window.location = originalLocation;
    });

    it("should handle non-401 errors", async () => {
      const error = {
        response: {
          status: 500,
        },
      };

      const responseInterceptor = api.interceptors.response.handlers[0].rejected;

      await expect(responseInterceptor(error)).rejects.toEqual(error);
    });
  });
});

