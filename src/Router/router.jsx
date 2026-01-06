import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "@/InitialPage/Sidebar/Header";
import Sidebar from "@/InitialPage/Sidebar/Sidebar";
import { pagesRoute, publicRoutes, settingsRoutes } from "@/Router/router.link";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeSettings from "@/InitialPage/themeSettings";
import ProtectedRoute from "@/Router/ProtectedRoute";
import PermissionRoute from "@/Router/PermissionRoute";
import SettingsLayout from "@/InitialPage/SettingsLayout";
import { all_routes } from "./all_routes";
import Loader from "@/core/loader";

const HeaderLayout = () => {
  const location = useLocation();
  const data = useSelector((state) => state.toggle_header);
  const pageLoader = useSelector((state) => state.pageLoader);
  let showThemeSettings = true;
  if (
    location.pathname === "/time-entries/multiple" ||
    location.pathname === "/time-entries/add" ||
    location.pathname === "/time-entries/:timeEntryId/edit"
  ) {
    showThemeSettings = false;
  }
  return (
    <ProtectedRoute>
      <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
        {pageLoader && <Loader />}
        <Header />
        <Sidebar />
        <Outlet />
        {/* {showThemeSettings && <ThemeSettings />} */}
      </div>
    </ProtectedRoute>
  );
};

const Authpages = () => {
  const data = useSelector((state) => state.toggle_header);
  const token = useSelector((state) => state.auth?.token);
  const location = useLocation();

  // allow access to error pages even when token exists
  const isErrorRoute = ["/error-404", "/error-500"].includes(location.pathname);

  if (token && !isErrorRoute) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className={data ? "header-collapse" : ""}>
      <Outlet />
      {/* <Loader /> */}
      {/* <ThemeSettings /> */}
    </div>
  );
};

const AllRoutes = () => {
  // Helper function to get route config from all_routes
  const getRouteConfig = (routeName, routePath) => {
    // Check headers first
    const headerRoute = all_routes.headers?.find(
      (h) => h.path === routePath || h.name === routeName
    );
    if (headerRoute) {
      return {
        module: headerRoute.module,
        permission: headerRoute.permission,
      };
    }

    // Check other route objects
    const routeKeys = Object.keys(all_routes);
    for (const key of routeKeys) {
      const route = all_routes[key];
      if (typeof route === "object" && route !== null) {
        if (route.path === routePath || route.name === routeName) {
          return {
            module: route.module,
            permission: route.permission,
          };
        }
      }
    }

    // Check nested settings routes
    if (all_routes.settings) {
      for (const setting of all_routes.settings) {
        if (setting.path === routePath || setting.name === routeName) {
          return {
            module: setting.module,
            permission: setting.permission,
          };
        }
        if (setting.children) {
          for (const child of setting.children) {
            if (child.path === routePath || child.name === routeName) {
              return {
                module: child.module,
                permission: child.permission,
              };
            }
          }
        }
      }
    }

    return { module: null, permission: null };
  };

  return (
    <div>
      <Routes>
        <Route path={"/"} element={<HeaderLayout />}>
          {publicRoutes.map((route, id) => {
            const routeConfig = getRouteConfig(route.name, route.path);
            return (
              <Route
                path={route.path}
                element={
                  <PermissionRoute
                    module={routeConfig.module}
                    permission={routeConfig.permission}
                  >
                    {route.element}
                  </PermissionRoute>
                }
                key={id}
              />
            );
          })}
          <Route path="/settings" element={<SettingsLayout />}>
            {settingsRoutes.map((route, id) => {
              const routeConfig = getRouteConfig(route.name, route.path);
              return (
                <Route
                  path={route.path}
                  element={
                    <PermissionRoute
                      module={routeConfig.module}
                      permission={routeConfig.permission}
                    >
                      {route.element}
                    </PermissionRoute>
                  }
                  key={id}
                />
              );
            })}
          </Route>
        </Route>

        <Route path={"/"} element={<Authpages />}>
          {pagesRoute.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route>
      </Routes>
    </div>
  );
};
export default AllRoutes;
