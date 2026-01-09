// withEntityHandlers.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useMaterialReactTable } from "material-react-table";
import {
  Edit,
  Delete,
  Undo,
  Add,
  Security,
  FilterAltOutlined,
  MoreVert,
} from "@mui/icons-material";
import {
  IconButton,
  Popover,
  Paper,
  Button,
  Box,
  Typography,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { checkPermission } from "@/Router/PermissionRoute";

const withEntityHandlers = (WrappedComponent) => {
  function EntityHandlerComponent({
    api,
    module = null,
    columns,
    options = {},
    onAdd,
    onEdit,
    onPermissions,
    onDelete,
    onRestore,
    onApiRequest,
    service, // Service function (e.g., getUsers, getRoles) - auto-handles API requests
    customFilters, // << from parent modal
    onOpenCustomFilterModal,
    addButtonLabel,
    addButtonRoute,
    filterFormContent, // Custom filter form inputs (React node)
    onApplyFilters, // Callback when filters are applied
    ...props
  }) {
    const { t } = useTranslation();
    const permissions = useSelector((state) => state.auth?.permissions || []);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [localFilters, setLocalFilters] = useState(customFilters || {});
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    // State: Server-side state values
    const [data, setData] = useState([]);
    const [rowCount, setRowCount] = useState(0);

    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
    });

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    // Default config merge
    const merged = useMemo(
      () => ({
        customButtons: {
          add: checkPermission(permissions, module, "create"),
          edit: checkPermission(permissions, module, "update"),
          delete: checkPermission(permissions, module, "delete"),
          restore: checkPermission(permissions, module, "restore"),
          permissions: checkPermission(permissions, module, "permissions"),
          permissionsLabel: t("Permissions"),
          restoreLabel: "Restore",
          deleteLabel: options.customButtons?.deleteLabel || "Delete",
          ...options.customButtons,
        },
        tableSetting: { srNo: true, selectRow: true, ...options.tableSetting },
        pagination: { show: true, ...options.pagination },
      }),
      [options]
    );

    // ------------------------------
    // SERVER REQUEST HANDLER
    // ------------------------------
    const fetchData = async () => {
      setLoading(true);

      const requestPayload = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        search: globalFilter,
        sorting,
        columnFilters,
        filters: customFilters, // << injected from parent
      };

      try {
        let result;

        if (onApiRequest) {
          // Custom API request handler (highest priority)
          result = await onApiRequest(requestPayload);
        } else if (service && typeof service === "function") {
          // Auto-handle service function
          // Map requestPayload to service function parameters
          const params = {
            page: requestPayload.page || 1,
            pageSize: requestPayload.pageSize || 50,
            limit: requestPayload.pageSize || 50,
            search: requestPayload.search || "",
            sortBy: requestPayload.sorting?.[0]?.id || "updatedAt",
            order: requestPayload.sorting?.[0]?.desc ? "desc" : "asc",
            tab: requestPayload.filters?.tab || "all",
            id: requestPayload.filters?.id || "",
            includeCounts: true,
            ...requestPayload.filters, // Spread any additional filters from customFilters
          };

          const response = await service(params);

          // Handle nested response structure: response.data.list and response.data.pagination
          // Support both nested (data.list) and flat (list) response structures
          if (response?.data) {
            result = {
              list: response.data?.list || [],
              total:
                response.data?.pagination?.total || response.data?.total || 0,
              pagination: response.data?.pagination,
            };
          } else {
            // Fallback to flat structure
            result = {
              list: response?.list || [],
              total: response?.total || response?.count || 0,
              pagination: response?.pagination,
            };
          }
        } else if (api) {
          // Fallback to API URL with fetch
          const res = await fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestPayload),
          });
          const response = await res.json();

          // Handle nested response structure
          if (response?.data) {
            result = {
              list: response.data?.list || [],
              total:
                response.data?.pagination?.total || response.data?.total || 0,
              pagination: response.data?.pagination,
            };
          } else {
            result = response;
          }
        } else {
          result = { list: [], total: 0 };
        }

        // Extract data and total count, supporting both nested and flat structures
        const dataList = result?.data?.list || result?.list || [];
        const totalCount =
          result?.data?.pagination?.total ||
          result?.data?.total ||
          result?.pagination?.total ||
          result?.total ||
          result?.count ||
          0;

        setData(Array.isArray(dataList) ? dataList : []);
        setRowCount(typeof totalCount === "number" ? totalCount : 0);
      } catch (err) {
        console.error("API ERROR:", err);
        setData([]);
        setRowCount(0);
      }

      setLoading(false);
    };

    // Fire API call whenever server-side state changes
    useEffect(() => {
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination, sorting, columnFilters, globalFilter, customFilters]);

    // Sync local filters with customFilters prop
    useEffect(() => {
      setLocalFilters(customFilters || {});
    }, [customFilters]);

    // Handle filter button click - toggle popover (tooltip-like behavior)
    const handleFilterButtonClick = (event) => {
      event.stopPropagation(); // Prevent event bubbling
      if (onOpenCustomFilterModal) {
        // If external handler is provided, use it
        onOpenCustomFilterModal(event);
      } else if (filterFormContent) {
        // Toggle popover - close if already open, open if closed
        if (filterAnchorEl) {
          setFilterAnchorEl(null);
        } else {
          setFilterAnchorEl(event.currentTarget);
        }
      }
    };

    // Handle filter close
    const handleFilterClose = () => {
      setFilterAnchorEl(null);
    };

    // Handle filter apply
    const handleFilterApply = () => {
      if (onApplyFilters) {
        onApplyFilters(localFilters);
      }
      handleFilterClose();
    };

    // Handle filter reset
    const handleFilterReset = () => {
      const emptyFilters = {};
      setLocalFilters(emptyFilters);
      if (onApplyFilters) {
        onApplyFilters(emptyFilters);
      }
      handleFilterClose();
    };

    // Handle menu open
    const handleMenuOpen = useCallback((event, row) => {
      event.stopPropagation();
      setMenuAnchorEl(event.currentTarget);
      setSelectedRow(row);
    }, []);

    // Handle menu close
    const handleMenuClose = () => {
      setMenuAnchorEl(null);
      setSelectedRow(null);
    };

    // Handle edit from menu
    const handleMenuEdit = () => {
      if (selectedRow && onEdit) {
        onEdit(selectedRow.original);
      }
      handleMenuClose();
    };

    // Handle delete from menu
    const handleMenuDelete = () => {
      if (selectedRow && onDelete) {
        Swal.fire({
          title: "Are you sure you want to delete?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            onDelete(selectedRow.original);
          }
          handleMenuClose();
        });
        return; // prevent continuing to onDelete below until confirmed
      }
      handleMenuClose();
    };

    // Handle restore from menu
    const handleMenuRestore = () => {
      if (selectedRow && onRestore) {
        onRestore(selectedRow.original);
      }
      handleMenuClose();
    };

    // Handle permissions from menu
    const handleMenuPermissions = () => {
      if (selectedRow && onPermissions) {
        onPermissions(selectedRow.original);
      }
      handleMenuClose();
    };

    // Helper function to evaluate button visibility (supports both boolean and function)
    const shouldShowButton = useCallback((buttonConfig, rowData) => {
      if (typeof buttonConfig === "function") {
        // Only call the function if rowData is available, otherwise return false
        if (rowData === undefined || rowData === null) {
          return false;
        }
        return buttonConfig(rowData);
      }
      return Boolean(buttonConfig);
    }, []);

    // TABLE COLUMNS WITH SR NO + ACTION
    const finalColumns = useMemo(() => {
      const cols = Array.isArray(columns) ? [...columns] : [];

      if (merged.tableSetting.srNo) {
        cols.unshift({
          id: "srNo",
          header: "Sr",
          size: 60,
          Cell: ({ row }) =>
            pagination.pageIndex * pagination.pageSize + row.index + 1,
        });
      }

      // Show actions column if any button is enabled (check with a sample row to support functions)
      const hasAnyButton = () => {
        // Check if any button is enabled (either boolean true or function exists)
        return (
          merged.customButtons.edit ||
          merged.customButtons.delete ||
          merged.customButtons.restore ||
          merged.customButtons.permissions
        );
      };

      if (hasAnyButton()) {
        cols.push({
          id: "actions",
          header: "Actions",
          size: 100,
          Cell: ({ row }) => {
            // Check if this row should show any action buttons
            const rowData = row.original;
            const showAnyAction =
              shouldShowButton(merged.customButtons.edit, rowData) ||
              shouldShowButton(merged.customButtons.delete, rowData) ||
              shouldShowButton(merged.customButtons.restore, rowData) ||
              shouldShowButton(merged.customButtons.permissions, rowData);

            if (!showAnyAction) {
              return null;
            }

            return (
              <IconButton
                onClick={(e) => handleMenuOpen(e, row)}
                size="small"
                aria-label="more actions"
              >
                <MoreVert />
              </IconButton>
            );
          },
        });
      }

      return cols;
    }, [
      columns,
      pagination.pageIndex,
      pagination.pageSize,
      merged,
      handleMenuOpen,
      shouldShowButton,
    ]);

    // MATERIAL REACT TABLE CONFIG
    const table = useMaterialReactTable({
      columns: finalColumns,
      data,
      rowCount,

      manualPagination: true,
      manualSorting: true,
      manualFiltering: true,
      manualGlobalFilter: true,

      state: {
        isLoading: loading,
        pagination,
        sorting,
        columnFilters,
        globalFilter,
      },

      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      onGlobalFilterChange: setGlobalFilter,
      onColumnFiltersChange: setColumnFilters,

      // Styling
      muiTablePaperProps: {
        elevation: 0,
        sx: {
          width: "100%",
          border: merged.tableSetting.onlyTopBorder
            ? "unset"
            : "1px solid #ccc",
          borderTop: merged.tableSetting.onlyTopBorder
            ? "1px solid #ccc"
            : "1px solid #ccc",
          borderRadius: merged.tableSetting.onlyTopBorder ? "0" : "8px",
        },
      },
      muiTableContainerProps: {
        sx: {
          width: "100%",
          maxHeight: "460px",
        },
      },
      muiTableProps: {
        sx: {
          width: "100%",
        },
      },
      muiTableHeadCellProps: {
        sx: {
          border: "1px solid #ddd",
          backgroundColor: "#f7f7f7",
        },
      },
      muiTableBodyCellProps: {
        sx: {
          border: "1px solid #eee",
        },
      },

      // Features
      enableColumnFilters: true,
      enablePagination: true,
      enableSorting: true,
      enableGlobalFilter: true,
      enableColumnPinning: true,
      enableStickyHeader: true,
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSelectAll: true,
      enableDensityToggle: false,

      // Initial state
      initialState: {
        density: "compact",
        pagination: {
          pageSize: 10,
        },
        columnPinning: {
          right: ["actions"],
        },
        showColumnFilters: false,
      },

      // Pagination
      paginationDisplayMode: "default",

      // Custom toolbar
      renderTopToolbarCustomActions: () => (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {merged.customButtons.add && (addButtonRoute || onAdd) && (
            <div className="page-header justify-content-end mb-0">
              <div className="page-btn m-0">
                {addButtonRoute ? (
                  <Link
                    to={addButtonRoute}
                    className="btn btn-added gap-1"
                    style={{ padding: ".3rem .6rem", borderRadius: 5 }}
                  >
                    <Add />
                    {addButtonLabel || t("Add")}
                  </Link>
                ) : (
                  <button
                    className="btn btn-added gap-1"
                    style={{ padding: ".3rem .6rem", borderRadius: 5 }}
                    onClick={onAdd}
                  >
                    <Add />
                    {addButtonLabel || t("Add")}
                  </button>
                )}
              </div>
            </div>
          )}

          {(onOpenCustomFilterModal || filterFormContent) && (
            <IconButton onClick={handleFilterButtonClick}>
              <FilterAltOutlined />
            </IconButton>
          )}
        </div>
      ),
    });

    return (
      <>
        {filterFormContent && (
          <Popover
            open={Boolean(filterAnchorEl)}
            anchorEl={filterAnchorEl}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            disableRestoreFocus
            disableAutoFocus
            disableEnforceFocus
            PaperProps={{
              sx: {
                mt: 1.5,
                width: "100%",
                maxWidth: "600px",
                minWidth: "400px",
                // borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-8px",
                  left: "20px",
                  width: 0,
                  height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "8px solid rgba(0,0,0,0.1)",
                  zIndex: 1,
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "-7px",
                  left: "20px",
                  width: 0,
                  height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "8px solid #fff",
                  zIndex: 2,
                },
              },
            }}
            TransitionProps={{
              timeout: 200,
            }}
            onClick={(e) => {
              // Prevent closing when clicking inside the popover
              e.stopPropagation();
            }}
          >
            <Paper
              sx={{
                p: 3,
                width: "100%",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Custom Filters
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {typeof filterFormContent === "function"
                  ? filterFormContent({
                      filters: localFilters,
                      setFilters: setLocalFilters,
                    })
                  : filterFormContent}
              </Box>

              <Divider sx={{ mt: 3, mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  onClick={handleFilterReset}
                  color="secondary"
                  size="small"
                >
                  Reset
                </Button>
                <Button onClick={handleFilterClose} size="small">
                  Close
                </Button>
                <Button
                  onClick={handleFilterApply}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Apply
                </Button>
              </Box>
            </Paper>
          </Popover>
        )}

        {(shouldShowButton(merged.customButtons.edit, selectedRow?.original) ||
          shouldShowButton(
            merged.customButtons.delete,
            selectedRow?.original
          ) ||
          shouldShowButton(
            merged.customButtons.restore,
            selectedRow?.original
          ) ||
          shouldShowButton(
            merged.customButtons.permissions,
            selectedRow?.original
          )) && (
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {shouldShowButton(
              merged.customButtons.permissions,
              selectedRow?.original
            ) && (
              <MenuItem onClick={handleMenuPermissions}>
                <ListItemIcon>
                  <Security fontSize="small" className="text-primary" />
                </ListItemIcon>
                <ListItemText>{t("Permissions")}</ListItemText>
              </MenuItem>
            )}

            {shouldShowButton(
              merged.customButtons.edit,
              selectedRow?.original
            ) && (
              <MenuItem onClick={handleMenuEdit}>
                <ListItemIcon>
                  <Edit fontSize="small" className="text-primary" />
                </ListItemIcon>
                <ListItemText>{t("Edit")}</ListItemText>
              </MenuItem>
            )}

            {shouldShowButton(
              merged.customButtons.restore,
              selectedRow?.original
            ) && (
              <MenuItem onClick={handleMenuRestore}>
                <ListItemIcon>
                  <Undo fontSize="small" className="text-primary" />
                </ListItemIcon>
                <ListItemText>
                  {t(merged.customButtons.restoreLabel)}
                </ListItemText>
              </MenuItem>
            )}

            {shouldShowButton(
              merged.customButtons.delete,
              selectedRow?.original
            ) && (
              <MenuItem onClick={handleMenuDelete}>
                <ListItemIcon>
                  <Delete fontSize="small" className="text-danger" />
                </ListItemIcon>
                <ListItemText>
                  {t(merged.customButtons.deleteLabel)}
                </ListItemText>
              </MenuItem>
            )}
          </Menu>
        )}

        <WrappedComponent
          table={table}
          showAddButton={merged.customButtons.add}
          onAdd={onAdd}
          onOpenCustomFilterModal={onOpenCustomFilterModal}
          showColumnSettings={true}
          {...props}
        />
      </>
    );
  }

  EntityHandlerComponent.displayName = `withEntityHandlers(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return EntityHandlerComponent;
};

export default withEntityHandlers;
