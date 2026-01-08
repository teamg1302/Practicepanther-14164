import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { all_routes } from "@/Router/all_routes";
import { checkPermission } from "@/Router/PermissionRoute";

const HorizontalSidebar = () => {
  const [isOpenChildren, setIsOpenChildren] = useState(false);
  const location = useLocation();
  const permissions = useSelector((state) => state.auth?.permissions || []);
  const headerRoutes = all_routes.headers;

  // Filter routes based on permissions
  const filteredRoutes = useMemo(() => {
    return headerRoutes.filter((route) => {
      // If route has no module or permission, show it (for routes without permission checks)
      if (!route.module || !route.permission) {
        return true;
      }

      // Check if user has permission for this route
      return checkPermission(permissions, route.module, route.permission);
    });
  }, [headerRoutes, permissions]);

  const [layoutColor] = useState("light_mode");
  const [layoutView] = useState("modern");
  const [layoutTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-layout-mode", layoutColor);
    document.documentElement.setAttribute("data-layout-style", layoutView);
    document.documentElement.setAttribute("data-nav-color", layoutTheme);
  }, [layoutColor, layoutTheme, layoutView]);

  return (
    <div className="sidebar horizontal-sidebar">
      <div id="sidebar-menu-3" className="sidebar-menu">
        <ul className="nav">
          {filteredRoutes.map((route) => {
            console.log("route.path", route.path, location.pathname);

            // Check if parent route is active
            const isParentActive =
              location.pathname === route.path ||
              (route.path !== "/" &&
                location.pathname.startsWith(route.path + "/")) ||
              (route.path === "/dashboard" && location.pathname === "/");

            // Check if any child route is active
            const isChildActive =
              route?.children &&
              route.children.some(
                (child) =>
                  location.pathname === child.path ||
                  (child.path !== "/" &&
                    location.pathname.startsWith(child.path + "/"))
              );

            // Parent is active if either parent or any child is active
            const isActive = isParentActive || isChildActive;

            return (
              <li className="submenu" key={route.id}>
                <Link
                  to={route.path}
                  onClick={() => setIsOpenChildren(!isOpenChildren)}
                  className={`subdrop ${isActive ? "active" : ""}`}
                >
                  <route.icon />
                  <span>{route.text}</span>
                  {route.children && <span className="menu-arrow" />}
                </Link>
                {route?.children && route?.children?.length > 0 && (
                  <ul style={{ display: isOpenChildren ? "block" : "none" }}>
                    {route.children.map((child) => {
                      // Check if this specific child route is active
                      const isChildRouteActive =
                        location.pathname === child.path ||
                        (child.path !== "/" &&
                          location.pathname.startsWith(child.path + "/"));

                      return (
                        <li key={child.id}>
                          <Link
                            to={child.path}
                            className={isChildRouteActive ? "active" : ""}
                          >
                            <span>{child.text}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default HorizontalSidebar;
