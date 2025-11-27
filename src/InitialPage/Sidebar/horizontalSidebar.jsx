import React, { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "@/Router/all_routes";

const HorizontalSidebar = () => {
  const headerRoutes = all_routes.headers;
  return (
    <div className="sidebar horizontal-sidebar">
      <div id="sidebar-menu-3" className="sidebar-menu">
        <ul className="nav">
          {headerRoutes.map((route) => (
            <li className="submenu" key={route.id}>
              <Link to={route.path} className={"subdrop"}>
                <route.icon />
                <span>{route.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HorizontalSidebar;
