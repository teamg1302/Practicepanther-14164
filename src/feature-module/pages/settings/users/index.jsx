import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { all_routes } from "@/Router/all_routes";
import { getUsers, deleteUser } from "@/core/services/userService";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import { getTableColumns } from "@/feature-module/components/table-columns";

// Columns definition - Pure JSON configuration (srNo and actions are added by withEntityHandlers)
const COLUMNS_CONFIG = [
  { header: "Name", accessorKey: "name" },
  { header: "Email", accessorKey: "email" },
  { header: "Phone", accessorKey: "mobile" },
  { header: "Role", accessorKey: "roleId", type: "nested" },
  { header: "Timezone", accessorKey: "timezoneId", type: "nested" },
  {
    header: "Status",
    accessorKey: "isActive",
    type: "chip",
    chipMap: {
      true: { label: "Active", color: "success" },
      false: { label: "Inactive", color: "error" },
    },
  },
  { header: "Created At", accessorKey: "createdAt", type: "date" },
  { header: "Updated At", accessorKey: "updatedAt", type: "date" },
  { header: "Last Login", accessorKey: "lastLogin", type: "date" },
];

const Users = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth?.user?.id);
  const { t } = useTranslation();
  const route = all_routes;
  const [customFilters, setCustomFilters] = useState({});

  // Generate columns from JSON config
  const columns = useMemo(() => getTableColumns(COLUMNS_CONFIG), []);

  const handleDelete = async (row) => {
    try {
      if (row._id === userId) {
        Swal.fire({
          title: "Error",
          text: "You cannot delete your own account",
          icon: "error",
        });
        return;
      }

      await deleteUser(row._id);
      Swal.fire({
        title: "Success",
        text: "Row deleted successfully",
        icon: "success",
      });
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

  const onEdit = (row) => {
    navigate(route.editUser.path.replace(":userId", row._id));
  };

  const onPermissions = (row) => {
    navigate(route.editUserPermissions.path.replace(":userId", row._id));
  };

  return (
    <EnhancedList
      columns={columns}
      customFilters={customFilters}
      onDelete={handleDelete}
      onPermissions={onPermissions}
      onEdit={onEdit}
      addButtonRoute={route.addUser.path}
      addButtonLabel={t("Add")}
      service={getUsers}
      options={{
        customButtons: {
          permissions: true,
          add: true,
          edit: true,
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
export default Users;
