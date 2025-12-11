import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import PropTypes from "prop-types";
import {
  ChevronUp,
  PlusCircle,
  RotateCcw,
  Download,
} from "feather-icons-react/build/IconComponents";
import { setToogleHeader } from "@/core/redux/action";
import ImageWithBasePath from "@/core/img/imagewithbasebath";
import { checkPermission } from "@/Router/PermissionRoute";

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
  title,
  subtitle,
  children,
  addButton,
  importButton,
  toolIcons = {
    showPdf: true,
    showExcel: true,
    showPrinter: true,
    showRefresh: true,
    showCollapse: true,
  },
  onRefresh,
  filterContent,
  showFilter = false,
}) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const permissions = useSelector((state) => state.auth?.permissions || []);

  // Check if addButton should be shown based on permissions
  const shouldShowAddButton = () => {
    if (!addButton) return false;

    // If no module or permission specified, show the button
    if (!addButton.module || !addButton.permission) {
      return true;
    }

    // Check if user has permission
    return checkPermission(permissions, addButton.module, addButton.permission);
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
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>{title}</h4>
              {subtitle && <h6>{subtitle}</h6>}
            </div>
          </div>
          <ul className="table-top-head">
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
          </ul>
          {shouldShowAddButton() && (
            <div className="page-btn">
              <Link to={addButton.path} className="btn btn-added">
                <PlusCircle className="me-2 iconsize" />
                {addButton.text}
              </Link>
            </div>
          )}
          {importButton && (
            <div className="page-btn import">
              <Link
                to={importButton.path || "#"}
                className="btn btn-added color"
                data-bs-toggle={importButton.modalTarget ? "modal" : undefined}
                data-bs-target={importButton.modalTarget}
                onClick={importButton.onClick}
              >
                {importButton.icon || <Download className="me-2" />}
                {importButton.text || "Import"}
              </Link>
            </div>
          )}
        </div>

        <div className="card table-list-card">
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
      </div>
    </div>
  );
};

ListPageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  addButton: PropTypes.shape({
    path: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.node,
    module: PropTypes.string,
    permission: PropTypes.string,
  }),
  importButton: PropTypes.shape({
    path: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.node,
    modalTarget: PropTypes.string,
    onClick: PropTypes.func,
  }),
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
