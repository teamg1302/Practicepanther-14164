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
import { DateRangePicker } from "@/feature-module/components/form-elements";
import PropTypes from "prop-types";

const ContactsList = () => {
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
    navigate(route.editContact.path.replace(":contactId", row._id));
  };

  const handleDelete = async (row) => {
    try {
      await deleteContact(row._id);
      Swal.fire({
        title: "Contact deleted successfully",
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

  return (
    <PageLayout
      title="Contacts"
      breadcrumbs={[
        {
          label: "Contacts",
          redirect: "#",
        },
      ]}
      subtitle="Manage your contacts"
      toolIcons={{
        showRefresh: true,
        showExcel: true,
      }}
      actions={{
        addButton: {
          text: route.addContact.text,
          onClick: () => {
            navigate(route.addContact.path);
          },
        },
        importButton: {
          onClick: () => {
            console.log("Import clicked");
          },
        },
      }}
      showFilter={true}
      filterContent={
        <FilterContent
          customFilters={customFilters}
          onChange={setCustomFilters}
        />
      }
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

const FilterContent = ({ customFilters, onChange }) => {
  const methods = useForm({
    defaultValues: {
      dateRange: [customFilters.startDate, customFilters.endDate],
    },
  });

  const { watch } = methods;

  useEffect(() => {
    const subscription = watch((value) => {
      onChange({
        ...customFilters,
        startDate: value.dateRange?.[0],
        endDate: value.dateRange?.[1],
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange, customFilters]);

  return (
    <div className="row">
      <div className="col-lg-12 col-sm-12">
        <div className="row mt-3">
          <FormProvider {...methods}>
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="input-blocks">
                <DateRangePicker name="dateRange" />
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

FilterContent.propTypes = {
  customFilters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

const EnhancedList = withEntityHandlers(EntityListView);
export default ContactsList;
