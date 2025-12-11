import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { all_routes } from "@/Router/all_routes";
import { checkPermission } from "@/Router/PermissionRoute";

const HorizontalSidebar = () => {
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

  return (
    <div className="sidebar horizontal-sidebar">
      <div id="sidebar-menu-3" className="sidebar-menu">
        <ul className="nav">
          {filteredRoutes.map((route) => {
            const isActive =
              location.pathname === route.path ||
              (route.path !== "/" &&
                location.pathname.startsWith(route.path + "/"));
            return (
              <li className="submenu" key={route.id}>
                <Link
                  to={route.path}
                  className={`subdrop ${isActive ? "active" : ""}`}
                >
                  <route.icon />
                  <span>{route.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default HorizontalSidebar;
