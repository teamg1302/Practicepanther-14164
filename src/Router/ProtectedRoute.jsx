import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { all_routes } from "./all_routes";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth?.token);

  // If no token, redirect to signin
  if (!token) {
    return <Navigate to={all_routes.signin} replace />;
  }

  // If token exists, allow access
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
