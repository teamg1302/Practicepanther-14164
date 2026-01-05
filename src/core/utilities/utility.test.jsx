/**
 * Test suite for utility functions.
 * @module core/utilities/utility.test
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { isOwner, useIsOwner, getHours, getMinutes } from "./utility";

// Mock Redux store for hook testing
const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: (state = initialState.auth || { user: null }) => state,
    },
    preloadedState: initialState,
  });
};

describe("Utility Functions", () => {
  describe("isOwner", () => {
    it("should return true when user is the firm owner", () => {
      const user = {
        id: "user123",
        firmId: {
          ownerId: "user123",
        },
      };

      expect(isOwner(user)).toBe(true);
    });

    it("should return false when user is not the firm owner", () => {
      const user = {
        id: "user123",
        firmId: {
          ownerId: "owner456",
        },
      };

      expect(isOwner(user)).toBe(false);
    });

    it("should return false when user is null", () => {
      expect(isOwner(null)).toBe(false);
    });

    it("should return false when user is undefined", () => {
      expect(isOwner(undefined)).toBe(false);
    });

    it("should return false when user has no firmId", () => {
      const user = {
        id: "user123",
      };

      expect(isOwner(user)).toBe(false);
    });

    it("should return false when user has no id", () => {
      const user = {
        firmId: {
          ownerId: "owner456",
        },
      };

      expect(isOwner(user)).toBe(false);
    });

    it("should return false when firmId has no ownerId", () => {
      const user = {
        id: "user123",
        firmId: {},
      };

      expect(isOwner(user)).toBe(false);
    });

    it("should handle numeric IDs correctly", () => {
      const user = {
        id: 123,
        firmId: {
          ownerId: 123,
        },
      };

      expect(isOwner(user)).toBe(true);
    });

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
    it("should return array of 24 hour options", () => {
      const hours = getHours();

      expect(hours).toHaveLength(24);
    });

    it("should return hours from 00 to 23", () => {
      const hours = getHours();

      expect(hours[0].value).toBe("00");
      expect(hours[0].label).toBe("00");
      expect(hours[23].value).toBe("23");
      expect(hours[23].label).toBe("23");
    });

    it("should format all hours with leading zeros", () => {
      const hours = getHours();

      hours.forEach((hour) => {
        expect(hour.value).toMatch(/^\d{2}$/);
        expect(hour.label).toMatch(/^\d{2}$/);
      });
    });

    it("should have consistent label and value for each hour", () => {
      const hours = getHours();

      hours.forEach((hour) => {
        expect(hour.label).toBe(hour.value);
      });
    });

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
    it("should return array of minute options", () => {
      const minutes = getMinutes();

      expect(minutes).toHaveLength(12);
    });

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

    it("should have consistent label and value for each minute", () => {
      const minutes = getMinutes();

      minutes.forEach((minute) => {
        expect(minute.label).toBe(minute.value);
      });
    });

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

    it("should start with 00 and end with 55", () => {
      const minutes = getMinutes();

      expect(minutes[0].value).toBe("00");
      expect(minutes[minutes.length - 1].value).toBe("55");
    });

    it("should format all minutes with leading zeros", () => {
      const minutes = getMinutes();

      minutes.forEach((minute) => {
        expect(minute.value).toMatch(/^\d{2}$/);
        expect(minute.label).toMatch(/^\d{2}$/);
      });
    });
  });
});

