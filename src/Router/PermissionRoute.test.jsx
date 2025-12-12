/**
 * Test suite for PermissionRoute component.
 * @module Router/PermissionRoute.test
 * 
 * Tests permission-based route protection including:
 * - Permission checking logic
 * - manage_all super admin permission
 * - Module-specific permissions
 * - 404 page rendering for denied access
 * - Route access without permission requirements
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PermissionRoute, { checkPermission } from "./PermissionRoute";
import Error404 from "@/feature-module/pages/errorpages/error404";

// Mock Error404 component
vi.mock("@/feature-module/pages/errorpages/error404", () => ({
  default: () => <div data-testid="error-404">404 Error Page</div>,
}));

// Helper function to create mock store
const createMockStore = (permissions = []) => {
  return configureStore({
    reducer: {
      auth: (state = { permissions }) => state,
    },
  });
};

describe("PermissionRoute", () => {
  describe("checkPermission helper function", () => {
    it("should return false when permissions is not an array", () => {
      expect(checkPermission(null, "manage_contacts", "read")).toBe(false);
      expect(checkPermission(undefined, "manage_contacts", "read")).toBe(false);
      expect(checkPermission({}, "manage_contacts", "read")).toBe(false);
    });

    it("should return true when user has manage_all permission", () => {
      const permissions = [
        {
          moduleName: "manage_all",
          actions: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
        },
      ];

      expect(checkPermission(permissions, "manage_contacts", "read")).toBe(
        true
      );
      expect(checkPermission(permissions, "manage_matters", "create")).toBe(
        true
      );
    });

    it("should return true when user has specific module permission", () => {
      const permissions = [
        {
          moduleName: "manage_contacts",
          actions: {
            create: true,
            read: true,
            update: false,
            delete: false,
          },
        },
      ];

      expect(checkPermission(permissions, "manage_contacts", "read")).toBe(
        true
      );
      expect(checkPermission(permissions, "manage_contacts", "create")).toBe(
        true
      );
    });

    it("should return false when user does not have permission", () => {
      const permissions = [
        {
          moduleName: "manage_contacts",
          actions: {
            create: false,
            read: false,
            update: false,
            delete: false,
          },
        },
      ];

      expect(checkPermission(permissions, "manage_contacts", "read")).toBe(
        false
      );
    });

    it("should return false when module permission does not exist", () => {
      const permissions = [
        {
          moduleName: "manage_contacts",
          actions: {
            create: true,
            read: true,
          },
        },
      ];

      expect(checkPermission(permissions, "manage_matters", "read")).toBe(
        false
      );
    });

    it("should return false when action does not exist in permissions", () => {
      const permissions = [
        {
          moduleName: "manage_contacts",
          actions: {
            create: true,
            read: true,
          },
        },
      ];

      expect(checkPermission(permissions, "manage_contacts", "update")).toBe(
        false
      );
    });
  });

  describe("PermissionRoute component", () => {
    it("should render children when route has no module/permission", () => {
      const store = createMockStore([]);
      const TestComponent = () => <div>Test Content</div>;

      render(
        <Provider store={store}>
          <PermissionRoute>
            <TestComponent />
          </PermissionRoute>
        </Provider>
      );

      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should render children when user has permission", () => {
      const permissions = [
        {
          moduleName: "manage_contacts",
          actions: {
            read: true,
          },
        },
      ];
      const store = createMockStore(permissions);
      const TestComponent = () => <div>Test Content</div>;

      render(
        <Provider store={store}>
          <MemoryRouter>
            <PermissionRoute module="manage_contacts" permission="read">
              <TestComponent />
            </PermissionRoute>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should render 404 page when user does not have permission", () => {
      const permissions = [
        {
          moduleName: "manage_contacts",
          actions: {
            read: false,
          },
        },
      ];
      const store = createMockStore(permissions);
      const TestComponent = () => <div>Test Content</div>;

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <PermissionRoute module="manage_contacts" permission="read">
                    <TestComponent />
                  </PermissionRoute>
                }
              />
              <Route path="/error-404" element={<Error404 />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId("error-404")).toBeInTheDocument();
      expect(screen.queryByText("Test Content")).not.toBeInTheDocument();
    });

    it("should render children when user has manage_all permission", () => {
      const permissions = [
        {
          moduleName: "manage_all",
          actions: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
        },
      ];
      const store = createMockStore(permissions);
      const TestComponent = () => <div>Test Content</div>;

      render(
        <Provider store={store}>
          <MemoryRouter>
            <PermissionRoute module="manage_matters" permission="create">
              <TestComponent />
            </PermissionRoute>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should handle empty permissions array", () => {
      const store = createMockStore([]);
      const TestComponent = () => <div>Test Content</div>;

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <PermissionRoute module="manage_contacts" permission="read">
                    <TestComponent />
                  </PermissionRoute>
                }
              />
              <Route path="/error-404" element={<Error404 />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId("error-404")).toBeInTheDocument();
    });

    it("should handle different action types", () => {
      const permissions = [
        {
          moduleName: "manage_contacts",
          actions: {
            create: true,
            read: true,
            update: false,
            delete: false,
          },
        },
      ];
      const store = createMockStore(permissions);
      const TestComponent = () => <div>Test Content</div>;

      // Test create permission
      const { rerender } = render(
        <Provider store={store}>
          <MemoryRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <PermissionRoute module="manage_contacts" permission="create">
                    <TestComponent />
                  </PermissionRoute>
                }
              />
              <Route path="/error-404" element={<Error404 />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
      expect(screen.getByText("Test Content")).toBeInTheDocument();

      // Test update permission (should be denied)
      rerender(
        <Provider store={store}>
          <MemoryRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <PermissionRoute module="manage_contacts" permission="update">
                    <TestComponent />
                  </PermissionRoute>
                }
              />
              <Route path="/error-404" element={<Error404 />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
      expect(screen.getByTestId("error-404")).toBeInTheDocument();
    });
  });
});

