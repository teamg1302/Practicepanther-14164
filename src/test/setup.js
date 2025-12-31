/**
 * Test setup file for Vitest.
 * Configures testing environment and global test utilities.
 */

import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for components that use media queries
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// vi.mock("@mui/material", async () => {
//   const actual = await vi.importActual("@mui/material");
//   return actual;
// });

// vi.mock("@mui/icons-material", () => {
//   return new Proxy(
//     {},
//     {
//       get: () => () => null,
//     }
//   );
// });

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: "en",
    },
  }),
  Trans: ({ children }) => children,
  initReactI18next: {
    type: "languageDetector",
    init: vi.fn(),
  },
}));
