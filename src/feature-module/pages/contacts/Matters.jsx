import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getMattersByContactId } from "@/core/services/contactsService";
import { deleteMatter } from "@/core/services/mattersService";
import { all_routes } from "@/Router/all_routes";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import { getTableColumns } from "@/feature-module/components/table-columns";

// Columns definition - Pure JSON configuration (srNo and actions are added by withEntityHandlers)
const COLUMNS_CONFIG = [
  { header: "Matter Name", accessorKey: "matterName" },
  { header: "Contact", accessorKey: "contactId.name" },
  { header: "Assigned To", accessorKey: "assignedTo.name" },
  { header: "Rate", accessorKey: "matterRate" },
  { header: "Open Date", accessorKey: "openDate", type: "date" },
  { header: "Tags", accessorKey: "tags" },
  { header: "Status", accessorKey: "status" },
  { header: "Created At", accessorKey: "createdAt", type: "date" },
  { header: "Updated At", accessorKey: "updatedAt", type: "date" },
];

const ContactMatters = ({ contactId }) => {
  const navigate = useNavigate();
  // Pass contactId via customFilters - it will be spread into service params by withEntityHandlers
  const [customFilters, setCustomFilters] = useState(() =>
    contactId ? { contactId } : {}
  );

  const route = all_routes;
  const columns = useMemo(() => getTableColumns(COLUMNS_CONFIG), []);

  const handleEdit = (row) => {
    navigate(`${route.editMatter.path.replace(":matterId", row._id)}`);
  };
  const handleDelete = async (row) => {
    try {
      await deleteMatter(row._id);
      Swal.fire({
        title: "Success",
        text: "Matter deleted successfully",
        icon: "success",
      });
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  // Update customFilters when contactId changes
  // This syncs the prop to state, which is necessary for withEntityHandlers to refetch data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (contactId) {
      setCustomFilters({ contactId });
    } else {
      setCustomFilters({});
    }
  }, [contactId]);

  // Don't render the list if contactId is not available
  if (!contactId) {
    return (
      <div className="text-center p-4">
        <p className="text-muted">
          No contact ID provided. Please select a contact.
        </p>
      </div>
    );
  }

  return (
    <EnhancedList
      columns={columns}
      service={getMattersByContactId}
      customFilters={customFilters}
      onEdit={handleEdit}
      onDelete={handleDelete}
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
  );
};

const EnhancedList = withEntityHandlers(EntityListView);

ContactMatters.propTypes = {
  contactId: PropTypes.string,
};

export default ContactMatters;
