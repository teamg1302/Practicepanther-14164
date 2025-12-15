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

import React from "react";
import { Outlet } from "react-router-dom";

const SettingsLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default SettingsLayout;
