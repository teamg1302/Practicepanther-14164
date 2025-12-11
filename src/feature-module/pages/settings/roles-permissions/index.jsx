import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";
import Swal from "sweetalert2";
import { all_routes } from "@/Router/all_routes";
import { getRoles, deleteRole } from "@/core/services/roleService";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";

const RolePermissionList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [customFilters, setCustomFilters] = useState({});
  const route = all_routes;

  // Columns definition (srNo and actions are added by withEntityHandlers)
  const columns = useMemo(
    () => [
      {
        header: "Role",
        accessorKey: "name",
        enableColumnFilter: true,
        enablePinning: true,
      },
      {
        header: "Description",
        accessorKey: "description",
        enableColumnFilter: true,
        enablePinning: true,
        Cell: ({ cell }) => cell.getValue() || "-",
      },
      {
        header: "Status",
        accessorKey: "isActive",
        enableColumnFilter: true,
        enablePinning: true,
        Cell: ({ cell }) => {
          const isActive = cell.getValue();
          const value = isActive ? "Active" : "Inactive";
          const color = isActive ? "success" : "error";
          return <Chip label={value} color={color} size="small" />;
        },
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        enableColumnFilter: true,
        enablePinning: true,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value ? new Date(value).toLocaleDateString() : "-";
        },
      },
      {
        header: "Updated At",
        accessorKey: "updatedAt",
        enableColumnFilter: true,
        enablePinning: true,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value ? new Date(value).toLocaleDateString() : "-";
        },
      },
    ],
    []
  );

  const handleEdit = (row) => {
    navigate(route.editRolePermission.path.replace(":roleId", row._id));
  };

  const handleDelete = async (row) => {
    try {
      await deleteRole(row._id);
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

  return (
    <EnhancedList
      columns={columns}
      onEdit={handleEdit}
      customFilters={customFilters}
      onDelete={handleDelete}
      addButtonRoute={route.addRolePermission.path}
      addButtonLabel={t("formButton.addNew")}
      service={getRoles}
      options={{
        customButtons: {
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
export default RolePermissionList;
