import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import {
  getCategories,
  deleteCategory,
  createCategory,
  updateCategory,
} from "@/core/services/categoryService";
import { all_routes } from "@/Router/all_routes";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import { getTableColumns } from "@/feature-module/components/table-columns";
import PageLayout from "@/feature-module/components/list-page-layout";
import { FormModal } from "@/feature-module/components/modals";
import { getValidationRules } from "@/core/validation-rules";
import * as yup from "yup";

const CategoryList = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [customFilters, setCustomFilters] = useState({
    startDate: null,
    endDate: null,
  });
  const route = all_routes;

  // Columns definition - Pure JSON configuration (srNo and actions are added by withEntityHandlers)
  const columns = useMemo(() => {
    const COLUMNS_CONFIG = [
      {
        header: "Name",
        accessorKey: "name",
      },
      { header: "Description", accessorKey: "description" },
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
    ];
    return getTableColumns(COLUMNS_CONFIG, { navigate });
  }, [navigate]);

  const handleEdit = (row) => {
    setIsEdit(true);
    setSelectedItem(row);
    setIsOpen(true);
  };

  const handleDelete = async (row) => {
    try {
      await deleteCategory(row._id);
      Swal.fire({
        title: "Category deleted successfully",
        icon: "success",
      });
      setCustomFilters((prev) => ({
        ...prev,
        _refresh: Date.now(),
      }));
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        title: "Error",
        text: error?.message || "Something went wrong",
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

  const schema = useMemo(
    () =>
      yup.object({
        name: getValidationRules(t).textOnlyRequired,
        description: getValidationRules(t).textOnlyRequired,
      }),
    [t]
  );

  const defaultValues = {
    name: "",
    description: "",
    isActive: true,
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateCategory(selectedItem._id, data);
      } else {
        await createCategory(data);
      }
      Swal.fire({
        title: isEdit
          ? "Category updated successfully"
          : "Category created successfully",
        icon: "success",
      });
      setIsEdit(false);
      setSelectedItem(null);
      setIsOpen(false);
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        title: "Error",
        text: error?.message || "Something went wrong",
        icon: "error",
      });
    } finally {
      setCustomFilters((prev) => ({
        ...prev,
        _refresh: Date.now(),
      }));
    }
  };

  const fields = [
    { name: "name", label: "Name", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "isActive", label: "Status", type: "switch" },
  ];

  return (
    <>
      <PageLayout
        title="Categories"
        breadcrumbs={[
          {
            label: "Categories",
            redirect: "#",
          },
        ]}
        subtitle="Manage your categories"
        toolIcons={{
          showRefresh: true,
          showExcel: true,
        }}
        actions={{
          addButton: {
            text: "New",
            onClick: () => {
              setIsOpen(true);
              //  navigate(route.addContact.path);
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
          onDelete={handleDelete}
          service={getCategories}
          customFilters={customFilters}
          options={{
            customButtons: {
              add: true,
              edit: true,
              delete: true,
            },
            tableSetting: {
              onlyTopBorder: true,
              srNo: true,
              selectRow: true,
            },
          }}
        />
      </PageLayout>
      <FormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEdit ? "Edit Category" : "Add Category"}
        schema={schema}
        defaultValues={isEdit ? selectedItem : defaultValues}
        onSubmit={onSubmit}
        fields={fields}
        t={t}
      />
    </>
  );
};

const EnhancedList = withEntityHandlers(EntityListView);
export default CategoryList;
