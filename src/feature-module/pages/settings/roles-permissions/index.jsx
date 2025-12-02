import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PlusCircle } from "react-feather";

import { getRoles } from "@/core/services/roleService";
import Table from "@/core/pagination/datatable";
import { all_routes } from "@/Router/all_routes";

const RolePermissionList = () => {
  const { t } = useTranslation();
  const route = all_routes;
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: "Role",
      dataIndex: "name",
      sorter: (a, b) => a.role.length - b.role.length,
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.description.length - b.description.length,
      width: 250,
    },

    {
      title: "Status",
      dataIndex: "isActive",
      // sorter: (a, b) => a.status.length - b.status.length,
      render: (isActive) => (
        <span
          className={
            isActive ? "badge badge-linesuccess" : "badge badge-linedanger"
          }
          style={{ fontSize: "11px" }}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
      width: 100,
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="edit-delete-action action-table-data">
          <Link
            className="me-2 p-2"
            to={route.editRolePermission.replace(":roleId", record._id)}
          >
            <i data-feather="edit" className="feather-edit" />
          </Link>
          {/* <Link
            className="confirm-text p-2"
            href="#"
            onClick={showConfirmationAlert}
          >
            <i data-feather="trash-2" className="feather-trash-2" />
          </Link> */}
        </div>
      ),
      width: 100,
    },
  ];

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await getRoles();
        setRoles(response.list);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="settings-page-wrap">
      <div className="row">
        <div className="col-lg-12">
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <input
                      type="search"
                      className="form-control form-control-sm"
                      placeholder="Search"
                      aria-controls="DataTables_Table_0"
                      value={searchText}
                      onChange={handleSearch}
                    />
                    <Link to className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                  </div>
                </div>
                <div className="page-header justify-content-end mb-0">
                  <div className="page-btn">
                    <Link
                      to={route.addRolePermission}
                      className="btn btn-added"
                    >
                      <PlusCircle className="me-2" />
                      {t("formButton.addNew")}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={roles}
                  rowSelection={false}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionList;
