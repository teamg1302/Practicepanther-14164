import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "react-feather";
import { createStyles } from "antd-style";
import { all_routes } from "@/Router/all_routes";
import { useTranslation } from "react-i18next";
import { getUsers } from "@/core/services/userService";
import Table from "@/core/pagination/datatable";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
          }
        }
      }
    `,
  };
});

const Users = () => {
  const { t } = useTranslation();
  const route = all_routes;
  const { styles } = useStyle();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const columns = [
    {
      title: "Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").length - (b.name || "").length,
    },
    {
      title: "Email",
      width: 100,
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email || "").length - (b.email || "").length,
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      key: "phone",
      width: 100,
      render: (text) => text || "-",
    },
    {
      title: "Role",
      dataIndex: "roleId",
      key: "role",
      width: 100,
      sorter: (a, b) =>
        (a.roleId?.name || "").length - (b.roleId?.name || "").length,
      render: (roleId, record) => {
        return record?.roleId?.name || record?.role?.name || "-";
      },
    },
    {
      title: "Job Title",
      dataIndex: "jobTitleId",
      key: "jobTitle",
      width: 150,
      sorter: (a, b) =>
        (a.jobTitleId?.name || "").length - (b.jobTitleId?.name || "").length,
      render: (jobTitleId, record) => {
        return record?.jobTitleId?.name || record?.jobTitle?.name || "-";
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      width: 80,
      sorter: (a, b) => (a.isActive ? 1 : -1) - (b.isActive ? 1 : -1),
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
    },
    {
      title: "Action",
      key: "operation",
      fixed: "end",
      width: 100,
      render: (_, record) => (
        <div className="edit-delete-action action-table-data">
          <Link
            className="me-2 p-2"
            to={route.editUser.replace(":userId", record._id)}
          >
            <i data-feather="edit" className="feather-edit" />
          </Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsers({
          search: searchText,
          limit: 50,
          page: 1,
        });
        setUsers(response?.list || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchText]);
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
                    <Link to="#" className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                  </div>
                </div>
                <div className="page-header justify-content-end mb-0">
                  <div className="page-btn">
                    <Link to={route.addUser} className="btn btn-added">
                      <PlusCircle className="me-2" />
                      {t("formButton.addNew")}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <Table
                  className={styles.customTable}
                  columns={columns}
                  dataSource={users}
                  loading={loading}
                  rowSelection={false}
                  scroll={{ x: "max-content", y: 55 * 5 }}
                  pagination={{
                    pageSize: 50,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Users;
