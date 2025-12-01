import React from "react";
import Table from "@/core/pagination/datatable";

const columns = [
  {
    title: "Full Name",
    width: 100,
    dataIndex: "name",
    key: "name",
    fixed: "start",
  },
  {
    title: "Age",
    width: 100,
    dataIndex: "age",
    key: "age",
    fixed: "start",
    sorter: true,
  },
  { title: "Column 1", dataIndex: "address", key: "1" },
  { title: "Column 2", dataIndex: "address", key: "2" },
  { title: "Column 3", dataIndex: "address", key: "3" },
  { title: "Column 4", dataIndex: "address", key: "4" },
  { title: "Column 4", dataIndex: "address", key: "5" },
  { title: "Column 4", dataIndex: "address", key: "6" },
  { title: "Column 4", dataIndex: "address", key: "7" },
  {
    title: "Action",
    key: "operation",
    fixed: "end",
    width: 100,
    render: () => <a>action</a>,
  },
];
const dataSource = [
  { key: "1", name: "Olivia", age: 32, address: "New York Park" },
  { key: "2", name: "Ethan", age: 40, address: "London Park" },
];
const App = () => {
  return (
    <div className="settings-page-wrap">
      <div className="table-responsive">
        <Table columns={columns} dataSource={dataSource} />
      </div>
    </div>
  );
};
export default App;
