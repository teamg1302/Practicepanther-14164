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
import ListPageLayout from "@/feature-module/components/list-page-layout";
import { useIsOwner } from "@/core/utilities/utility";

/**
 * Users management page component.
 * @module feature-module/pages/settings/users
 *
 * Provides a list view of users with:
 * - Conditional action buttons based on row data (edit, delete, permissions)
 * - User filtering and pagination
 * - Role-based access control
 * - Owner-specific permissions
 */

// Columns definition - Pure JSON configuration (srNo and actions are added by withEntityHandlers)
const COLUMNS_CONFIG = [
  { header: "Name", accessorKey: "name" },
  { header: "Email", accessorKey: "email" },
  { header: "Phone", accessorKey: "phone" },
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

/**
 * Users component for managing users list.
 * @component
 * @returns {JSX.Element} Users management page
 *
 * @example
 * <Users />
 */
const Users = () => {
  const isOwner = useIsOwner();
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

  const handleRefresh = () => {
    setCustomFilters((prev) => ({
      ...prev,
      _refresh: Date.now(),
    }));
  };

  return (
    <ListPageLayout
      breadcrumbs={[
        {
          label: "Settings",
          redirect: all_routes.settings[0].path,
        },
        {
          label: "Users",
          redirect: "#",
        },
      ]}
      isSettingsLayout={true}
      title={t("Users")}
      subtitle="Manage your users"
      toolIcons={{
        showRefresh: true,
        showExcel: true,
      }}
      actions={{
        addButton: {
          text: route.addUser.text,
          onClick: () => {
            navigate(route.addUser.path);
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
        customFilters={customFilters}
        onDelete={handleDelete}
        onPermissions={onPermissions}
        onEdit={onEdit}
        service={getUsers}
        options={{
          customButtons: {
            // Use functions for conditional visibility based on row data
            permissions: true,
            edit: true,
            delete: true,
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
export default Users;
