import React, { useState, useMemo } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { SidebarData } from "@/core/json/siderbar_data";
import { checkPermission } from "@/Router/PermissionRoute";
import HorizontalSidebar from "./horizontalSidebar";
import CollapsedSidebar from "./collapsedSidebar";

const Sidebar = () => {
  const Location = useLocation();
  const permissions = useSelector((state) => state.auth?.permissions || []);

  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");

  // Filter sidebar items based on permissions
  const filteredSidebarData = useMemo(() => {
    return SidebarData.map((mainLabel) => {
      const filteredItems = mainLabel.submenuItems
        ?.filter((item) => {
          // If item has no module/permission, show it (for items without permission checks)
          if (!item.module || !item.permission) {
            return true;
          }
          // Check if user has permission for this item
          return checkPermission(permissions, item.module, item.permission);
        })
        .map((item) => {
          // Filter submenu items if they exist
          if (item.submenuItems) {
            const filteredSubItems = item.submenuItems.filter((subItem) => {
              if (!subItem.module || !subItem.permission) {
                return true;
              }
              return checkPermission(permissions, subItem.module, subItem.permission);
            });
            // Only return item if it has submenu items or no submenu
            if (filteredSubItems.length > 0 || !item.submenu) {
              return {
                ...item,
                submenuItems: filteredSubItems,
              };
            }
            return null;
          }
          return item;
        })
        .filter(Boolean); // Remove null items

      // Only return the section if it has items
      if (filteredItems && filteredItems.length > 0) {
        return {
          ...mainLabel,
          submenuItems: filteredItems,
        };
      }
      return null;
    }).filter(Boolean); // Remove empty sections
  }, [permissions]);

  const toggleSidebar = (title) => {
    if (title == subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem) => {
    if (subitem == subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  return (
    <div>
      <div className="sidebar" id="sidebar">
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                {filteredSidebarData?.map((mainLabel, index) => (
                  <li className="submenu-open" key={index}>
                    <h6 className="submenu-hdr">{mainLabel?.label}</h6>
                    <ul>
                      {mainLabel?.submenuItems?.map((title, i) => {
                        let link_array = [];
                        title?.submenuItems?.map((link) => {
                          link_array.push(link?.link);
                          if (link?.submenu) {
                            link?.submenuItems?.map((item) => {
                              link_array.push(item?.link);
                            });
                          }
                          return link_array;
                        });
                        title.links = link_array;
                        return (
                          <React.Fragment key={i}>
                            {" "}
                            <li
                              className={`submenu ${
                                !title?.submenu &&
                                Location.pathname === title?.link
                                  ? "custom-active-hassubroute-false"
                                  : ""
                              }`}
                            >
                              <Link
                                to={title?.link}
                                onClick={() => toggleSidebar(title?.label)}
                                className={`${
                                  subOpen === title?.label ? "subdrop" : ""
                                } ${
                                  title?.links?.includes(Location.pathname)
                                    ? "active"
                                    : ""
                                }`}
                              >
                                {title?.icon}
                                <span className="custom-active-span">
                                  {title?.label}
                                </span>
                                {title?.submenu && (
                                  <span className="menu-arrow" />
                                )}
                              </Link>
                              <ul
                                style={{
                                  display:
                                    subOpen === title?.label ? "block" : "none",
                                }}
                              >
                                {title?.submenuItems?.map(
                                  (item, titleIndex) => (
                                    <li
                                      className="submenu submenu-two"
                                      key={titleIndex}
                                    >
                                      <Link
                                        to={item?.link}
                                        className={`${
                                          item?.submenuItems
                                            ?.map((link) => link.link)
                                            .includes(Location.pathname) ||
                                          item?.link === Location.pathname
                                            ? "active"
                                            : ""
                                        } ${
                                          subsidebar === item?.label
                                            ? "subdrop"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          toggleSubsidebar(item?.label)
                                        }
                                      >
                                        {item?.label}
                                        {item?.submenu && (
                                          <span className="menu-arrow inside-submenu" />
                                        )}
                                      </Link>
                                      <ul
                                        style={{
                                          display:
                                            subsidebar === item?.label
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        {item?.submenuItems?.map(
                                          (items, subIndex) => (
                                            <li key={subIndex}>
                                              <Link
                                                to={items?.link}
                                                className={`${
                                                  subsidebar === items?.label
                                                    ? "submenu-two subdrop"
                                                    : "submenu-two"
                                                } ${
                                                  items?.submenuItems
                                                    ?.map((link) => link.link)
                                                    .includes(
                                                      Location.pathname
                                                    ) ||
                                                  items?.link ===
                                                    Location.pathname
                                                    ? "active"
                                                    : ""
                                                }`}
                                              >
                                                {items?.label}
                                              </Link>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </li>
                                  )
                                )}
                              </ul>
                            </li>
                          </React.Fragment>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>
      {/* <HorizontalSidebar /> */}
      {/* <CollapsedSidebar /> */}
    </div>
  );
};

export default Sidebar;
