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
    } else {
      // Default renderer - show value or fallback
      baseColumn.Cell = ({ cell }) => {
        const value = cell.getValue();
        return value !== null && value !== undefined && value !== ""
          ? String(value)
          : fallback;
      };
    }

    return baseColumn;
  });
};

export default getTableColumns;
