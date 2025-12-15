import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { all_routes } from "@/Router/all_routes";
import {
  getRecyclebin,
  deleteRecycleBin,
  restoreRecycleBin,
} from "@/core/services/recyclebinService";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import { getTableColumns } from "@/feature-module/components/table-columns";
import ListPageLayout from "@/feature-module/components/list-page-layout";

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
  const [customFilters, setCustomFilters] = useState({});

  // Generate columns from JSON config
  const columns = useMemo(() => getTableColumns(COLUMNS_CONFIG), []);

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

  const handleRefresh = () => {
    setCustomFilters((prev) => ({
      ...prev,
      _refresh: Date.now(),
    }));
  };

  const handleRestore = async (row) => {
    try {
      await restoreRecycleBin(row._id);
      Swal.fire({
        title: "Success",
        text: "Row restored successfully",
        icon: "success",
      });
      handleRefresh();
    } catch (error) {
      console.log("Error restoring row:", error);
      Swal.fire({
        title: "Error",
        text: error?.message || "Failed to restore item",
        icon: "error",
      });
    }
  };
  return (
    <ListPageLayout
      isSettingsLayout={true}
      title={t("Recycle Bin")}
      subtitle="Manage your deleted items"
      toolIcons={{
        showRefresh: true,
        showExcel: true,
      }}
      onRefresh={handleRefresh}
    >
      <EnhancedList
        columns={columns}
        customFilters={customFilters}
        onDelete={handleDelete}
        onRestore={handleRestore}
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
    </ListPageLayout>
  );
};

const EnhancedList = withEntityHandlers(EntityListView);
export default RecycleBin;
