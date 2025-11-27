/**
 * Test suite for Redux action creators.
 * @module core/redux/action.test
 */

import { describe, it, expect } from "vitest";
import {
  setLayoutChange,
  setToogleHeader,
  setAuthUser,
  setAuthToken,
  setAuthRole,
  setAuthPermissions,
  setAuthData,
  setLoginEmail,
  clearAuth,
} from "./action";

describe("Redux Action Creators", () => {
  describe("setLayoutChange", () => {
    it("should create an action to set layout style", () => {
      const payload = "dark";
      const action = setLayoutChange(payload);

      expect(action).toEqual({
        type: "Layoutstyle_data",
        payload: "dark",
      });
    });

    it("should handle different layout style values", () => {
      const payload = "light";
      const action = setLayoutChange(payload);

      expect(action.type).toBe("Layoutstyle_data");
      expect(action.payload).toBe("light");
    });
  });

  describe("setToogleHeader", () => {
    it("should create an action to toggle header", () => {
      const payload = true;
      const action = setToogleHeader(payload);

      expect(action).toEqual({
        type: "toggle_header",
        payload: true,
      });
    });

    it("should handle false toggle value", () => {
      const payload = false;
      const action = setToogleHeader(payload);

      expect(action.type).toBe("toggle_header");
      expect(action.payload).toBe(false);
    });
  });

  describe("setAuthUser", () => {
    it("should create an action to set auth user", () => {
      const user = { id: 1, name: "John Doe", email: "john@example.com" };
      const action = setAuthUser(user);

      expect(action).toEqual({
        type: "SET_AUTH_USER",
        payload: user,
      });
    });

    it("should handle null user", () => {
      const action = setAuthUser(null);

      expect(action.type).toBe("SET_AUTH_USER");
      expect(action.payload).toBeNull();
    });
  });

  describe("setAuthToken", () => {
    it("should create an action to set auth token", () => {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
      const action = setAuthToken(token);

      expect(action).toEqual({
        type: "SET_AUTH_TOKEN",
        payload: token,
      });
    });

    it("should handle null token", () => {
      const action = setAuthToken(null);

      expect(action.type).toBe("SET_AUTH_TOKEN");
      expect(action.payload).toBeNull();
    });
  });

  describe("setAuthRole", () => {
    it("should create an action to set auth role", () => {
      const role = "admin";
      const action = setAuthRole(role);

      expect(action).toEqual({
        type: "SET_AUTH_ROLE",
        payload: role,
      });
    });

    it("should handle different role values", () => {
      const roles = ["admin", "user", "super_admin"];
      roles.forEach((role) => {
        const action = setAuthRole(role);
        expect(action.type).toBe("SET_AUTH_ROLE");
        expect(action.payload).toBe(role);
      });
    });
  });

  describe("setAuthPermissions", () => {
    it("should create an action to set auth permissions", () => {
      const permissions = ["read:users", "write:users", "delete:users"];
      const action = setAuthPermissions(permissions);

      expect(action).toEqual({
        type: "SET_AUTH_PERMISSIONS",
        payload: permissions,
      });
    });

    it("should handle empty permissions array", () => {
      const action = setAuthPermissions([]);

      expect(action.type).toBe("SET_AUTH_PERMISSIONS");
      expect(action.payload).toEqual([]);
    });
  });

  describe("setAuthData", () => {
    it("should create an action to set complete auth data", () => {
      const authData = {
        user: { id: 1, name: "John" },
        token: "token123",
        role: "admin",
        permissions: ["read", "write"],
      };
      const action = setAuthData(authData);

      expect(action).toEqual({
        type: "SET_AUTH_DATA",
        payload: authData,
      });
    });

    it("should handle partial auth data", () => {
      const authData = {
        user: { id: 1, name: "John" },
        token: "token123",
      };
      const action = setAuthData(authData);

      expect(action.type).toBe("SET_AUTH_DATA");
      expect(action.payload).toEqual(authData);
    });
  });

  describe("setLoginEmail", () => {
    it("should create an action to set login email", () => {
      const email = "user@example.com";
      const action = setLoginEmail(email);

      expect(action).toEqual({
        type: "SET_LOGIN_EMAIL",
        payload: email,
      });
    });

    it("should handle null email", () => {
      const action = setLoginEmail(null);

      expect(action.type).toBe("SET_LOGIN_EMAIL");
      expect(action.payload).toBeNull();
    });
  });

  describe("clearAuth", () => {
    it("should create an action to clear auth", () => {
      const action = clearAuth();

      expect(action).toEqual({
        type: "CLEAR_AUTH",
      });
    });

    it("should not have a payload", () => {
      const action = clearAuth();

      expect(action.type).toBe("CLEAR_AUTH");
      expect(action.payload).toBeUndefined();
    });
  });
});

