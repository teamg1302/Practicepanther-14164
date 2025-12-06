// EntityListView.jsx
import React from "react";
import { MaterialReactTable } from "material-react-table";
import ColumnSettings from "@/feature-module/components/column-settings";

const EntityListView = ({ table, showColumnSettings }) => {
  // Enhance table with column settings if needed
  const enhancedTable = React.useMemo(() => {
    if (!table) return null;
    if (!showColumnSettings) return table;

    // Get existing custom actions from table
    const existingCustomActions = table.renderTopToolbarCustomActions;

    return {
      ...table,
      renderTopToolbarCustomActions: ({ table: tableInstance }) => {
        const existingActions = existingCustomActions
          ? existingCustomActions({ table: tableInstance })
          : null;

        return (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {existingActions}
            {showColumnSettings && <ColumnSettings table={tableInstance} />}
          </div>
        );
      },
    };
  }, [table, showColumnSettings]);

  if (!enhancedTable && !table) return null;

  return (
    <div className="settings-content-main table-wrapper w-100">
      <MaterialReactTable table={enhancedTable || table} />
    </div>
  );
};

export default EntityListView;
