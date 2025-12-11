import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { PlusCircle } from "feather-icons-react/build/IconComponents";
import { Download } from "react-feather";
import { Box, StopCircle, GitMerge } from "react-feather";
import Select from "react-select";
import { getContacts, deleteContact } from "@/core/services/contactsService";
import { all_routes } from "@/Router/all_routes";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import { getTableColumns } from "@/feature-module/components/table-columns";
import ListPageLayout from "@/feature-module/components/list-page-layout";

const ContactsList = () => {
  const navigate = useNavigate();
  const [customFilters, setCustomFilters] = useState({});
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
    <ListPageLayout
      title="Contacts"
      subtitle="Manage your contacts"
      addButton={route.addContact}
      importButton={{
        modalTarget: "#view-notes",
        icon: <Download className="me-2" />,
        text: "Import",
      }}
      filterContent={<FilterContent />}
      showFilter={true}
      onRefresh={handleRefresh}
    >
      <EnhancedList
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        service={getContacts}
        customFilters={customFilters}
        edit
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
    </ListPageLayout>
  );
};

const FilterContent = () => {
  return (
    <div className="row">
      <div className="col-lg-12 col-sm-12">
        <div className="row mt-3">
          <div className="col-lg-2 col-sm-6 col-12">
            <div className="input-blocks">
              <Box className="info-img" />
              <Select
                className="img-select"
                classNamePrefix="react-select"
                placeholder="Primary Contact"
              />
            </div>
          </div>
          <div className="col-lg-2 col-sm-6 col-12">
            <div className="input-blocks">
              <StopCircle className="info-img" />
              <Select
                className="img-select"
                classNamePrefix="react-select"
                placeholder="Assign To"
              />
            </div>
          </div>
          <div className="col-lg-2 col-sm-6 col-12">
            <div className="input-blocks">
              <GitMerge className="info-img" />
              <Select
                className="img-select"
                classNamePrefix="react-select"
                placeholder="Status"
              />
            </div>
          </div>
          <div className="col-lg-2 col-sm-6 col-12">
            <div className="input-blocks">
              <StopCircle className="info-img" />
              <Select
                className="img-select"
                classNamePrefix="react-select"
                placeholder="Tags"
              />
            </div>
          </div>
          <div className="col-lg-2 col-sm-6 col-12">
            <div className="input-blocks">
              <i className="fas fa-money-bill info-img" />

              <Select
                className="img-select"
                classNamePrefix="react-select"
                placeholder="Created At"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedList = withEntityHandlers(EntityListView);
export default ContactsList;
