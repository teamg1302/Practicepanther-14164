import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { all_routes } from "@/Router/all_routes";

const SettingsSideBar = ({ isMobileOpen, onClose }) => {
  const settingsRoutes = all_routes.settings;
  const location = useLocation();

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
                {settingsRoutes.map((route) => {
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
