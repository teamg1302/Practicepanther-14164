import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import {
  getItems,
  deleteItem,
  createItem,
  updateItem,
} from "@/core/services/itemService";
import { createTax } from "@/core/services/taxService";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import { getTableColumns } from "@/feature-module/components/table-columns";
import PageLayout from "@/feature-module/components/list-page-layout";
import { FormModal } from "@/feature-module/components/modals";
import { getValidationRules } from "@/core/validation-rules";
import { fetchTaxes } from "@/core/redux/mastersReducer";

const ItemList = () => {
  const dispatch = useDispatch();
  const { taxes } = useSelector((state) => state.masters);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTaxModal, setIsOpenTaxModal] = useState(false);
  const navigate = useNavigate();
  const [customFilters, setCustomFilters] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    dispatch(fetchTaxes());
  }, [dispatch]);

  // Columns definition - Pure JSON configuration (srNo and actions are added by withEntityHandlers)
  const columns = useMemo(() => {
    const COLUMNS_CONFIG = [
      {
        header: "Name",
        accessorKey: "name",
      },
      { header: "Code", accessorKey: "code" },

      { header: "Description", accessorKey: "description" },
      {
        header: "Price",
        accessorKey: "price",
        type: "number",
      },
      //   {
      //     header: "Tax 1",
      //     accessorKey: "tax1Id",
      //     cell: ({ cell }) => {
      //       const tax1Id = cell.getValue();
      //       return tax1Id?.name || "-";
      //     },
      //   },
      //   {
      //     header: "Tax 2",
      //     accessorKey: "tax2Id",
      //     cell: ({ cell }) => {
      //       const tax2Id = cell.getValue();
      //       return tax2Id?.name || "-";
      //     },
      //   },
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
      await deleteItem(row._id);
      Swal.fire({
        title: "Item deleted successfully",
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
        code: getValidationRules(t).textOnlyRequired,
        name: getValidationRules(t).textOnlyRequired,
        price: yup
          .number()
          .typeError("Price must be a number")
          .min(0, "Price must be greater than or equal to 0")
          .required("Price is required"),
        tax1Id: yup.string().nullable(),
        tax2Id: yup.string().nullable(),
      }),
    [t]
  );

  const defaultValues = {
    code: "",
    name: "",
    description: "",
    price: 0,
    tax1Id: null,
    tax2Id: null,
    isActive: true,
  };

  const onSubmit = async (data) => {
    try {
      // AsyncSelectPagination always provides the value (ID) as a string
      // But we'll handle both cases just to be safe
      const submitData = {
        ...data,
        tax1Id: data.tax1Id?._id || data.tax1Id || null,
        tax2Id: data.tax2Id?._id || data.tax2Id || null,
      };

      if (isEdit) {
        await updateItem(selectedItem._id, submitData);
      } else {
        await createItem(submitData);
      }
      Swal.fire({
        title: isEdit
          ? "Item updated successfully"
          : "Item created successfully",
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
  const onSubmitTax = async (data) => {
    try {
      await createTax(data);
      Swal.fire({
        title: "Tax created successfully",
        icon: "success",
      });
      setIsOpenTaxModal(false);
      // Refresh taxes list
      dispatch(fetchTaxes());
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        title: "Error",
        text: error?.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  // Transform selected item for edit - convert tax IDs to objects if needed
  const getEditDefaultValues = () => {
    if (!isEdit || !selectedItem) return defaultValues;

    return {
      code: selectedItem.code || "",
      name: selectedItem.name || "",
      description: selectedItem.description || "",
      price: selectedItem.price || 0,
      tax1Id: selectedItem.tax1Id?._id || selectedItem.tax1Id || null,
      tax2Id: selectedItem.tax2Id?._id || selectedItem.tax2Id || null,
      isActive:
        selectedItem.isActive !== undefined ? selectedItem.isActive : true,
    };
  };

  const fields = [
    {
      type: "ui",
      element: (
        <div className="card-title-head mb-3">
          <h6 className="border-bottom-0 mb-0 pb-0">{"Item"}</h6>
          <small className="text-muted">{"Enter the item's details"}</small>
        </div>
      ),
    },
    { name: "name", label: "Name", type: "text", col: 6 },
    { name: "code", label: "Code", type: "text", col: 6 },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      col: 12,
      rows: 3,
    },
    {
      type: "ui",
      element: (
        <div className="card-title-head mb-3">
          <h6 className="border-bottom-0 mb-0 pb-0">{"Price"}</h6>
          <small className="text-muted">{"Enter the item's price"}</small>
        </div>
      ),
    },
    { name: "price", label: "Price", type: "number", col: 6 },
    {
      name: "tax1Id",
      label: "Tax 1",
      type: "select",
      options: taxes,
      col: 6,
      selectProps: {
        onAddClick: () => {
          setIsOpenTaxModal(true);
        },
        addButtonLabel: "Create New",
      },
    },
    {
      name: "tax2Id",
      label: "Tax 2",
      type: "select",
      options: taxes,
      col: 6,
      selectProps: {
        onAddClick: () => {
          setIsOpenTaxModal(true);
        },
        addButtonLabel: "Create New",
      },
    },
    { name: "isActive", label: "Status", type: "switch", col: 12 },
  ];

  const taxFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      col: 6,
      required: true,
    },
    {
      name: "rate",
      label: "Tax Rate (%)",
      type: "number",
      col: 6,
      required: true,
    },
    {
      name: "inclusive",
      label: "Inclusive",
      type: "switch",
      col: 12,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      col: 12,
      rows: 3,
    },
  ];

  return (
    <>
      <PageLayout
        title="Items"
        breadcrumbs={[
          {
            label: "Items",
            redirect: "#",
          },
        ]}
        subtitle="Manage your items"
        toolIcons={{
          showRefresh: true,
          showExcel: true,
        }}
        actions={{
          addButton: {
            text: "New",
            onClick: () => {
              setIsOpen(true);
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
          service={getItems}
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
        onClose={() => {
          setIsEdit(false);
          setSelectedItem(null);
          setIsOpen(false);
        }}
        title={isEdit ? "Edit Item" : "Add Item"}
        schema={schema}
        defaultValues={getEditDefaultValues()}
        onSubmit={onSubmit}
        fields={fields}
        bodyStyle={{ height: "500px", overflowY: "auto" }}
      />
      <FormModal
        isOpen={isOpenTaxModal}
        onClose={() => {
          setIsOpenTaxModal(false);
        }}
        title="Add Tax"
        fields={taxFields}
        onSubmit={onSubmitTax}
        zIndex={1070}
        schema={yup.object({
          name: getValidationRules(t).textOnlyRequired,
          rate: yup
            .number()
            .typeError("Tax rate must be a number")
            .min(0, "Tax rate must be greater than or equal to 0")
            .max(100, "Tax rate must be less than or equal to 100")
            .required("Tax rate is required"),
        })}
        defaultValues={{
          name: "",
          rate: 0,
          inclusive: false,
          description: "",
        }}
      />
    </>
  );
};

const EnhancedList = withEntityHandlers(EntityListView);
export default ItemList;
