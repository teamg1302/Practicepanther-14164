import React, { useState } from "react";
import CountUp from "react-countup";
import {
  File,
  User,
  UserCheck,
} from "feather-icons-react/build/IconComponents";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
  ArrowRight,
  UserPlus,
  Briefcase,
  FileText,
  Clock,
  CreditCard,
} from "react-feather";
import { Receipt, AttachMoney, Phone } from "@mui/icons-material";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const Dashboard = () => {
  const { permissions } = useSelector((state) => state.auth);

  const findPermission = permissions.find(
    (permission) => permission.moduleName === "dashboard_financial_summary"
  );

  const hasPermission = findPermission?.actions?.read === true;

  const { t } = useTranslation();
  const [chartOptions] = useState({
    series: [
      {
        name: t("dashboard.sales"),
        data: [130, 210, 300, 290, 150, 50, 210, 280, 105],
      },
      {
        name: t("dashboard.purchase"),
        data: [-150, -90, -50, -180, -50, -70, -100, -90, -105],
      },
    ],
    colors: ["#28C76F", "#EA5455"],
    chart: {
      type: "bar",
      height: 320,
      stacked: true,
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 280,
        options: {
          legend: {
            position: "bottom",
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: "end", // "around" / "end"
        borderRadiusWhenStacked: "all", // "all"/"last"
        columnWidth: "20%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      min: -200,
      max: 300,
      tickAmount: 5,
    },
    xaxis: {
      categories: [
        t("dashboard.months.jan"),
        t("dashboard.months.feb"),
        t("dashboard.months.mar"),
        t("dashboard.months.apr"),
        t("dashboard.months.may"),
        t("dashboard.months.jun"),
        t("dashboard.months.jul"),
        t("dashboard.months.aug"),
        t("dashboard.months.sep"),
      ],
    },
    legend: { show: false },
    fill: {
      opacity: 1,
    },
  });
  const MySwal = withReactContent(Swal);
  const showConfirmationAlert = () => {
    MySwal.fire({
      title: t("dashboard.messages.areYouSure"),
      text: t("dashboard.messages.cantRevert"),
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: t("dashboard.messages.yesDelete"),
      cancelButtonColor: "#ff0000",
      cancelButtonText: t("dashboard.messages.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: t("dashboard.messages.deleted"),
          text: t("dashboard.messages.fileDeleted"),
          className: "btn btn-success",
          confirmButtonText: t("dashboard.messages.ok"),
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else {
        MySwal.close();
      }
    });
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {hasPermission && (
              <>
                <div className="col-xl-3 col-sm-6 col-12 d-flex">
                  <div className="dash-widget w-100">
                    <div className="dash-widgetimg">
                      <span>
                        <ImageWithBasePath
                          src="assets/img/icons/dash1.svg"
                          alt="img"
                        />
                      </span>
                    </div>
                    <div className="dash-widgetcontent">
                      <h5>
                        <CountUp
                          start={0}
                          end={307144}
                          duration={3}
                          prefix="$"
                        />
                      </h5>
                      <h6>{t("dashboard.totalMonthRevenue")}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 col-12 d-flex">
                  <div className="dash-widget dash1 w-100">
                    <div className="dash-widgetimg">
                      <span>
                        <ImageWithBasePath
                          src="assets/img/icons/dash2.svg"
                          alt="img"
                        />
                      </span>
                    </div>
                    <div className="dash-widgetcontent">
                      <h5>
                        $
                        <CountUp
                          start={0}
                          end={4385}
                          duration={3} // Duration in seconds
                        />
                      </h5>
                      <h6>{t("dashboard.totalTodayRevenue")}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 col-12 d-flex">
                  <div className="dash-widget dash2 w-100">
                    <div className="dash-widgetimg">
                      <span>
                        <ImageWithBasePath
                          src="assets/img/icons/dash3.svg"
                          alt="img"
                        />
                      </span>
                    </div>
                    <div className="dash-widgetcontent">
                      <h5>
                        $
                        <CountUp
                          start={0}
                          end={385656.5}
                          duration={3} // Duration in seconds
                          decimals={1}
                        />
                      </h5>
                      <h6>{t("dashboard.totalRevenue")}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 col-12 d-flex">
                  <div className="dash-widget dash3 w-100">
                    <div className="dash-widgetimg">
                      <span>
                        <ImageWithBasePath
                          src="assets/img/icons/dash4.svg"
                          alt="img"
                        />
                      </span>
                    </div>
                    <div className="dash-widgetcontent">
                      <h5>
                        $
                        <CountUp
                          start={0}
                          end={40000}
                          duration={3} // Duration in seconds
                        />
                      </h5>
                      <h6>{t("dashboard.totalExpenseAmount")}</h6>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count">
                <div className="dash-counts">
                  <h4>125</h4>
                  <h5>Team Members</h5>
                </div>
                <div className="dash-imgs">
                  <User />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das1">
                <div className="dash-counts">
                  <h4>110</h4>
                  <h5>Active Team Members</h5>
                </div>
                <div className="dash-imgs">
                  <UserCheck />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das2">
                <div className="dash-counts">
                  <h4>150</h4>
                  <h5>Live Cases</h5>
                </div>
                <div className="dash-imgs">
                  <ImageWithBasePath
                    src="assets/img/icons/file-text-icon-01.svg"
                    className="img-fluid"
                    alt="icon"
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das3">
                <div className="dash-counts">
                  <h4>170</h4>
                  <h5>Clients & Parties</h5>
                </div>
                <div className="dash-imgs">
                  <File />
                </div>
              </div>
            </div>
          </div>

          {/* Button trigger modal */}

          {/* Quick Create Section */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Quick Create</h5>
                </div>
                <div className="card-body">
                  <div className="quick-create-grid">
                    {/* Row 1 */}
                    <div className="quick-create-item">
                      <Link to="#" className="quick-create-btn">
                        <div className="quick-create-icon">
                          <UserPlus />
                        </div>
                        <span className="quick-create-label">New Client</span>
                      </Link>
                    </div>
                    <div className="quick-create-item">
                      <Link to="#" className="quick-create-btn">
                        <div className="quick-create-icon">
                          <Briefcase />
                        </div>
                        <span className="quick-create-label">New Case</span>
                      </Link>
                    </div>

                    <div className="quick-create-item">
                      <Link to="#" className="quick-create-btn">
                        <div className="quick-create-icon">
                          <Clock />
                        </div>
                        <span className="quick-create-label">Track Time</span>
                      </Link>
                    </div>

                    <div className="quick-create-item">
                      <Link to="#" className="quick-create-btn">
                        <div className="quick-create-icon">
                          <FileText />
                        </div>
                        <span className="quick-create-label">New Note</span>
                      </Link>
                    </div>

                    <div className="quick-create-item">
                      <Link to="#" className="quick-create-btn">
                        <div className="quick-create-icon">
                          <Phone />
                        </div>
                        <span className="quick-create-label">New Call</span>
                      </Link>
                    </div>

                    <div className="quick-create-item">
                      <Link to="#" className="quick-create-btn">
                        <div className="quick-create-icon">
                          <Receipt />
                        </div>
                        <span className="quick-create-label">New Invoice</span>
                      </Link>
                    </div>
                    <div className="quick-create-item">
                      <Link to="#" className="quick-create-btn">
                        <div className="quick-create-icon">
                          <CreditCard />
                        </div>
                        <span className="quick-create-label">New Payment</span>
                      </Link>
                    </div>
                    <div className="quick-create-item">
                      <Link to="#" className="quick-create-btn">
                        <div className="quick-create-icon">
                          <AttachMoney />
                        </div>
                        <span className="quick-create-label">New Flat Fee</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {hasPermission && (
            <div className="row">
              <div className="col-xl-7 col-sm-12 col-12 d-flex">
                <div className="card flex-fill">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Revenue</h5>
                    <div className="graph-sets">
                      <ul className="mb-0">
                        <li>
                          <span>Revenue</span>
                        </li>
                        <li>
                          <span>Cases</span>
                        </li>
                      </ul>
                      <div className="dropdown dropdown-wraper">
                        <button
                          className="btn btn-light btn-sm dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          2023
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li>
                            <Link to="#" className="dropdown-item">
                              2023
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item">
                              2022
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item">
                              2021
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div id="sales_charts" />
                    <Chart
                      options={chartOptions}
                      series={chartOptions.series}
                      type="bar"
                      height={320}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-5 col-sm-12 col-12 d-flex">
                <div className="card flex-fill default-cover mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0">Recent Activities</h4>
                    <div className="view-all-link">
                      <Link
                        to="#"
                        className="view-all d-flex align-items-center"
                      >
                        {t("dashboard.viewAll")}
                        <span className="ps-2 d-flex align-items-center">
                          <ArrowRight className="feather-16" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive dataview">
                      <table className="table dashboard-recent-products">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Activity</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td className="productimgname">
                              New case opened: Smith v. Johnson - Personal
                              Injury
                            </td>
                            <td>Dec 06, 2025 00:19</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td className="productimgname">
                              Payment received: $5,000 from Acme Corp - Invoice
                              #INV-2024-001
                            </td>
                            <td>Dec 05, 2025 23:19</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td className="productimgname">
                              Document signed: Contract Agreement - Client: Jane
                              Williams
                            </td>
                            <td>Dec 05, 2025 22:19</td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td className="productimgname">
                              New client onboarded: Robert Martinez - Estate
                              Planning
                            </td>
                            <td>Dec 05, 2025 21:19</td>
                          </tr>
                          <tr>
                            <td>5</td>
                            <td className="productimgname">
                              New client onboarded: Robert Martinez - Estate
                              Planning
                            </td>
                            <td>Dec 05, 2025 21:19</td>
                          </tr>
                          <tr>
                            <td>6</td>
                            <td className="productimgname">
                              New client onboarded: Robert Martinez - Estate
                              Planning
                            </td>
                            <td>Dec 05, 2025 21:19</td>
                          </tr>
                          <tr>
                            <td>7</td>
                            <td className="productimgname">
                              New client onboarded: Robert Martinez - Estate
                              Planning
                            </td>
                            <td>Dec 05, 2025 21:19</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Your Hours</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-xl-3 col-sm-6 col-12 d-flex">
                      <div className="dash-widget w-100 mb-0">
                        <div className="w-100 dash-widgetcontent d-flex justify-content-between align-items-center">
                          <h6>{t("Hours Today")}</h6>
                          <strong className="text-label text-primary">
                            0.00
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 d-flex">
                      <div className="dash-widget dash1 w-100 mb-0">
                        <div className="w-100 dash-widgetcontent d-flex justify-content-between align-items-center">
                          <h6>{t("Hours This Week")}</h6>
                          <strong className="text-label text-primary">
                            0.00
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 d-flex">
                      <div className="dash-widget dash2 w-100 mb-0">
                        <div className="w-100 dash-widgetcontent d-flex justify-content-between align-items-center">
                          <h6>{t("Hours This Month")}</h6>
                          <strong className="text-label text-primary">
                            0.00
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 d-flex">
                      <div className="dash-widget dash3 w-100 mb-0">
                        <div className="w-100 dash-widgetcontent d-flex justify-content-between align-items-center">
                          <h6>{t("Hours This Year")}</h6>
                          <strong className="text-label text-primary">
                            0.00
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Recent Cases </h4>
            </div>
            <div className="card-body">
              <div className="table-responsive dataview">
                <table className="table dashboard-expired-products">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Case Type </th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th className="no-sort">{t("dashboard.action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sarah Johnson</td>
                      <td>Personal Injury</td>
                      <td>Dec 06, 2025, 12:19 AM </td>
                      <td>$12,500.00 </td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <Link className="me-2 p-2" to="#">
                            <i data-feather="edit" className="feather-edit" />
                          </Link>
                          <Link
                            className=" confirm-text p-2"
                            to="#"
                            onClick={showConfirmationAlert}
                          >
                            <i
                              data-feather="trash-2"
                              className="feather-trash-2"
                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Michael Chen</td>
                      <td>Corporate Law</td>
                      <td>Dec 05, 2025, 11:19 PM </td>
                      <td>$8,750.00 </td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <Link className="me-2 p-2" to="#">
                            <i data-feather="edit" className="feather-edit" />
                          </Link>
                          <Link
                            className="confirm-text p-2"
                            to="#"
                            onClick={showConfirmationAlert}
                          >
                            <i
                              data-feather="trash-2"
                              className="feather-trash-2"
                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Emily Rodriguez</td>
                      <td>Family Law</td>
                      <td>Dec 05, 2025, 10:19 PM </td>
                      <td>$15,200.00 </td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <Link className="me-2 p-2" to="#">
                            <i data-feather="edit" className="feather-edit" />
                          </Link>
                          <Link
                            className=" confirm-text p-2"
                            to="#"
                            onClick={showConfirmationAlert}
                          >
                            <i
                              data-feather="trash-2"
                              className="feather-trash-2"
                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>David Thompson</td>
                      <td>Estate Planning</td>
                      <td>Dec 05, 2025, 09:19 PM </td>
                      <td>$6,200.00 </td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <Link className="me-2 p-2" to="#">
                            <i data-feather="edit" className="feather-edit" />
                          </Link>
                          <Link
                            className=" confirm-text p-2"
                            to="#"
                            onClick={showConfirmationAlert}
                          >
                            <i
                              data-feather="trash-2"
                              className="feather-trash-2"
                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>David Thompson</td>
                      <td>Estate Planning</td>
                      <td>Dec 05, 2025, 09:19 PM </td>
                      <td>$6,200.00 </td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <Link
                            className="me-2 p-2"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit-units"
                          >
                            <i data-feather="edit" className="feather-edit" />
                          </Link>
                          <Link
                            className=" confirm-text p-2"
                            to="#"
                            onClick={showConfirmationAlert}
                          >
                            <i
                              data-feather="trash-2"
                              className="feather-trash-2"
                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
