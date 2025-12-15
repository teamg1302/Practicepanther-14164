import React from "react";
import { Chip } from "@mui/material";

/**
 * Reusable table columns configuration component
 * Accepts pure JSON array configuration and returns formatted columns for MaterialReactTable
 *
 * @param {Array} columnConfig - Array of column configuration objects (pure JSON)
 * @param {Object} options - Additional options for column rendering
 * @returns {Array} Formatted columns array for MaterialReactTable
 *
 * @example
 * const columns = getTableColumns([
 *   { header: "Name", accessorKey: "name" },
 *   { header: "Email", accessorKey: "email" },
 *   {
 *     header: "Status",
 *     accessorKey: "isActive",
 *     type: "chip",
 *     chipMap: { true: { label: "Active", color: "success" }, false: { label: "Inactive", color: "error" } }
 *   },
 *   { header: "Created At", accessorKey: "createdAt", type: "date" },
 *   { header: "Role", accessorKey: "roleId", type: "nested" }
 * ]);
 */
export const getTableColumns = (columnConfig = [], options = {}) => {
  const {
    defaultProps = {
      enableColumnFilter: true,
      enablePinning: true,
    },
    navigate,
  } = options;

  return columnConfig.map((config) => {
    const {
      header,
      accessorKey,
      type,
      chipMap,
      dateFormat,
      fallback = "-",
      size,
      detailRoute,
      idKey = "_id",
      onClick,
      ...restConfig
    } = config;

    const baseColumn = {
      header,
      accessorKey,
      ...defaultProps,
      ...restConfig,
    };

    // Add size if provided
    if (size) {
      baseColumn.size = size;
    }

    // Handle clickable columns (detail navigation)
    const isClickable = detailRoute || onClick;
    const originalCell = baseColumn.Cell;

    // Handle different column types
    if (type === "chip" && chipMap) {
      // Chip renderer for status/boolean fields
      baseColumn.Cell = ({ cell }) => {
        const value = cell.getValue();
        const chip = chipMap[value] || chipMap.default;
        if (chip) {
          return <Chip label={chip.label} color={chip.color} size="small" />;
        }
        return fallback;
      };
    } else if (type === "date") {
      // Date renderer
      baseColumn.Cell = ({ cell }) => {
        const value = cell.getValue();
        if (value) {
          if (dateFormat === "time") {
            return new Date(value).toLocaleTimeString();
          } else if (dateFormat === "datetime") {
            return new Date(value).toLocaleString();
          }
          return new Date(value).toLocaleDateString();
        }
        return fallback;
      };
    } else if (type === "nested") {
      // Nested object renderer (e.g., roleId.name, timezoneId.name)
      baseColumn.Cell = ({ cell, row }) => {
        const value = cell.getValue();
        if (value && typeof value === "object") {
          return value.name || value.title || value.label || fallback;
        }
        // Fallback to row.original if needed (e.g., roleId -> role.name)
        const fallbackKey = accessorKey.replace("Id", "");
        const fallbackObj = row.original?.[fallbackKey];
        return fallbackObj?.name || fallbackObj?.title || fallback;
      };
    } else if (type === "tags") {
      // Tags renderer - expects array of objects with { _id, name, color }
      baseColumn.Cell = ({ cell }) => {
        const value = cell.getValue();
        if (!value || !Array.isArray(value) || value.length === 0) {
          return fallback;
        }
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {value.map((tag) => {
              if (!tag || typeof tag !== "object") return null;
              const tagName = tag.name || tag.label || String(tag);
              const tagColor = tag.color || "#6c757d";
              return (
                <span
                  key={tag._id || tag.id || tagName}
                  className="badge badge-sm"
                  style={{
                    backgroundColor: tagColor,
                    color: "#ffffff",
                  }}
                >
                  {tagName}
                </span>
              );
            })}
          </div>
        );
      };
    } else {
      // Default renderer - show value or fallback
      baseColumn.Cell = ({ cell }) => {
        const value = cell.getValue();
        return value !== null && value !== undefined && value !== ""
          ? String(value)
          : fallback;
      };
    }

    // Wrap Cell with click handler if detailRoute or onClick is provided
    if (isClickable) {
      const originalCellRenderer = baseColumn.Cell;
      baseColumn.Cell = ({ cell, row }) => {
        const value = originalCellRenderer ? originalCellRenderer({ cell, row }) : cell.getValue();
        
        const handleClick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (onClick && typeof onClick === "function") {
            onClick(row.original);
          } else if (detailRoute && navigate) {
            const id = row.original[idKey] || row.original._id;
            if (id) {
              // Extract parameter name from route (e.g., :contactId -> contactId)
              // Replace all parameter patterns in the route
              let route = detailRoute;
              const paramMatches = route.match(/:(\w+)/g);
              if (paramMatches) {
                paramMatches.forEach((param) => {
                  const paramName = param.substring(1); // Remove the :
                  // Try to find the value in row.original using the param name or _id
                  const paramValue = row.original[paramName] || row.original._id || id;
                  route = route.replace(param, paramValue);
                });
              } else {
                // Fallback: replace :id if no specific parameter found
                route = route.replace(":id", id);
              }
              navigate(route);
            }
          }
        };

        return (
          <span
            onClick={handleClick}
            style={{
              cursor: "pointer",
              color: "#1976d2",
              textDecoration: "underline",
            }}
          >
            {value}
          </span>
        );
      };
    }

    return baseColumn;
  });
};

export default getTableColumns;
