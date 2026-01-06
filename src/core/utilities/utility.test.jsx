/**
 * Test suite for utility functions.
 * @module core/utilities/utility.test
 *
 * Tests cover:
 * - isOwner: Pure function to check if user is firm owner
 * - useIsOwner: Custom hook to check if current user is firm owner
 * - getHours: Generate hour options for time selection (00-23)
 * - getMinutes: Generate minute options for time selection (00, 05, 10, ..., 55)
 */

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { isOwner, useIsOwner, getHours, getMinutes } from "./utility";

/**
 * Creates a mock Redux store for testing hooks that depend on Redux state.
 *
 * @param {Object} initialState - Initial state for the Redux store
 * @param {Object} initialState.auth - Authentication state
 * @param {Object|null} initialState.auth.user - User object
 * @returns {Object} Configured Redux store
 */
const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: (state = initialState.auth || { user: null }) => state,
    },
    preloadedState: initialState,
  });
};

describe("Utility Functions", () => {
  beforeEach(() => {
    // Clear any mocks or state before each test
    vi.clearAllMocks();
  });

  describe("isOwner", () => {
    /**
     * @test {isOwner} should return true when user ID matches firm owner ID
     */
    it("should return true when user is the firm owner", () => {
      const user = {
        id: "user123",
        firmId: {
          ownerId: "user123",
        },
      };

      expect(isOwner(user)).toBe(true);
    });

    /**
     * @test {isOwner} should return false when user ID does not match firm owner ID
     */
    it("should return false when user is not the firm owner", () => {
      const user = {
        id: "user123",
        firmId: {
          ownerId: "owner456",
        },
      };

      expect(isOwner(user)).toBe(false);
    });

    /**
     * @test {isOwner} should handle null user gracefully
     */
    it("should return false when user is null", () => {
      expect(isOwner(null)).toBe(false);
    });

    /**
     * @test {isOwner} should handle undefined user gracefully
     */
    it("should return false when user is undefined", () => {
      expect(isOwner(undefined)).toBe(false);
    });

    /**
     * @test {isOwner} should return false when user object lacks firmId property
     */
    it("should return false when user has no firmId", () => {
      const user = {
        id: "user123",
      };

      expect(isOwner(user)).toBe(false);
    });

    /**
     * @test {isOwner} should return false when user object lacks id property
     */
    it("should return false when user has no id", () => {
      const user = {
        firmId: {
          ownerId: "owner456",
        },
      };

      expect(isOwner(user)).toBe(false);
    });

    /**
     * @test {isOwner} should return false when firmId object lacks ownerId property
     */
    it("should return false when firmId has no ownerId", () => {
      const user = {
        id: "user123",
        firmId: {},
      };

      expect(isOwner(user)).toBe(false);
    });

    /**
     * @test {isOwner} should correctly compare numeric IDs
     */
    it("should handle numeric IDs correctly", () => {
      const user = {
        id: 123,
        firmId: {
          ownerId: 123,
        },
      };

      expect(isOwner(user)).toBe(true);
    });

    /**
     * @test {isOwner} should return false when user ID and owner ID are different types (string vs number)
     */
    it("should return false when IDs are different types", () => {
      const user = {
        id: "123",
        firmId: {
          ownerId: 123,
        },
      };

      expect(isOwner(user)).toBe(false);
    });
  });

  describe("useIsOwner", () => {
    /**
     * @test {useIsOwner} should return true when current authenticated user is the firm owner
     */
    it("should return true when current user is the firm owner", () => {
      const store = createMockStore({
        auth: {
          user: {
            id: "user123",
            firmId: {
              ownerId: "user123",
            },
          },
        },
      });

      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useIsOwner(), { wrapper });

      expect(result.current).toBe(true);
    });

    /**
     * @test {useIsOwner} should return false when current authenticated user is not the firm owner
     */
    it("should return false when current user is not the firm owner", () => {
      const store = createMockStore({
        auth: {
          user: {
            id: "user123",
            firmId: {
              ownerId: "owner456",
            },
          },
        },
      });

      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useIsOwner(), { wrapper });

      expect(result.current).toBe(false);
    });

    /**
     * @test {useIsOwner} should return false when user in Redux store is null
     */
    it("should return false when user is null", () => {
      const store = createMockStore({
        auth: {
          user: null,
        },
      });

      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useIsOwner(), { wrapper });

      expect(result.current).toBe(false);
    });

    /**
     * @test {useIsOwner} should return false when user in Redux store is undefined
     */
    it("should return false when user is undefined", () => {
      const store = createMockStore({
        auth: {},
      });

      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useIsOwner(), { wrapper });

      expect(result.current).toBe(false);
    });

    it("should return false when user has no firmId", () => {
      const store = createMockStore({
        auth: {
          user: {
            id: "user123",
          },
        },
      });

      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => useIsOwner(), { wrapper });

      expect(result.current).toBe(false);
    });
  });

  describe("getHours", () => {
    /**
     * @test {getHours} should return an array containing exactly 24 hour options
     */
    it("should return array of 24 hour options", () => {
      const hours = getHours();

      expect(hours).toHaveLength(24);
    });

    /**
     * @test {getHours} should return hours formatted as strings from "00" to "23"
     */
    it("should return hours from 00 to 23", () => {
      const hours = getHours();

      expect(hours[0].value).toBe("00");
      expect(hours[0].label).toBe("00");
      expect(hours[23].value).toBe("23");
      expect(hours[23].label).toBe("23");
    });

    /**
     * @test {getHours} should format all hour values with leading zeros (two digits)
     */
    it("should format all hours with leading zeros", () => {
      const hours = getHours();

      hours.forEach((hour) => {
        expect(hour.value).toMatch(/^\d{2}$/);
        expect(hour.label).toMatch(/^\d{2}$/);
      });
    });

    /**
     * @test {getHours} should have matching label and value properties for each hour option
     */
    it("should have consistent label and value for each hour", () => {
      const hours = getHours();

      hours.forEach((hour) => {
        expect(hour.label).toBe(hour.value);
      });
    });

    /**
     * @test {getHours} should return hours in ascending numerical order
     */
    it("should return hours in ascending order", () => {
      const hours = getHours();

      for (let i = 0; i < hours.length - 1; i++) {
        expect(parseInt(hours[i].value)).toBeLessThan(
          parseInt(hours[i + 1].value)
        );
      }
    });

    it("should return objects with label and value properties", () => {
      const hours = getHours();

      hours.forEach((hour) => {
        expect(hour).toHaveProperty("label");
        expect(hour).toHaveProperty("value");
        expect(typeof hour.label).toBe("string");
        expect(typeof hour.value).toBe("string");
      });
    });
  });

  describe("getMinutes", () => {
    /**
     * @test {getMinutes} should return an array containing exactly 12 minute options
     */
    it("should return array of minute options", () => {
      const minutes = getMinutes();

      expect(minutes).toHaveLength(12);
    });

    /**
     * @test {getMinutes} should return minutes in 5-minute intervals (00, 05, 10, ..., 55)
     */
    it("should return minutes in 5-minute intervals", () => {
      const minutes = getMinutes();
      const expectedMinutes = [
        "00",
        "05",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55",
      ];

      minutes.forEach((minute, index) => {
        expect(minute.value).toBe(expectedMinutes[index]);
        expect(minute.label).toBe(expectedMinutes[index]);
      });
    });

    /**
     * @test {getMinutes} should have matching label and value properties for each minute option
     */
    it("should have consistent label and value for each minute", () => {
      const minutes = getMinutes();

      minutes.forEach((minute) => {
        expect(minute.label).toBe(minute.value);
      });
    });

    /**
     * @test {getMinutes} should return minutes in ascending numerical order
     */
    it("should return minutes in ascending order", () => {
      const minutes = getMinutes();

      for (let i = 0; i < minutes.length - 1; i++) {
        expect(parseInt(minutes[i].value)).toBeLessThan(
          parseInt(minutes[i + 1].value)
        );
      }
    });

    it("should return objects with label and value properties", () => {
      const minutes = getMinutes();

      minutes.forEach((minute) => {
        expect(minute).toHaveProperty("label");
        expect(minute).toHaveProperty("value");
        expect(typeof minute.label).toBe("string");
        expect(typeof minute.value).toBe("string");
      });
    });

    /**
     * @test {getMinutes} should start with "00" and end with "55"
     */
    it("should start with 00 and end with 55", () => {
      const minutes = getMinutes();

      expect(minutes[0].value).toBe("00");
      expect(minutes[minutes.length - 1].value).toBe("55");
    });

    /**
     * @test {getMinutes} should format all minute values with leading zeros (two digits)
     */
    it("should format all minutes with leading zeros", () => {
      const minutes = getMinutes();

      minutes.forEach((minute) => {
        expect(minute.value).toMatch(/^\d{2}$/);
        expect(minute.label).toMatch(/^\d{2}$/);
      });
    });
  });
});

