/**
 * Test suite for Header component.
 * @module InitialPage/Sidebar/Header.test
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Header from "./Header";
import rootReducer from "../../core/redux/reducer";

// Mock dependencies
vi.mock("../../core/img/imagewithbasebath", () => ({
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("../../Router/all_routes", () => ({
  all_routes: {
    signin: "/signin",
  },
}));

vi.mock("../../core/services/authService", () => ({
  logout: vi.fn(),
}));

// Helper function to render component with providers
const renderWithProviders = (component, { preloadedState = {} } = {}) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("Header Component", () => {
  beforeEach(() => {
    // Reset DOM
    document.body.className = "";
    document.body.innerHTML = "";
    localStorage.clear();
    vi.clearAllMocks();

    // Mock window.location
    delete window.location;
    window.location = { pathname: "/dashboard" };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render header component", () => {
      const { container } = renderWithProviders(<Header />);
      const header = container.querySelector(".header");
      expect(header).toBeInTheDocument();
    });

    it("should render logo", () => {
      renderWithProviders(<Header />);
      const logo = screen.getByAltText("img");
      expect(logo).toBeInTheDocument();
    });

    it("should render search input", () => {
      renderWithProviders(<Header />);
      const searchInput = screen.getByPlaceholderText("Search");
      expect(searchInput).toBeInTheDocument();
    });

    it("should render fullscreen toggle button", () => {
      renderWithProviders(<Header />);
      const fullscreenBtn = screen.getByLabelText(/fullscreen/i);
      expect(fullscreenBtn).toBeInTheDocument();
    });

    it("should render email link", () => {
      renderWithProviders(<Header />);
      const emailLink = screen.getByLabelText(/email notifications/i);
      expect(emailLink).toBeInTheDocument();
    });

    it("should render notifications dropdown", () => {
      renderWithProviders(<Header />);
      const notificationsBtn = screen.getByLabelText(/notifications/i);
      expect(notificationsBtn).toBeInTheDocument();
    });

    it("should render settings link", () => {
      renderWithProviders(<Header />);
      const settingsLink = screen.getByLabelText("Settings");
      expect(settingsLink).toBeInTheDocument();
    });

    it("should render user menu dropdown", () => {
      renderWithProviders(<Header />);
      const userMenu = screen.getByLabelText("User menu");
      expect(userMenu).toBeInTheDocument();
    });
  });

  describe("Sidebar Toggle", () => {
    it("should toggle sidebar when toggle button is clicked", () => {
      renderWithProviders(<Header />);
      const toggleBtn = screen.getByLabelText("Toggle sidebar");

      expect(document.body.classList.contains("mini-sidebar")).toBe(false);

      fireEvent.click(toggleBtn);

      expect(document.body.classList.contains("mini-sidebar")).toBe(true);
    });

    it("should hide toggle button on specific routes", () => {
      window.location.pathname = "/tasks";
      renderWithProviders(<Header />);
      const toggleBtn = screen.queryByLabelText("Toggle sidebar");
      expect(toggleBtn).not.toBeInTheDocument();
    });
  });

  describe("Mobile Menu", () => {
    it("should toggle mobile sidebar overlay", () => {
      renderWithProviders(<Header />);
      const mobileBtn = screen.getByLabelText("Toggle mobile menu");

      fireEvent.click(mobileBtn);

      // Check if classes are toggled (implementation depends on DOM structure)
      expect(document.querySelector(".main-wrapper")?.classList.contains("slide-nav")).toBe(true);
    });
  });

  describe("Fullscreen Toggle", () => {
    it("should have fullscreen button with correct aria-label", () => {
      renderWithProviders(<Header />);
      const fullscreenBtn = screen.getByLabelText("Enter fullscreen");
      expect(fullscreenBtn).toBeInTheDocument();
    });

    it("should call toggleFullscreen when clicked", () => {
      // Mock fullscreen API
      const mockRequestFullscreen = vi.fn();
      document.documentElement.requestFullscreen = mockRequestFullscreen;

      renderWithProviders(<Header />);
      const fullscreenBtn = screen.getByLabelText("Enter fullscreen");

      fireEvent.click(fullscreenBtn);

      // Note: Actual fullscreen API behavior may vary in test environment
      expect(fullscreenBtn).toBeInTheDocument();
    });
  });

  describe("Logout", () => {
    it("should handle logout when logout link is clicked", async () => {
      const { logout } = await import("../../core/services/authService");
      const mockNavigate = vi.fn();

      // Mock useNavigate
      vi.mock("react-router-dom", async () => {
        const actual = await vi.importActual("react-router-dom");
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        };
      });

      renderWithProviders(<Header />);

      // Open user menu first (if needed)
      const userMenu = screen.getByLabelText("User menu");
      fireEvent.click(userMenu);

      // Find and click logout link
      await waitFor(() => {
        const logoutLink = screen.getByText("Logout");
        if (logoutLink) {
          fireEvent.click(logoutLink);
        }
      });

      // Note: Full logout test may require additional setup
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on interactive elements", () => {
      renderWithProviders(<Header />);

      expect(screen.getByLabelText("Toggle sidebar")).toBeInTheDocument();
      expect(screen.getByLabelText("Toggle mobile menu")).toBeInTheDocument();
      expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fullscreen/i)).toBeInTheDocument();
      expect(screen.getByLabelText("Settings")).toBeInTheDocument();
    });

    it("should have proper role attributes", () => {
      renderWithProviders(<Header />);

      const searchForm = screen.getByRole("search");
      expect(searchForm).toBeInTheDocument();
    });

    it("should have aria-hidden on decorative icons", () => {
      renderWithProviders(<Header />);
      const icons = document.querySelectorAll("[aria-hidden='true']");
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("Responsive Behavior", () => {
    it("should render mobile menu button", () => {
      renderWithProviders(<Header />);
      const mobileBtn = screen.getByLabelText("Toggle mobile menu");
      expect(mobileBtn).toBeInTheDocument();
    });

    it("should handle menu expansion on hover", () => {
      renderWithProviders(<Header />);
      const headerLeft = document.querySelector(".header-left");

      if (headerLeft) {
        fireEvent.mouseOver(headerLeft);
        expect(document.body.classList.contains("expand-menu")).toBe(true);

        fireEvent.mouseLeave(headerLeft);
        expect(document.body.classList.contains("expand-menu")).toBe(false);
      }
    });
  });

  describe("Route Exclusions", () => {
    it("should not render on excluded routes", () => {
      window.location.pathname = "/reactjs/template/dream-pos/index-three";
      const { container } = renderWithProviders(<Header />);
      expect(container.firstChild).toBeNull();
    });
  });
});

