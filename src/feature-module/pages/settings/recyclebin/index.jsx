import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { all_routes } from "@/Router/all_routes";
import { getRecyclebin } from "@/core/services/recyclebinService";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import { getTableColumns } from "@/feature-module/components/table-columns";

// Columns definition - Pure JSON configuration (srNo and actions are added by withEntityHandlers)
const COLUMNS_CONFIG = [
  { header: "Name", accessorKey: "name" },
  { header: "Created At", accessorKey: "createdAt", type: "date" },
  { header: "Updated At", accessorKey: "updatedAt", type: "date" },
];

const RecycleBin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const route = all_routes;
  const [customFilters, setCustomFilters] = useState({});

  // Generate columns from JSON config
  const columns = useMemo(() => getTableColumns(COLUMNS_CONFIG), []);

  const handleApplyFilters = (filters) => {
    setCustomFilters(filters);
  };

  const handleAdd = () => {
    navigate(route.addUser);
  };

  const handleEdit = (row) => {
    navigate(route.editUser.replace(":userId", row._id));
  };

  const handleDelete = (row) => {
    console.log("Delete row:", row);
    // TODO: Implement delete functionality
  };

  // Filter form content - only the inputs
  const filterFormContent = ({ filters, setFilters }) => (
    <>
      <TextField
        fullWidth
        label="Role"
        placeholder="Filter by role"
        value={filters.role || ""}
        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        size="small"
      />

      <FormControl fullWidth size="small">
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status || ""}
          label="Status"
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Tab"
        placeholder="Filter by tab"
        value={filters.tab || ""}
        onChange={(e) => setFilters({ ...filters, tab: e.target.value })}
        size="small"
      />
    </>
  );

  return (
    <EnhancedList
      columns={columns}
      customFilters={customFilters}
      onEdit={handleEdit}
      onDelete={handleDelete}
      addButtonRoute={route.addUser}
      addButtonLabel={t("Add")}
      service={getRecyclebin}
      // filterFormContent={filterFormContent}
      // onApplyFilters=
      // {handleApplyFilters}
      options={{
        customButtons: {
          add: false,
          edit: false,
          delete: true,
        },
        tableSetting: {
          srNo: true,
          selectRow: true,
        },
      }}
    />
  );
};

const EnhancedList = withEntityHandlers(EntityListView);
export default RecycleBin;
