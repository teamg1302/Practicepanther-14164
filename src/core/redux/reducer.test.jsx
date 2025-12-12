/**
 * Test suite for Redux root reducer.
 * @module core/redux/reducer.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import rootReducer from "./reducer";
import initialState from "./initial.value";

// Mock services used by reducers to prevent import errors
vi.mock("@/core/services/mastersService", () => ({
  getTimezone: vi.fn(),
  getTitles: vi.fn(),
  getCountries: vi.fn(),
  getCurrencies: vi.fn(),
  getStatesByCountry: vi.fn(),
}));

describe("Root Reducer", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return initial state when action type is unknown", () => {
    const action = { type: "UNKNOWN_ACTION" };
    const state = rootReducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  describe("toggle_header action", () => {
    it("should toggle header state", () => {
      const action = { type: "toggle_header", payload: true };
      const state = rootReducer(initialState, action);

      expect(state.toggle_header).toBe(true);
    });

    it("should set header state to false", () => {
      const action = { type: "toggle_header", payload: false };
      const state = rootReducer(initialState, action);

      expect(state.toggle_header).toBe(false);
    });
  });

  describe("Layoutstyle_data action", () => {
    it("should set layout style data", () => {
      const action = { type: "Layoutstyle_data", payload: "dark" };
      const state = rootReducer(initialState, action);

      expect(state.layoutstyledata).toBe("dark");
    });
  });

  describe("SET_AUTH_USER action", () => {
    it("should set auth user", () => {
      const user = { id: 1, name: "John Doe", email: "john@example.com" };
      const action = { type: "SET_AUTH_USER", payload: user };
      const state = rootReducer(initialState, action);

      expect(state.auth.user).toEqual(user);
      expect(state.auth.token).toBeNull();
    });
  });

  describe("SET_AUTH_TOKEN action", () => {
    it("should set auth token and store in localStorage", () => {
      const token = "test-token-123";
      const action = { type: "SET_AUTH_TOKEN", payload: token };
      const state = rootReducer(initialState, action);

      expect(state.auth.token).toBe(token);
      expect(localStorage.getItem("authToken")).toBe(token);
    });

    it("should remove token from localStorage when payload is null", () => {
      localStorage.setItem("authToken", "existing-token");
      const action = { type: "SET_AUTH_TOKEN", payload: null };
      const state = rootReducer(initialState, action);

      expect(state.auth.token).toBeNull();
      expect(localStorage.getItem("authToken")).toBeNull();
    });
  });

  describe("SET_AUTH_ROLE action", () => {
    it("should set auth role", () => {
      const role = "admin";
      const action = { type: "SET_AUTH_ROLE", payload: role };
      const state = rootReducer(initialState, action);

      expect(state.auth.role).toBe(role);
    });
  });

  describe("SET_AUTH_PERMISSIONS action", () => {
    it("should set auth permissions", () => {
      const permissions = ["read:users", "write:users"];
      const action = { type: "SET_AUTH_PERMISSIONS", payload: permissions };
      const state = rootReducer(initialState, action);

      expect(state.auth.permissions).toEqual(permissions);
    });
  });

  describe("SET_AUTH_DATA action", () => {
    it("should set complete auth data", () => {
      const authData = {
        user: { id: 1, name: "John" },
        token: "token123",
        role: "admin",
        permissions: ["read"],
      };
      const action = { type: "SET_AUTH_DATA", payload: authData };
      const state = rootReducer(initialState, action);

      expect(state.auth.user).toEqual(authData.user);
      expect(state.auth.token).toBe(authData.token);
      expect(state.auth.role).toBe(authData.role);
      expect(state.auth.permissions).toEqual(authData.permissions);
      expect(localStorage.getItem("authToken")).toBe(authData.token);
    });

    it("should handle partial auth data", () => {
      const authData = {
        user: { id: 1, name: "John" },
        token: "token123",
      };
      const action = { type: "SET_AUTH_DATA", payload: authData };
      const state = rootReducer(initialState, action);

      expect(state.auth.user).toEqual(authData.user);
      expect(state.auth.token).toBe(authData.token);
    });

    it("should not store token in localStorage if token is not provided", () => {
      const authData = {
        user: { id: 1, name: "John" },
      };
      const action = { type: "SET_AUTH_DATA", payload: authData };
      rootReducer(initialState, action);

      expect(localStorage.getItem("authToken")).toBeNull();
    });
  });

  describe("SET_LOGIN_EMAIL action", () => {
    it("should set login email", () => {
      const email = "user@example.com";
      const action = { type: "SET_LOGIN_EMAIL", payload: email };
      const state = rootReducer(initialState, action);

      expect(state.auth.loginEmail).toBe(email);
    });
  });

  describe("CLEAR_AUTH action", () => {
    it("should clear all auth data and remove token from localStorage", () => {
      // Set up initial state with auth data
      const stateWithAuth = {
        ...initialState,
        auth: {
          user: { id: 1, name: "John" },
          token: "token123",
          role: "admin",
          permissions: ["read"],
          loginEmail: "user@example.com",
        },
      };
      localStorage.setItem("authToken", "token123");

      const action = { type: "CLEAR_AUTH" };
      const state = rootReducer(stateWithAuth, action);

      expect(state.auth.user).toBeNull();
      expect(state.auth.token).toBeNull();
      expect(state.auth.role).toBeNull();
      expect(state.auth.permissions).toEqual([]);
      expect(state.auth.loginEmail).toBeNull();
      expect(localStorage.getItem("authToken")).toBeNull();
    });
  });

  describe("State immutability", () => {
    it("should not mutate the original state", () => {
      const originalState = { ...initialState };
      const action = { type: "SET_AUTH_USER", payload: { id: 1 } };
      const newState = rootReducer(originalState, action);

      expect(newState).not.toBe(originalState);
      expect(originalState.auth.user).toBeNull();
      expect(newState.auth.user).toEqual({ id: 1 });
    });
  });
});

