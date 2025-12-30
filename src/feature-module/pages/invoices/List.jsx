import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm, FormProvider } from "react-hook-form";

import { getContacts, deleteContact } from "@/core/services/contactsService";
import { all_routes } from "@/Router/all_routes";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import { getTableColumns } from "@/feature-module/components/table-columns";
import PageLayout from "@/feature-module/components/list-page-layout";

const List = () => {
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
        detailRoute: route.contactDetails.path,
      },
      { header: "Email", accessorKey: "email" },
      { header: "Phone", accessorKey: "phoneMobile" },
      { header: "Location", accessorKey: "city" },
      { header: "Assigned To", accessorKey: "assignedTo.name" },
      { header: "Created At", accessorKey: "createdAt", type: "date" },
      { header: "Updated At", accessorKey: "updatedAt", type: "date" },
    ];
    return getTableColumns(COLUMNS_CONFIG, { navigate });
  }, [navigate, route.contactDetails.path]);

  const handleEdit = (row) => {
    //  navigate(route.editFlatFee.path.replace(":flatFeeId", row._id));
  };

  const handleDelete = async (row) => {
    try {
      // await deleteContact(row._id);
      // Swal.fire({
      //   title: "Contact deleted successfully",
      //   icon: "success",
      // });
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

  return (
    <PageLayout
      title="Invoices"
      breadcrumbs={[
        {
          label: "Invoices",
          redirect: "#",
        },
      ]}
      subtitle="Manage your invoices"
      toolIcons={{
        showRefresh: true,
        showExcel: true,
      }}
      actions={{
        addButton: {
          text: route.addInvoice.text,
          onClick: () => {
            navigate(route.addInvoice.path);
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
        service={getContacts}
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
  );
};

const EnhancedList = withEntityHandlers(EntityListView);
export default List;
