/**
 * Settings Layout component.
 * Provides a layout wrapper for settings pages with sidebar navigation.
 *
 * Features:
 * - Settings page header with title and description
 * - Collapsible header section
 * - Refresh functionality
 * - Responsive mobile sidebar toggle
 * - Settings sidebar navigation
 * - Outlet for nested settings routes
 *
 * @module InitialPage/SettingsLayout
 * @component
 * @returns {JSX.Element} Settings layout component
 */
import {
  ChevronUp,
  RotateCcw,
  Menu,
} from "feather-icons-react/build/IconComponents";
import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";

import { setToogleHeader } from "@/core/redux/action";
import SettingsSidebar from "./sidebar";

const SettingsLayout = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  /**
   * Renders tooltip for refresh button.
   *
   * @param {Object} props - Tooltip props from OverlayTrigger
   * @returns {JSX.Element} Tooltip component
   */
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );

  /**
   * Renders tooltip for collapse button.
   *
   * @param {Object} props - Tooltip props from OverlayTrigger
   * @returns {JSX.Element} Tooltip component
   */
  const renderCollapseTooltip = (props) => (
    <Tooltip id="collapse-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  return (
    <div>
      <div className="page-wrapper">
        <div className="content settings-content">
          <div className="page-header settings-pg-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Settings</h4>
                <h6>Manage your settings on portal</h6>
              </div>
            </div>
            <ul className="table-top-head">
              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                className="btn btn-sm settings-mobile-toggle d-lg-none"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                aria-label="Toggle settings sidebar"
                aria-expanded={isMobileSidebarOpen}
                aria-controls="settings-sidebar"
                style={{
                  marginLeft: "auto",
                  marginRight: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "44px",
                  minHeight: "44px",
                }}
              >
                <Menu size={20} aria-hidden="true" />
              </button>
              <li>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    role="button"
                    aria-label="Refresh settings"
                    to="#"
                  >
                    <RotateCcw aria-hidden="true" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    id="collapse-header"
                    role="button"
                    aria-label={data ? "Expand header" : "Collapse header"}
                    aria-expanded={!data}
                    className={data ? "active" : ""}
                    to="#"
                    onClick={() => {
                      dispatch(setToogleHeader(!data));
                    }}
                  >
                    <ChevronUp aria-hidden="true" />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="settings-wrapper d-flex">
                <SettingsSidebar
                  id="settings-sidebar"
                  isMobileOpen={isMobileSidebarOpen}
                  onClose={() => setIsMobileSidebarOpen(false)}
                />
                <main className="settings-content-main">
                  <Outlet />
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
