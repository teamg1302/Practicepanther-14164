/**
 * Test suite for SettingsLayout component.
 * @module InitialPage/SettingsLayout/index.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import SettingsLayout from "./index";
import rootReducer from "../../core/redux/reducer";

// Mock services used by reducers to prevent import errors
vi.mock("@/core/services/mastersService", () => ({
  getTimezone: vi.fn(),
  getTitles: vi.fn(),
  getCountries: vi.fn(),
  getCurrencies: vi.fn(),
  getStatesByCountry: vi.fn(),
}));

// Helper function to render component with providers
const renderWithProviders = (
  component,
  { preloadedState = {}, initialEntries = ["/"] } = {}
) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
    </Provider>
  );
};

describe("SettingsLayout Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render settings layout wrapper", () => {
      const { container } = renderWithProviders(
        <Routes>
          <Route path="/" element={<SettingsLayout />} />
        </Routes>
      );
      // Component should render a div wrapper
      // SettingsLayout renders a div with an Outlet inside
      const layoutDiv = container.querySelector("div > div");
      // If no nested div, check for the direct child div
      const div = layoutDiv || container.firstChild?.querySelector("div");
      expect(div).toBeTruthy();
      expect(div).toBeInstanceOf(HTMLDivElement);
      expect(div.tagName).toBe("DIV");
    });

    it("should render outlet for nested routes", () => {
      renderWithProviders(
        <Routes>
          <Route path="/" element={<SettingsLayout />}>
            <Route index element={<div>Settings Content</div>} />
          </Route>
        </Routes>,
        { initialEntries: ["/"] }
      );
      expect(screen.getByText("Settings Content")).toBeInTheDocument();
    });

    it("should render outlet content when route matches", () => {
      renderWithProviders(
        <Routes>
          <Route path="/" element={<SettingsLayout />}>
            <Route
              index
              element={<div data-testid="outlet-content">Content</div>}
            />
          </Route>
        </Routes>,
        { initialEntries: ["/"] }
      );

      const content = screen.getByTestId("outlet-content");
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent("Content");
    });
  });
});
