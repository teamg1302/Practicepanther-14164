import React from "react";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "@/Router/all_routes";

const HorizontalSidebar = () => {
  const location = useLocation();
  const headerRoutes = all_routes.headers;
  return (
    <div className="sidebar horizontal-sidebar">
      <div id="sidebar-menu-3" className="sidebar-menu">
        <ul className="nav">
          {headerRoutes.map((route) => {
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
