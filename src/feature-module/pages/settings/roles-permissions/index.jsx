import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";
import Swal from "sweetalert2";

import { all_routes } from "@/Router/all_routes";
import { getRoles, deleteRole } from "@/core/services/roleService";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import ListPageLayout from "@/feature-module/components/list-page-layout";

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

  const handleRefresh = () => {
    setCustomFilters((prev) => ({
      ...prev,
      _refresh: Date.now(),
    }));
  };

  const showEditButton = (row) => {
    if (row.name === "Firm Owner") {
      return false;
    }
    return true;
  };

  const showDeleteButton = (row) => {
    if (row.name === "Firm Owner") {
      return false;
    }
    return true;
  };

  return (
    <ListPageLayout
      breadcrumbs={[
        {
          label: "Settings",
          redirect: all_routes.settings[0].path,
        },
        {
          label: "Roles & Permissions",
          redirect: "#",
        },
      ]}
      isSettingsLayout={true}
      title={t("Roles & Permissions")}
      subtitle="Manage your roles and permissions"
      toolIcons={{
        showRefresh: true,
        showExcel: true,
      }}
      actions={{
        addButton: {
          text: route.addRolePermission.text,
          onClick: () => {
            navigate(route.addRolePermission.path);
          },
        },
        importButton: {
          onClick: () => {
            console.log("Import clicked");
          },
        },
      }}
      onRefresh={handleRefresh}
    >
      <EnhancedList
        columns={columns}
        onEdit={handleEdit}
        customFilters={customFilters}
        onDelete={handleDelete}
        addButtonLabel={t("formButton.addNew")}
        service={getRoles}
        options={{
          customButtons: {
            edit: true,
            delete: showDeleteButton,
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
export default RolePermissionList;
