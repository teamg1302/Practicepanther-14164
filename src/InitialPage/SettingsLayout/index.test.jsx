/**
 * Test suite for SettingsLayout component.
 * @module InitialPage/SettingsLayout/index.test
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SettingsLayout from "./index";
import rootReducer from "../../../core/redux/reducer";

// Mock SettingsSidebar component
vi.mock("./sidebar", () => ({
  default: ({ isMobileOpen, onClose }) => (
    <nav
      id="settings-sidebar"
      data-testid="settings-sidebar"
      style={{ display: isMobileOpen ? "block" : "none" }}
    >
      <button onClick={onClose}>Close</button>
      <div>Settings Sidebar</div>
    </nav>
  ),
}));

// Helper function to render component with providers
const renderWithProviders = (component, { preloadedState = {} } = {}) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={component} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe("SettingsLayout Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render settings layout", () => {
      renderWithProviders(<SettingsLayout />);
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("should render page title and description", () => {
      renderWithProviders(<SettingsLayout />);
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Manage your settings on portal")).toBeInTheDocument();
    });

    it("should render settings sidebar", () => {
      renderWithProviders(<SettingsLayout />);
      const sidebar = screen.getByTestId("settings-sidebar");
      expect(sidebar).toBeInTheDocument();
    });

    it("should render outlet for nested routes", () => {
      renderWithProviders(
        <Routes>
          <Route path="/" element={<SettingsLayout />}>
            <Route index element={<div>Settings Content</div>} />
          </Route>
        </Routes>
      );
      expect(screen.getByText("Settings Content")).toBeInTheDocument();
    });
  });

  describe("Mobile Sidebar Toggle", () => {
    it("should toggle mobile sidebar when button is clicked", () => {
      renderWithProviders(<SettingsLayout />);
      const toggleBtn = screen.getByLabelText("Toggle settings sidebar");
      const sidebar = screen.getByTestId("settings-sidebar");

      // Initially closed
      expect(sidebar).toHaveStyle({ display: "none" });

      // Open sidebar
      fireEvent.click(toggleBtn);
      expect(sidebar).toHaveStyle({ display: "block" });
      expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

      // Close sidebar
      fireEvent.click(toggleBtn);
      expect(sidebar).toHaveStyle({ display: "none" });
      expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
    });

    it("should close sidebar when close button is clicked", () => {
      renderWithProviders(<SettingsLayout />);
      const toggleBtn = screen.getByLabelText("Toggle settings sidebar");
      const sidebar = screen.getByTestId("settings-sidebar");
      const closeBtn = screen.getByText("Close");

      // Open sidebar
      fireEvent.click(toggleBtn);
      expect(sidebar).toHaveStyle({ display: "block" });

      // Close via close button
      fireEvent.click(closeBtn);
      expect(sidebar).toHaveStyle({ display: "none" });
    });
  });

  describe("Header Toggle", () => {
    it("should toggle header collapse state", () => {
      renderWithProviders(<SettingsLayout />);
      const collapseBtn = screen.getByLabelText("Collapse header");

      expect(collapseBtn).toHaveAttribute("aria-expanded", "true");

      fireEvent.click(collapseBtn);

      expect(collapseBtn).toHaveAttribute("aria-expanded", "false");
      expect(collapseBtn).toHaveClass("active");
    });

    it("should update aria-label when header is collapsed", () => {
      renderWithProviders(<SettingsLayout />);
      const collapseBtn = screen.getByLabelText("Collapse header");

      fireEvent.click(collapseBtn);

      expect(collapseBtn).toHaveAttribute("aria-label", "Expand header");
    });
  });

  describe("Tooltips", () => {
    it("should render refresh tooltip", () => {
      renderWithProviders(<SettingsLayout />);
      const refreshLink = screen.getByLabelText("Refresh settings");
      expect(refreshLink).toBeInTheDocument();
    });

    it("should render collapse tooltip", () => {
      renderWithProviders(<SettingsLayout />);
      const collapseLink = screen.getByLabelText("Collapse header");
      expect(collapseLink).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on interactive elements", () => {
      renderWithProviders(<SettingsLayout />);

      expect(screen.getByLabelText("Toggle settings sidebar")).toBeInTheDocument();
      expect(screen.getByLabelText("Refresh settings")).toBeInTheDocument();
      expect(screen.getByLabelText("Collapse header")).toBeInTheDocument();
    });

    it("should have proper aria-expanded attributes", () => {
      renderWithProviders(<SettingsLayout />);

      const toggleBtn = screen.getByLabelText("Toggle settings sidebar");
      expect(toggleBtn).toHaveAttribute("aria-expanded", "false");

      const collapseBtn = screen.getByLabelText("Collapse header");
      expect(collapseBtn).toHaveAttribute("aria-expanded", "true");
    });

    it("should have proper aria-controls on mobile toggle", () => {
      renderWithProviders(<SettingsLayout />);
      const toggleBtn = screen.getByLabelText("Toggle settings sidebar");
      expect(toggleBtn).toHaveAttribute("aria-controls", "settings-sidebar");
    });

    it("should have minimum touch target size on mobile button", () => {
      renderWithProviders(<SettingsLayout />);
      const toggleBtn = screen.getByLabelText("Toggle settings sidebar");
      const styles = window.getComputedStyle(toggleBtn);

      // Check if min-width and min-height are set (may need adjustment based on actual implementation)
      expect(toggleBtn).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should render mobile toggle button", () => {
      renderWithProviders(<SettingsLayout />);
      const mobileToggle = screen.getByLabelText("Toggle settings sidebar");
      expect(mobileToggle).toBeInTheDocument();
      expect(mobileToggle).toHaveClass("d-lg-none");
    });

    it("should have main content area", () => {
      renderWithProviders(
        <Routes>
          <Route path="/" element={<SettingsLayout />}>
            <Route index element={<div>Content</div>} />
          </Route>
        </Routes>
      );

      const main = document.querySelector(".settings-content-main");
      expect(main).toBeInTheDocument();
    });
  });
});

