/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { Table } from "antd";

const Datatable = ({
  props,
  columns,
  dataSource,
  scroll,
  pagination,
  rowKey,
  ...restProps
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Calculate scroll.x if not provided and columns have fixed columns or many columns
  const calculatedScroll = useMemo(() => {
    // If scroll is explicitly provided, use it
    if (scroll !== undefined) {
      return scroll;
    }

    // Check if any column has fixed property
    const hasFixedColumns = columns?.some((col) => col.fixed);

    // Calculate total width of all columns
    const totalWidth =
      columns?.reduce((sum, col) => {
        const colWidth = col.width || 150; // Default width for columns without explicit width
        return sum + colWidth;
      }, 0) || 0;

    // If there are fixed columns, scroll.x is required for them to work
    // Also enable scroll if total width exceeds a reasonable threshold
    if (hasFixedColumns || totalWidth > 1200) {
      return {
        x: totalWidth,
      };
    }

    // Return undefined to use default Ant Design behavior
    return undefined;
  }, [columns, scroll]);

  // Determine rowKey - use provided one, or fallback to id/key
  const getRowKey = useMemo(() => {
    if (rowKey) {
      return rowKey;
    }
    // Default: try id, then key as string property names
    // Ant Design supports string rowKey that references a property
    if (dataSource && dataSource.length > 0) {
      const firstRecord = dataSource[0];
      if (firstRecord && typeof firstRecord === "object") {
        if (firstRecord.id !== undefined) {
          return "id";
        }
        if (firstRecord.key !== undefined) {
          return "key";
        }
      }
    }
    // If neither id nor key exists, create a function that generates a unique key
    // from the record's values (without using index)
    return (record) => {
      if (record && typeof record === "object") {
        // Try id or key first
        if (record.id !== undefined) return record.id;
        if (record.key !== undefined) return record.key;
        // Generate a hash-like key from record values
        const values = Object.values(record).filter((v) => v != null);
        return values.join("_") || JSON.stringify(record);
      }
      // Last resort: use JSON string of the record
      return JSON.stringify(record);
    };
  }, [rowKey, dataSource]);

  return (
    <Table
      key={props}
      className="table datanew dataTable no-footer"
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataSource}
      rowKey={getRowKey}
      scroll={calculatedScroll}
      pagination={pagination}
      {...restProps}
    />
  );
};

export default Datatable;
