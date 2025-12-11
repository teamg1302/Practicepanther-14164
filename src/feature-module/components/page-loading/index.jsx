import React from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import "./PageLoader.css";

const PageLoader = ({ loading: propLoading }) => {
  // If you pass a prop "loading" it will be used, otherwise it reads from redux state.pageLoading
  const storeLoading = useSelector((s) => s.pageLoading);
  const loading = typeof propLoading === "boolean" ? propLoading : storeLoading;

  if (!loading) return null;

  return createPortal(
    <div className="page-loader-overlay" role="status" aria-live="polite">
      <div className="page-loader-box">
        <div className="spinner" />
        <div className="loader-text">Loading...</div>
      </div>
    </div>,
    document.body
  );
};

export default PageLoader;
