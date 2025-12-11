import React, { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { all_routes } from "@/Router/all_routes";
import { checkPermission } from "@/Router/PermissionRoute";

const SettingsSideBar = ({ isMobileOpen, onClose }) => {
  const settingsRoutes = all_routes.settings;
  const location = useLocation();
  const permissions = useSelector((state) => state.auth?.permissions || []);

  // Filter routes based on permissions
  const filteredRoutes = useMemo(() => {
    return settingsRoutes
      .map((route) => {
        // Check if parent route has permission
        const hasParentPermission =
          !route.module || !route.permission
            ? true
            : checkPermission(permissions, route.module, route.permission);

        // If route has children, filter them
        if (route.children && route.children.length > 0) {
          const filteredChildren = route.children.filter((child) => {
            // If child has no module or permission, show it
            if (!child.module || !child.permission) {
              return true;
            }
            // Check if user has permission for this child
            return checkPermission(permissions, child.module, child.permission);
          });

          // Only include parent route if it has at least one visible child
          // or if the parent itself has permission and no children were filtered
          if (filteredChildren.length > 0) {
            return {
              ...route,
              children: filteredChildren,
            };
          }
          return null; // Hide parent if no children are visible
        }

        // If route has no children, show it only if it has permission
        return hasParentPermission ? route : null;
      })
      .filter((route) => route !== null); // Remove null entries
  }, [settingsRoutes, permissions]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobileOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="settings-sidebar-overlay"
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1040,
            display: "block",
          }}
        />
      )}

      <div
        className={`sidebars settings-sidebar theiaStickySidebar ${
          isMobileOpen ? "mobile-open" : ""
        }`}
        id="sidebar2"
      >
        <div className="stickybar w-100">
          <div className="sidebar-inner">
            <div id="sidebar-menu5" className="sidebar-menu">
              <ul>
                {filteredRoutes.map((route) => {
                  const Icon = route.icon;

                  const hasChildren =
                    route.children && route.children.length > 0;

                  return (
                    <li className={"submenu-open"} key={route.id}>
                      <ul>
                        {hasChildren ? (
                          <li className="submenu">
                            <Link to="#">
                              {Icon && <Icon />}
                              <span>{route.text}</span>
                            </Link>
                            <ul style={{ display: "block" }}>
                              {route.children.map((child) => {
                                const ChildIcon = child.icon;
                                const isActive =
                                  location.pathname === child.path ||
                                  (child.path !== "/" &&
                                    location.pathname.startsWith(
                                      child.path + "/"
                                    ));

                                return (
                                  <li key={child.id}>
                                    <Link
                                      to={child.path}
                                      className={isActive ? "active" : ""}
                                    >
                                      {ChildIcon && <ChildIcon />}
                                      {child.text}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        ) : (
                          <Link
                            to={route.path}
                            className={
                              location.pathname === route.path ||
                              (route.path !== "/" &&
                                location.pathname.startsWith(route.path + "/"))
                                ? "active"
                                : ""
                            }
                          >
                            {Icon && <Icon />}
                            <span>{route.text}</span>
                          </Link>
                        )}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

SettingsSideBar.propTypes = {
  isMobileOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SettingsSideBar;
