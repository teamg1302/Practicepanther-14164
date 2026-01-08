/**
 * API service module for making HTTP requests.
 * @module core/services/api
 *
 * This module provides a configured axios instance with:
 * - Base URL configuration
 * - Request interceptors for authentication
 * - Response interceptors for error handling
 */

import axios from "axios";

import { api_base_url } from "@/environment";
import { all_routes } from "@/Router/all_routes";
import store from "@/core/redux/store";
import { clearAuth } from "@/core/redux/action";

/**
 * API base URL from environment configuration.
 * @type {string}
 */
const API_BASE_URL = api_base_url;

/**
 * Configured axios instance for API requests.
 * @type {import('axios').AxiosInstance}
 *
 * Configuration:
 * - baseURL: API base URL from environment
 * - timeout: 30 seconds
 * - headers: JSON content type
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to add authentication token to requests.
 * Automatically adds Bearer token from localStorage to Authorization header.
 *
 * @param {import('axios').InternalAxiosRequestConfig} config - Axios request configuration
 * @returns {import('axios').InternalAxiosRequestConfig} Modified request configuration
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (synced by redux-persist)
    const token = localStorage.getItem("authToken");
    config.headers["device-platform"] = "company";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If FormData is being sent, let the browser set Content-Type with boundary
    // Don't override Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle API errors.
 * Automatically handles 401 Unauthorized responses by clearing all auth state
 * from Redux store and redirecting to login page.
 *
 * @param {import('axios').AxiosResponse} response - Successful API response
 * @returns {import('axios').AxiosResponse} Response object
 * @param {import('axios').AxiosError} error - API error object
 * @returns {Promise<never>} Rejected promise with error
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("error", error);

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear all auth state from Redux store
      store.dispatch(clearAuth());

      // Redirect to login if not already there
      if (window.location.pathname !== all_routes.signin) {
        window.location.href = all_routes.signin;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
