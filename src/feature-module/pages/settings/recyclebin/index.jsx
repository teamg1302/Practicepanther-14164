import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { all_routes } from "@/Router/all_routes";
import {
  getRecyclebin,
  deleteRecycleBin,
} from "@/core/services/recyclebinService";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import { getTableColumns } from "@/feature-module/components/table-columns";

// Columns definition - Pure JSON configuration (srNo and actions are added by withEntityHandlers)
const COLUMNS_CONFIG = [
  { header: "Name", accessorKey: "itemName" },
  { header: "Type", accessorKey: "itemType" },
  { header: "Type", accessorKey: "itemType" },
  { header: "Deleted At", accessorKey: "deletedAt", type: "date" },
  { header: "Deleted At", accessorKey: "deletedAt", type: "date" },
];

const RecycleBin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const route = all_routes;
  const [customFilters, setCustomFilters] = useState({});

  // Generate columns from JSON config
  const columns = useMemo(() => getTableColumns(COLUMNS_CONFIG), []);

  const handleEdit = (row) => {
    navigate(route.editUser.replace(":userId", row._id));
  };

  const handleDelete = async (row) => {
    try {
      await deleteRecycleBin(row._id);
      Swal.fire({
        title: "Success",
        text: "Row deleted successfully",
        icon: "success",
      });
      // Trigger refresh by updating customFilters with timestamp
      setCustomFilters((prev) => ({
        ...prev,
        _refresh: Date.now(),
      }));
    } catch (error) {
      console.log("Error deleting row:", error);
      Swal.fire({
        title: "Error",
        text: error?.message || "Failed to delete item",
        icon: "error",
      });
    }
  };

  return (
    <EnhancedList
      columns={columns}
      customFilters={customFilters}
      onEdit={handleEdit}
      onDelete={handleDelete}
      addButtonRoute={route.addUser}
      addButtonLabel={t("Add")}
      service={getRecyclebin}
      options={{
        customButtons: {
          add: false,
          edit: false,
          delete: true,
          restore: true,
          restoreLabel: "Restore",
          deleteLabel: "Delete Permanently",
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
