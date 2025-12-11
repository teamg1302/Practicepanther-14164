import React, { useState, useEffect, useMemo } from "react";
import { FormProvider } from "@/feature-module/components/rhf";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import * as yup from "yup";
import Swal from "sweetalert2";
import { all_routes } from "@/Router/all_routes";
import {
  getRoleModules,
  getRoleDetails,
  addRole,
  updateRole,
} from "@/core/services/roleService";
import { getUserDetails, updateUserDetails } from "@/core/services/userService";
import { formatToTitleCase } from "@/core/utilities/stringFormatter";
import { FormButton } from "@/feature-module/components/buttons";
import Input from "@/feature-module/components/form-elements/input";

/**
 * Yup validation schema for role permissions form
 */
const rolePermissionSchema = yup.object({
  name: yup
    .string()
    .nullable()
    .transform((value) => {
      if (value === null || value === undefined) return "";
      return String(value);
    })
    .trim()
    .required("Role name is required")
    .min(2, "Role name must be at least 2 characters")
    .max(100, "Role name must not exceed 100 characters"),
  description: yup
    .string()
    .nullable()
    .transform((value) => {
      if (value === null || value === undefined) return "";
      return String(value);
    })
    .trim()
    .optional()
    .max(500, "Description must not exceed 500 characters"),
  firmId: yup
    .string()
    .nullable()
    .transform((value) => {
      if (value === null || value === undefined) return "";
      return String(value);
    })
    .trim()
    .optional(),
  isActive: yup
    .boolean()
    .nullable()
    .transform((value) =>
      value === null || value === undefined ? true : value
    )
    .optional()
    .default(true),
  permissions: yup
    .array()
    .of(
      yup.object({
        moduleName: yup.string().required("Module name is required"),
        actions: yup.object({
          create: yup
            .boolean()
            .nullable()
            .transform((value) =>
              value === null || value === undefined ? false : value
            )
            .optional()
            .default(false),
          read: yup
            .boolean()
            .nullable()
            .transform((value) =>
              value === null || value === undefined ? false : value
            )
            .optional()
            .default(false),
          update: yup
            .boolean()
            .nullable()
            .transform((value) =>
              value === null || value === undefined ? false : value
            )
            .optional()
            .default(false),
          delete: yup
            .boolean()
            .nullable()
            .transform((value) =>
              value === null || value === undefined ? false : value
            )
            .optional()
            .default(false),
        }),
      })
    )
    .nullable()
    .optional()
    .default([]),
});

const RolePermissionAddEdit = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const { roleId, userId } = useParams();
  const user = useSelector((state) => state.auth?.user);
  const [modules, setModules] = useState([]);
  const [roleDetails, setRoleDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const modulesData = await getRoleModules();
        setModules(modulesData || []);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
    fetchModules();

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch role details if roleId exists (edit mode)
        if (roleId) {
          const roleData = await getRoleDetails(roleId);
          setRoleDetails(roleData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setModules([]);
        setRoleDetails(null);
      } finally {
        setLoading(false);
      }
    };
    if (roleId) {
      fetchData();
    }
  }, [roleId]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const userData = await getUserDetails(userId);
        setUserDetails(userData);
        setRoleDetails(userData.roleId);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  /**
   * Transform roleDetails into defaultValues format
   */
  const defaultValues = useMemo(() => {
    if (roleDetails) {
      return {
        userName: userDetails?.name || "",
        name: roleDetails.name || "",
        description: roleDetails.description || "",
        firmId: user?.firmId?._id || "",
        isActive:
          roleDetails.isActive !== undefined ? roleDetails.isActive : true,
        permissions: userDetails.permissions || [],
      };
    }

    // Default values for new role
    const initialPermissions = modules.map((module) => ({
      moduleName: module,
      actions: {
        create: false,
        read: false,
        update: false,
        delete: false,
      },
    }));

    return {
      userName: userDetails?.name || "",
      name: "",
      description: "",
      firmId: user?.firmId || "",
      isActive: true,
      permissions: initialPermissions,
    };
  }, [roleDetails, modules, user?.firmId, userDetails]);

  /**
   * Handles form submission
   */
  const onSubmit = async (formData) => {
    try {
      // Clean and format the data before submission
      const cleanedData = {
        name: String(formData.name || "").trim(),
        description: formData.description
          ? String(formData.description).trim()
          : "",
        firmId: formData.firmId ? String(formData.firmId).trim() : "",
        isActive:
          formData.isActive !== undefined ? Boolean(formData.isActive) : true,
        permissions: (formData.permissions || []).map((perm) => ({
          moduleName: String(perm.moduleName || ""),
          actions: {
            create: Boolean(perm.actions?.create || false),
            read: Boolean(perm.actions?.read || false),
            update: Boolean(perm.actions?.update || false),
            delete: Boolean(perm.actions?.delete || false),
          },
        })),
      };

      if (roleId) {
        // Update existing role
        await updateRole(roleId, cleanedData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Role updated successfully",
          showConfirmButton: true,
        });
        navigate("/settings/roles-permissions");
      } else if (userId) {
        const userPermissions = {
          ...userDetails,
          permissions: cleanedData.permissions,
        };
        // Update existing user
        await updateUserDetails(userId, userPermissions);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User's permissions updated successfully",
          showConfirmButton: true,
        });
        navigate("/settings/users");
      } else {
        // Add new role
        await addRole(cleanedData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Role created successfully",
          showConfirmButton: true,
        });
        navigate("/settings/roles-permissions");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Failed to save role. Please try again.",
        showConfirmButton: true,
      });
    }
  };

  // Don't render form until data is loaded
  if (loading) {
    return (
      <div className="settings-page-wrap">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="settings-content-main w-100">
      <div className="settings-page-wrap">
        <FormProvider
          schema={rolePermissionSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
        >
          <RolePermissionContent
            modules={modules}
            userDetails={userDetails}
            loading={loading}
          />
        </FormProvider>
      </div>
    </main>
  );
};

/**
 * Role Permission Content Component
 * Displays the form with modules and permissions
 */
const RolePermissionContent = ({ modules, userDetails, loading }) => {
  const {
    watch,
    setValue,
    formState: { isSubmitting },
  } = useFormContext();
  const navigate = useNavigate();
  const route = all_routes;

  const permissions = watch("permissions") || [];

  /**
   * Handle permission toggle
   */
  const handlePermissionToggle = (moduleName, action, value) => {
    const updatedPermissions = permissions.map((perm) => {
      if (perm.moduleName === moduleName) {
        return {
          ...perm,
          actions: {
            ...perm.actions,
            [action]: value,
          },
        };
      }
      return perm;
    });
    setValue("permissions", updatedPermissions);
  };

  /**
   * Get permission value for a module and action
   */
  const getPermissionValue = (moduleName, action) => {
    const permission = permissions.find(
      (perm) => perm.moduleName === moduleName
    );
    return permission?.actions?.[action] || false;
  };

  /**
   * Check if all permissions are checked for a module
   */
  const areAllPermissionsChecked = (moduleName) => {
    const permission = permissions.find(
      (perm) => perm.moduleName === moduleName
    );
    if (!permission) return false;
    return (
      permission.actions?.read &&
      permission.actions?.create &&
      permission.actions?.update &&
      permission.actions?.delete
    );
  };

  /**
   * Handle row selection toggle - syncs with all permissions
   */
  const handleRowSelection = (moduleName) => {
    const isCurrentlySelected = areAllPermissionsChecked(moduleName);
    const newValue = !isCurrentlySelected;

    // Update all permissions for this module
    const updatedPermissions = permissions.map((perm) => {
      if (perm.moduleName === moduleName) {
        return {
          ...perm,
          actions: {
            create: newValue,
            read: newValue,
            update: newValue,
            delete: newValue,
          },
        };
      }
      return perm;
    });

    setValue("permissions", updatedPermissions);
  };

  /**
   * Check if a row is selected (all permissions checked)
   */
  const isRowSelected = (moduleName) => {
    return areAllPermissionsChecked(moduleName);
  };

  /**
   * Check if all modules have all permissions checked
   */
  const areAllModulesFullyChecked = () => {
    if (modules.length === 0 || permissions.length === 0) return false;

    // Check if all modules have all permissions checked
    return modules.every((module) => {
      const permission = permissions.find((perm) => perm.moduleName === module);
      if (!permission) return false;
      return (
        permission.actions?.read &&
        permission.actions?.create &&
        permission.actions?.update &&
        permission.actions?.delete
      );
    });
  };

  /**
   * Handle "All" switch toggle - checks/unchecks all modules' all permissions
   */
  const handleSelectAll = () => {
    const shouldCheckAll = !areAllModulesFullyChecked();

    // Create a map of existing permissions for quick lookup
    const permissionsMap = new Map();
    permissions.forEach((perm) => {
      permissionsMap.set(perm.moduleName, perm);
    });

    // Update all permissions for all modules, creating new ones if needed
    const updatedPermissions = modules.map((module) => {
      const existingPermission = permissionsMap.get(module);
      if (existingPermission) {
        // Update existing permission
        return {
          ...existingPermission,
          actions: {
            create: shouldCheckAll,
            read: shouldCheckAll,
            update: shouldCheckAll,
            delete: shouldCheckAll,
          },
        };
      } else {
        // Create new permission for this module
        return {
          moduleName: module,
          actions: {
            create: shouldCheckAll,
            read: shouldCheckAll,
            update: shouldCheckAll,
            delete: shouldCheckAll,
          },
        };
      }
    });

    setValue("permissions", updatedPermissions);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="security-settings">
      <div className="row">
        <div className="col-md-12">
          <Input
            name="userName"
            label="User Name"
            type="text"
            inputProps={{ disabled: !!userDetails }}
            required
          />
        </div>
        <div className="col-md-12">
          <Input
            name="name"
            label="Role Name"
            type="text"
            inputProps={{ disabled: !!userDetails }}
            required
          />
        </div>
        <div className="col-md-12">
          <Input
            name="description"
            label="Description"
            inputProps={{ disabled: !!userDetails }}
            type="text"
          />
        </div>
      </div>
      <div className="table-responsive no-pagination">
        <table className="table datanew border cell-border">
          <thead>
            <tr>
              <th>Module</th>
              <th>
                <div className="status-toggle modal-status">
                  <input
                    type="checkbox"
                    id="select-all-modules"
                    className="check"
                    checked={areAllModulesFullyChecked()}
                    onChange={handleSelectAll}
                  />
                  <label htmlFor="select-all-modules" className="checktoggle">
                    {" "}
                  </label>
                </div>
              </th>
              <th>Read</th>
              <th>Write</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="custom-table-data">
            {modules.length > 0 &&
              modules.map((module) => (
                <tr key={module}>
                  <td className="border">{formatToTitleCase(module)}</td>
                  <td className="border">
                    <div className="status-toggle modal-status">
                      <input
                        type="checkbox"
                        id={`${module}-select`}
                        className="check"
                        checked={isRowSelected(module)}
                        onChange={() => handleRowSelection(module)}
                      />
                      <label
                        htmlFor={`${module}-select`}
                        className="checktoggle"
                      >
                        {" "}
                      </label>
                    </div>
                  </td>
                  <td className="border">
                    <div className="status-toggle modal-status">
                      <input
                        type="checkbox"
                        id={`${module}-read`}
                        className="check"
                        checked={getPermissionValue(module, "read")}
                        onChange={(e) =>
                          handlePermissionToggle(
                            module,
                            "read",
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor={`${module}-read`} className="checktoggle">
                        {" "}
                      </label>
                    </div>
                  </td>
                  <td className="border">
                    <div className="status-toggle modal-status">
                      <input
                        type="checkbox"
                        id={`${module}-create`}
                        className="check"
                        checked={getPermissionValue(module, "create")}
                        onChange={(e) =>
                          handlePermissionToggle(
                            module,
                            "create",
                            e.target.checked
                          )
                        }
                      />
                      <label
                        htmlFor={`${module}-create`}
                        className="checktoggle"
                      >
                        {" "}
                      </label>
                    </div>
                  </td>
                  <td className="border">
                    <div className="status-toggle modal-status">
                      <input
                        type="checkbox"
                        id={`${module}-update`}
                        className="check"
                        checked={getPermissionValue(module, "update")}
                        onChange={(e) =>
                          handlePermissionToggle(
                            module,
                            "update",
                            e.target.checked
                          )
                        }
                      />
                      <label
                        htmlFor={`${module}-update`}
                        className="checktoggle"
                      >
                        {" "}
                      </label>
                    </div>
                  </td>
                  <td className="border">
                    <div className="status-toggle modal-status">
                      <input
                        type="checkbox"
                        id={`${module}-delete`}
                        className="check"
                        checked={getPermissionValue(module, "delete")}
                        onChange={(e) =>
                          handlePermissionToggle(
                            module,
                            "delete",
                            e.target.checked
                          )
                        }
                      />
                      <label
                        htmlFor={`${module}-delete`}
                        className="checktoggle"
                      >
                        {" "}
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="settings-bottom-btn d-flex flex-row gap-2 align-items-center justify-content-end">
          <FormButton type="submit" isSubmitting={isSubmitting} />
          <FormButton
            type="cancel"
            isSubmitting={isSubmitting}
            onClick={() => navigate("/settings/roles-permissions")}
          />
        </div>
      </div>
    </div>
  );
};

RolePermissionContent.propTypes = {
  modules: PropTypes.array.isRequired,
  userDetails: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default RolePermissionAddEdit;
