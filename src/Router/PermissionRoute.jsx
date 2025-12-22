import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

/**
 * Helper function to check if user has permission for a module and action
 * @param {Array} permissions - Array of permission objects
 * @param {string} moduleName - Module name to check
 * @param {string} action - Action to check (create, read, update, delete)
 * @returns {boolean} - True if user has permission, false otherwise
 */
export const checkPermission = (permissions, moduleName, action) => {
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }

  // Check if user has "manage_all" permission (super admin)
  const manageAll = permissions.find(
    (perm) => perm.moduleName === "manage_all"
  );
  if (manageAll && manageAll.actions?.[action] === true) {
    return true;
  }

  // Check specific module permission
  const modulePermission = permissions.find(
    (perm) => perm.moduleName === moduleName
  );

  if (!modulePermission) {
    return true;
  }

  return modulePermission.actions?.[action] === true;
};

/**
 * PermissionRoute component that checks user permissions before rendering route
 */
const PermissionRoute = ({
  children,
  module: moduleName,
  permission: action,
}) => {
  const permissions = useSelector((state) => state.auth?.permissions || []);

  // If route doesn't have module/permission, allow access (for routes without permission checks)
  if (!moduleName || !action) {
    return children;
  }

  // Check if user has permission
  const hasPermission = checkPermission(permissions, moduleName, action);

  // If no permission, show 404 page
  if (!hasPermission) {
    return <Navigate to="/error-404" replace />;
  }

  // If has permission, render the route
  return children;
};

PermissionRoute.propTypes = {
  children: PropTypes.node.isRequired,
  module: PropTypes.string,
  permission: PropTypes.string,
};

export default PermissionRoute;
