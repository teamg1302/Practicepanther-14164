import {
  Box,
  GitMerge,
  PlusCircle,
  StopCircle,
} from "feather-icons-react/build/IconComponents";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import { Download } from "react-feather";

import { getMatters, deleteMatter } from "@/core/services/mattersService";
import { all_routes } from "@/Router/all_routes";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import { getTableColumns } from "@/feature-module/components/table-columns";
import ListPageLayout from "@/feature-module/components/list-page-layout";

const MattersList = () => {
  const navigate = useNavigate();
  const [customFilters, setCustomFilters] = useState({});
  const route = all_routes;

  // Columns definition - Pure JSON configuration (srNo and actions are added by withEntityHandlers)
  const columns = useMemo(() => {
    const COLUMNS_CONFIG = [
      {
        header: "Matter Name",
        accessorKey: "matterName",
        detailRoute: route.matterDetails.path,
      },
      { header: "Contact", accessorKey: "contactId.name" },
      { header: "Assigned To", accessorKey: "assignedTo.name" },
      { header: "Rate", accessorKey: "matterRate" },
      { header: "Open Date", accessorKey: "openDate", type: "date" },
      { header: "Tags", accessorKey: "tags" },
      { header: "Status", accessorKey: "status" },
      { header: "Created At", accessorKey: "createdAt", type: "date" },
      { header: "Updated At", accessorKey: "updatedAt", type: "date" },
    ];
    return getTableColumns(COLUMNS_CONFIG, { navigate });
  }, [navigate, route.matterDetails.path]);

  const handleEdit = (row) => {
    navigate(`${route.editMatter.path.replace(":matterId", row._id)}`);
  };
  const handleDelete = async (row) => {
    try {
      await deleteMatter(row._id);
      Swal.fire({
        title: "Matter deleted successfully",
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

  // Filter content
  const filterContent = (
    <div className="row">
      <div className="col-lg-12 col-sm-12">
        <div className="row mt-3">
          <div className="col-lg-2 col-sm-6 col-12">
            <div className="input-blocks">
              <Box className="info-img" />
              <Select
                className="img-select"
                classNamePrefix="react-select"
                options={[]}
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
                options={[]}
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
                options={[]}
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
                options={[]}
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
                options={[]}
                placeholder="Created At"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ListPageLayout
      title="Matters"
      subtitle="Manage your matters"
      addButton={{
        path: route.addMatter.path,
        text: route.addMatter.text,
        icon: <PlusCircle className="me-2 iconsize" />,
      }}
      importButton={{
        modalTarget: "#view-notes",
        icon: <Download className="me-2" />,
        text: "Import",
      }}
      onRefresh={handleRefresh}
      showFilter={true}
      filterContent={filterContent}
    >
      <EnhancedList
        columns={columns}
        service={getMatters}
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
    </ListPageLayout>
  );
};

const EnhancedList = withEntityHandlers(EntityListView);
export default MattersList;
