/**
 * Settings sidebar component for navigation.
 * @module InitialPage/SettingsLayout/sidebar
 *
 * Provides a sidebar navigation menu for settings pages with:
 * - Permission-based route filtering
 * - Owner-based module visibility (manage_subscriptions only visible to owners)
 * - Mobile-responsive design with overlay
 * - Active route highlighting
 * - Nested route support with children
 */

import React, { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { all_routes } from "@/Router/all_routes";
import { checkPermission } from "@/Router/PermissionRoute";
import { useIsOwner } from "@/core/utilities/utility";

/**
 * Settings sidebar component.
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isMobileOpen - Whether the mobile sidebar is open
 * @param {Function} props.onClose - Function to close the mobile sidebar
 * @returns {JSX.Element} Settings sidebar component
 *
 * @example
 * <SettingsSideBar isMobileOpen={false} onClose={() => {}} />
 */
const SettingsSideBar = ({ isMobileOpen, onClose }) => {
  const isOwner = useIsOwner();
  const settingsRoutes = all_routes.settings;
  const location = useLocation();
  const permissions = useSelector((state) => state.auth?.permissions || []);

  // Filter routes based on permissions and owner status
  const filteredRoutes = useMemo(() => {
    return settingsRoutes
      .map((route) => {
        // Hide manage_subscriptions module if user is NOT owner
        // Only owners should see the manage_subscriptions module
        if (!isOwner && route.module === "manage_subscriptions") {
          return null;
        }

        // Check if parent route has permission
        const hasParentPermission =
          !route.module || !route.permission
            ? true
            : checkPermission(permissions, route.module, route.permission);

        // If route has children, filter them
        if (route.children && route.children.length > 0) {
          const filteredChildren = route.children.filter((child) => {
            // Hide manage_subscriptions children if user is NOT owner
            // Only owners should see the manage_subscriptions children
            if (!isOwner && child.module === "manage_subscriptions") {
              return false;
            }
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
  }, [settingsRoutes, permissions, isOwner]);

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
