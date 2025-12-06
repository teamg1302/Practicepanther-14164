// withEntityHandlers.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useMaterialReactTable } from "material-react-table";
import { Edit, Delete, Add, FilterAltOutlined } from "@mui/icons-material";
import {
  IconButton,
  Popover,
  Paper,
  Button,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const withEntityHandlers = (WrappedComponent) => {
  function EntityHandlerComponent({
    api,
    columns,
    options = {},
    onAdd,
    onEdit,
    onDelete,
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
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [localFilters, setLocalFilters] = useState(customFilters || {});
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
          add: true,
          edit: true,
          delete: true,
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

      if (merged.customButtons.edit || merged.customButtons.delete) {
        cols.push({
          id: "actions",
          header: "Actions",
          size: 100,
          Cell: ({ row }) => (
            <div style={{ display: "flex", gap: 8 }}>
              {merged.customButtons.edit && (
                <IconButton
                  onClick={() => onEdit?.(row.original)}
                  size="small"
                  className="text-primary p-0"
                >
                  <Edit />
                </IconButton>
              )}
              {merged.customButtons.delete && (
                <IconButton
                  onClick={() => onDelete?.(row.original)}
                  size="small"
                  className="text-danger p-0"
                >
                  <Delete />
                </IconButton>
              )}
            </div>
          ),
        });
      }

      return cols;
    }, [
      columns,
      pagination.pageIndex,
      pagination.pageSize,
      merged,
      onEdit,
      onDelete,
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

      // Container
      muiTableContainerProps: {
        sx: { maxHeight: "460px" },
      },

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
