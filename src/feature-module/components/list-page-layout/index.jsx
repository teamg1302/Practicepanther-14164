import React, { useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import PropTypes from "prop-types";
import {
  ChevronUp,
  PlusCircle,
  RotateCcw,
  Download,
  ArrowLeft,
  Menu,
} from "feather-icons-react/build/IconComponents";
import { Button } from "@mui/material";
import { setToogleHeader } from "@/core/redux/action";
import ImageWithBasePath from "@/core/img/imagewithbasebath";
import { checkPermission } from "@/Router/PermissionRoute";
import { t } from "i18next";
import SettingsSidebar from "@/InitialPage/SettingsLayout/sidebar";

/**
 * Reusable List Page Layout Component
 * Provides a consistent layout structure for list pages with header, action buttons, and tool icons
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Main page title
 * @param {string} props.subtitle - Page subtitle/description
 * @param {React.ReactNode} props.children - Content to render (typically EnhancedList)
 * @param {Object} [props.addButton] - Add button configuration { path, text, icon, module, permission }
 * @param {Object} [props.importButton] - Import button configuration { onClick, text, icon, modalTarget }
 * @param {Object} [props.toolIcons] - Tool icons configuration { showPdf, showExcel, showPrinter, showRefresh, showCollapse }
 * @param {Function} [props.onRefresh] - Refresh button click handler
 * @param {React.ReactNode} [props.filterContent] - Filter section content to render above the table
 * @param {boolean} [props.showFilter] - Whether to show the filter section (default: false)
 */
const ListPageLayout = ({
  breadcrumbs = [],
  isSettingsLayout = false,
  isFormLayout = false,
  title,
  subtitle,
  actions,
  children,
  toolIcons = {
    showPdf: false,
    showExcel: false,
    showPrinter: false,
    showRefresh: false,
    showCollapse: false,
  },
  onRefresh,
  filterContent,
  showFilter = false,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const permissions = useSelector((state) => state.auth?.permissions || []);

  // Check if addButton should be shown based on permissions
  const shouldShowAddButton = () => {
    if (!actions?.addButton) return false;

    // If no module or permission specified, show the button
    if (!actions?.addButton.module || !actions?.addButton.permission) {
      return true;
    }

    // Check if user has permission
    return checkPermission(
      permissions,
      actions?.addButton.module,
      actions?.addButton.permission
    );
  };

  // Tooltip renderers
  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="excel-tooltip" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Printer
    </Tooltip>
  );
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="collapse-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  return (
    <div className="page-wrapper">
      <div className={`content ${isSettingsLayout ? "settings-content" : ""}`}>
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <div className="d-flex gap-2 align-items-center">
                <h4>{title}</h4>
                {subtitle && <h6>({subtitle})</h6>}
              </div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-arrow mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="breadcrumb-item active">
                      <i className="fas fa-home"></i>
                    </Link>
                  </li>
                  {breadcrumbs.map((url, index) => (
                    <li key={index} className="breadcrumb-item">
                      <Link
                        to={url.redirect}
                        className={`text-decoration-none breadcrumb-item ${
                          index === breadcrumbs.length - 1 ? "active" : ""
                        }`}
                      >
                        {t(url.label)}
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
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
            {toolIcons.showPdf && (
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link>
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
            )}
            {toolIcons.showExcel && (
              <li>
                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <ImageWithBasePath
                      src="assets/img/icons/excel.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
            )}
            {toolIcons.showPrinter && (
              <li>
                <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <i data-feather="printer" className="feather-printer" />
                  </Link>
                </OverlayTrigger>
              </li>
            )}
            {toolIcons.showRefresh && (
              <li>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    onClick={onRefresh}
                  >
                    <RotateCcw />
                  </Link>
                </OverlayTrigger>
              </li>
            )}
            {toolIcons.showCollapse && (
              <li>
                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    id="collapse-header"
                    className={data ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setToogleHeader(!data));
                    }}
                  >
                    <ChevronUp />
                  </Link>
                </OverlayTrigger>
              </li>
            )}
            {actions?.onPrevious && (
              <li>
                <div className="page-btn">
                  <Button
                    onClick={actions?.onPrevious.onClick}
                    className="btn btn-secondary"
                  >
                    <ArrowLeft className="me-2" />
                    {actions?.onPrevious.text}
                  </Button>
                </div>
              </li>
            )}
          </ul>
          {/* append custom buttons here */}
          {actions?.customButtons &&
            actions?.customButtons.map((button, index) => (
              <div className="page-btn" key={index}>
                <Button className="btn btn-added" onClick={button.onClick}>
                  {button.icon} {button.text}
                </Button>
              </div>
            ))}
          {shouldShowAddButton() && (
            <div className="page-btn">
              <Button
                className="btn btn-added btn-md"
                onClick={actions?.addButton.onClick}
              >
                <PlusCircle className="me-2 iconsize" />
                {actions?.addButton.text}
              </Button>
            </div>
          )}
          {actions?.importButton && (
            <div className="page-btn import">
              <Button
                className="btn btn-added color btn-md"
                data-bs-toggle={
                  actions?.importButton.modalTarget ? "modal" : undefined
                }
                data-bs-target={actions?.importButton.modalTarget}
                onClick={actions?.importButton.onClick}
              >
                <Download className="me-2" />
                {"Import"}
              </Button>
            </div>
          )}
        </div>

        {isSettingsLayout ? (
          <div className="col-xl-12">
            <div className="settings-wrapper d-flex gap-4">
              <SettingsSidebar
                id="settings-sidebar"
                isMobileOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
              />
              {isFormLayout ? (
                <main className="settings-content-main w-100">
                  <div className="settings-page-wrap w-100">{children}</div>
                </main>
              ) : (
                children
              )}
            </div>
          </div>
        ) : (
          <div
            className={
              "card table-list-card " +
              (isFormLayout ? " form-layout-card" : "")
            }
          >
            <div className="card-body">
              {showFilter && filterContent && (
                <div
                  className="card visible"
                  id="filter_inputs"
                  style={{ display: "block" }}
                >
                  <div className="card-body p-0 px-3">{filterContent}</div>
                </div>
              )}
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ListPageLayout.propTypes = {
  breadcrumbs: PropTypes.array,
  isSettingsLayout: PropTypes.bool,
  isFormLayout: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.object,
  children: PropTypes.node.isRequired,
  toolIcons: PropTypes.shape({
    showPdf: PropTypes.bool,
    showExcel: PropTypes.bool,
    showPrinter: PropTypes.bool,
    showRefresh: PropTypes.bool,
    showCollapse: PropTypes.bool,
  }),
  onRefresh: PropTypes.func,
  filterContent: PropTypes.node,
  showFilter: PropTypes.bool,
};

export default ListPageLayout;
