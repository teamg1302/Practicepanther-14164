import React, { useState } from "react";
import CountUp from "react-countup";
import {
  File,
  User,
  UserCheck,
} from "feather-icons-react/build/IconComponents";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { checkPermission } from "../../Router/PermissionRoute";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
  ArrowRight,
  Users,
  Briefcase,
  FileText,
  AlertCircle,
  Calendar,
  CheckSquare,
  Clock,
  Zap,
  UserPlus,
  Plus,
  ChevronDown,
  MapPin,
  Award,
  CheckCircle,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Eye,
  Edit,
  Trash2,
  Bell,
  MessageCircle,
  Mail,
  Phone,
  Folder,
  BarChart2,
  PieChart,
  Search,
  Settings,
  ExternalLink,
  Send,
} from "react-feather";
import { all_routes } from "../../Router/all_routes";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const Dashboard = () => {
  const { t } = useTranslation();
  const route = all_routes;
  const permissions = useSelector((state) => state.auth?.permissions || []);
  
  // Permission checks for dashboard sections
  // Check for financial summary - use view_financial_summary or dashboard_financial_summary
  const hasFinancialSummaryPermission = 
    checkPermission(permissions, "view_financial_summary", "read") ||
    checkPermission(permissions, "dashboard_financial_summary", "read");
  const hasCasesPermission = checkPermission(permissions, "manage_matters", "read");
  const hasTimeEntriesPermission = checkPermission(permissions, "manage_time_entries", "read");
  const hasContactsPermission = checkPermission(permissions, "manage_contacts", "read");
  const hasDocumentsPermission = checkPermission(permissions, "manage_documents", "read");
  const hasCalendarPermission = checkPermission(permissions, "manage_calendar", "read");
  const hasTasksPermission = checkPermission(permissions, "manage_tasks", "read");
  const hasSettingsPermission = checkPermission(permissions, "manage_settings", "read");
  const hasActivitiesPermission = checkPermission(permissions, "manage_activities", "read");
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
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
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

  // Urgent Deadlines data
  const urgentDeadlines = [
    {
      id: 1,
      type: "Court Hearing",
      person: "Sarah Johnson",
      date: "Apr 25, 2023, 10:00 AM",
      location: "State Court",
      icon: Award,
      color: "#EA5455",
    },
    {
      id: 2,
      type: "File Motion",
      person: "Emily Rodriguez",
      date: "Apr 26, 2023",
      location: null,
      icon: CheckCircle,
      color: "#00CFE8",
    },
    {
      id: 3,
      type: "Discovery Deadline",
      person: "Jacob Myers",
      date: "Apr 28, 2023",
      location: null,
      icon: Calendar,
      color: "#EA5455",
    },
    {
      id: 4,
      type: "Deposition",
      person: "Michael Chen",
      date: "Apr 30, 2023, 2:00 PM",
      location: "Law Office - Conference Room A",
      icon: FileText,
      color: "#FF9800",
    },
  ];

  // Tasks data
  const tasks = [
    { id: 1, description: "Prepare for hearing: Johnson", time: "9:00 AM" },
    { id: 2, description: "Review contract: Chen Inc.", time: "12:00 PM" },
    { id: 3, description: "Return call to A. Patel.", time: "2:30 PM" },
    { id: 4, description: "Draft agreement: Rodriguez", time: "4:00 PM" },
    { id: 5, description: "Submit court filing: Thompson case", time: "5:00 PM" },
  ];

  // Recent Activities data
  const recentActivities = [
    {
      id: 1,
      type: "New Case",
      description: "Smith v. Johnson - Personal Injury",
      time: "2 hours ago",
      icon: Briefcase,
      color: "#00cfe8",
    },
    {
      id: 2,
      type: "Payment Received",
      description: "$5,000 from Acme Corp - Invoice #INV-2024-001",
      time: "5 hours ago",
      icon: DollarSign,
      color: "#28c76f",
    },
    {
      id: 3,
      type: "Document Signed",
      description: "Contract Agreement - Client: Jane Williams",
      time: "1 day ago",
      icon: FileText,
      color: "#ff9800",
    },
    {
      id: 4,
      type: "New Client",
      description: "Robert Martinez - Estate Planning",
      time: "2 days ago",
      icon: UserPlus,
      color: "#1e293b",
    },
  ];

  // Recent Cases data
  const recentCases = [
    {
      id: 1,
      client: "Sarah Johnson",
      caseType: "Personal Injury",
      date: "Dec 06, 2025",
      amount: "$12,500.00",
      status: "Active",
    },
    {
      id: 2,
      client: "Michael Chen",
      caseType: "Corporate Law",
      date: "Dec 05, 2025",
      amount: "$8,750.00",
      status: "Active",
    },
    {
      id: 3,
      client: "Emily Rodriguez",
      caseType: "Family Law",
      date: "Dec 05, 2025",
      amount: "$15,200.00",
      status: "Active",
    },
    {
      id: 4,
      client: "David Thompson",
      caseType: "Estate Planning",
      date: "Dec 04, 2025",
      amount: "$6,200.00",
      status: "Pending",
    },
    {
      id: 5,
      client: "Jennifer Martinez",
      caseType: "Employment Law",
      date: "Dec 03, 2025",
      amount: "$9,800.00",
      status: "Active",
    },
    {
      id: 6,
      client: "Robert Williams",
      caseType: "Real Estate",
      date: "Dec 02, 2025",
      amount: "$22,400.00",
      status: "Active",
    },
    {
      id: 7,
      client: "Lisa Anderson",
      caseType: "Criminal Defense",
      date: "Dec 01, 2025",
      amount: "$18,500.00",
      status: "Active",
    },
    {
      id: 8,
      client: "James Wilson",
      caseType: "Intellectual Property",
      date: "Nov 30, 2025",
      amount: "$14,300.00",
      status: "Pending",
    },
    {
      id: 9,
      client: "Patricia Brown",
      caseType: "Contract Dispute",
      date: "Nov 29, 2025",
      amount: "$7,600.00",
      status: "Active",
    },
    {
      id: 10,
      client: "Christopher Davis",
      caseType: "Tax Law",
      date: "Nov 28, 2025",
      amount: "$11,200.00",
      status: "Active",
    },
  ];

  // Upcoming Events data
  const upcomingEvents = [
    {
      id: 1,
      title: "Client Meeting",
      client: "Sarah Johnson",
      date: "Tomorrow, 10:00 AM",
      type: "meeting",
    },
    {
      id: 2,
      title: "Court Appearance",
      client: "Michael Chen",
      date: "Dec 15, 2025, 2:00 PM",
      type: "court",
    },
    {
      id: 3,
      title: "Document Review",
      client: "Emily Rodriguez",
      date: "Dec 16, 2025, 11:00 AM",
      type: "review",
    },
  ];

  // Recent Documents data
  const recentDocuments = [
    {
      id: 1,
      name: "Contract_Agreement_JWilliams.pdf",
      case: "Smith v. Johnson",
      date: "Dec 06, 2025",
      size: "2.4 MB",
      type: "pdf",
    },
    {
      id: 2,
      name: "Motion_to_Dismiss.docx",
      case: "Chen Inc. v. ABC Corp",
      date: "Dec 05, 2025",
      size: "1.8 MB",
      type: "doc",
    },
    {
      id: 3,
      name: "Discovery_Response.pdf",
      case: "Rodriguez Family Law",
      date: "Dec 04, 2025",
      size: "3.2 MB",
      type: "pdf",
    },
  ];

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          {/* Top Summary Cards */}
          <div className="row g-2 mb-1">
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash-orange w-100">
                <div className="dash-widgetimg">
                  <span>
                    <Users size={28} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <CountUp start={0} end={130} duration={3} />
                  </h5>
                  <h6>Team Members</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash-teal w-100">
                <div className="dash-widgetimg">
                  <span>
                    <Briefcase size={28} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <CountUp start={0} end={15} duration={3} />
                  </h5>
                  <h6>Live Cases</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash-blue w-100">
                <div className="dash-widgetimg">
                  <span>
                    <FileText size={28} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <CountUp start={0} end={185} duration={3} />
                  </h5>
                  <h6>Clients & Parties</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash-green w-100 position-relative">
                <div className="dash-widgetimg">
                  <span>
                    <FileText size={28} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <CountUp start={0} end={185} duration={3} />
                  </h5>
                  <h6>Request Payment(s)</h6>
                </div>
                <span className="badge badge-warning notification-badge">
                  !
                </span>
              </div>
            </div>
          </div>

          {/* Financial Summary Section */}
          {hasFinancialSummaryPermission && (
          <div className="row g-2 mb-1">
            <div className="col-xl-12 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0 d-flex align-items-center">
                    <DollarSign className="me-2" size={20} color="#28c76f" />
                    Financial Summary
                  </h4>
                  <div className="dropdown dropdown-wraper">
                    <button
                      className="btn btn-light btn-sm dropdown-toggle"
                      type="button"
                      id="financialDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      This Month
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="financialDropdown"
                    >
                      <li>
                        <Link to="#" className="dropdown-item">
                          This Month
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item">
                          This Quarter
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item">
                          This Year
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-2">
                    {/* Total Revenue */}
                    <div className="col-xl-3 col-md-6 col-sm-6 col-12">
                      <div className="financial-card">
                        <div className="financial-icon bg-success">
                          <TrendingUp size={24} color="#fff" />
                        </div>
                        <div className="financial-content">
                          <div className="financial-label text-muted small mb-1">
                            Total Revenue
                          </div>
                          <div className="financial-value fw-bold text-success">
                            $<CountUp start={0} end={125000} duration={2} decimals={0} />
                          </div>
                          {/* <div className="financial-change text-success small mt-1">
                            <TrendingUp size={12} className="me-1" />
                            +12.5% from last month
                          </div> */}
                        </div>
                      </div>
                    </div>

                    {/* Total Expenses */}
                    <div className="col-xl-3 col-md-6 col-sm-6 col-12">
                      <div className="financial-card">
                        <div className="financial-icon bg-danger">
                          <TrendingDown size={24} color="#fff" />
                        </div>
                        <div className="financial-content">
                          <div className="financial-label text-muted small mb-1">
                            Total Expenses
                          </div>
                          <div className="financial-value fw-bold text-danger">
                            $<CountUp start={0} end={45200} duration={2} decimals={0} />
                          </div>
                          {/* <div className="financial-change text-danger small mt-1">
                            <TrendingDown size={12} className="me-1" />
                            +5.2% from last month
                          </div> */}
                        </div>
                      </div>
                    </div>

                    

                    {/* Outstanding Invoices */}
                    <div className="col-xl-3 col-md-6 col-sm-6 col-12">
                      <div className="financial-card">
                        <div className="financial-icon bg-warning">
                          <FileText size={24} color="#fff" />
                        </div>
                        <div className="financial-content">
                          <div className="financial-label text-muted small mb-1">
                            Outstanding Invoices
                          </div>
                          <div className="financial-value fw-bold text-warning">
                            $<CountUp start={0} end={34200} duration={2} decimals={0} />
                          </div>
                          {/* <div className="financial-change text-muted small mt-1">
                            <span className="me-1">15</span> unpaid invoices
                          </div> */}
                        </div>
                      </div>
                    </div>

                    
                    <div className="col-xl-3 col-md-6 col-sm-6 col-12">
                      <div className="financial-card">
                        <div className="financial-icon bg-primary">
                          <DollarSign size={24} color="#fff" />
                        </div>
                        <div className="financial-content">
                          <div className="financial-label text-muted small mb-1">
                            Unbilled Amount
                          </div>
                          <div className="financial-value fw-bold text-primary">
                            $<CountUp start={0} end={79800} duration={2} decimals={0} />
                          </div>
                          {/* <div className="financial-change text-success small mt-1">
                            <TrendingUp size={12} className="me-1" />
                            +18.3% from last month
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Financial Metrics */}
                 
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Middle Section: Urgent Deadlines and My Tasks Today */}
          <div className="row g-2 mb-1">
            {/* Urgent Deadlines Section */}
            {hasCasesPermission && (
            <div className="col-xl-6 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0 d-flex align-items-center">
                    <AlertCircle className="me-2" size={20} color="#EA5455" />
                    Urgent Deadlines
                  </h4>
                  <div className="view-all-link">
                    <Link to="#" className="view-all d-flex align-items-center">
                      View All
                      <span className="ps-2 d-flex align-items-center">
                        <ArrowRight className="feather-16" />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="urgent-deadlines-list">
                    {urgentDeadlines.map((deadline) => {
                      const IconComponent = deadline.icon;
                      return (
                        <div
                          key={deadline.id}
                          className="deadline-item d-flex align-items-start justify-content-between mb-2"
                        >
                          <div className="d-flex align-items-start flex-grow-1">
                            <div
                              className="deadline-icon me-3"
                              style={{ backgroundColor: deadline.color }}
                            >
                              <IconComponent size={20} color="#fff" />
                            </div>
                            <div className="deadline-content">
                              <div className="deadline-type fw-bold">
                                {deadline.type}
                              </div>
                              <div className="deadline-person d-flex align-items-center">
                                {deadline.person}
                                <ChevronDown size={16} className="ms-1" />
                              </div>
                            </div>
                          </div>
                          <div className="deadline-meta text-end">
                            <div className="deadline-date text-muted small">
                              {deadline.date}
                            </div>
                            {deadline.location && (
                              <div className="deadline-location text-muted small d-flex align-items-center justify-content-end">
                                <MapPin size={14} className="me-1" />
                                {deadline.location}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* My Tasks Today Section */}
            {hasTasksPermission && (
            <div className="col-xl-6 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">My Tasks Today</h4>
                  <div className="view-all-link">
                    <Link to="#" className="view-all d-flex align-items-center">
                      View All
                      <span className="ps-2 d-flex align-items-center">
                        <ArrowRight className="feather-16" />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="tasks-list">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="task-item d-flex align-items-center mb-3"
                      >
                        <input
                          type="checkbox"
                          className="form-check-input me-3"
                          style={{ width: "18px", height: "18px" }}
                        />
                        <div className="task-content flex-grow-1">
                          <div className="task-description">{task.description}</div>
                        </div>
                        <div className="task-time text-muted">{task.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Bottom Section: Fast Actions and Placeholder */}
          <div className="row g-2">
            {/* Fast Actions Section */}
            {(hasContactsPermission || hasCasesPermission || hasTimeEntriesPermission) && (
            <div className="col-xl-6 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0 d-flex align-items-center">
                    <Zap className="me-2" size={20} color="#FFC107" />
                    Fast Actions
                  </h4>
                  <div className="view-all-link">
                    <Link to="#" className="view-all d-flex align-items-center">
                      View All
                      <span className="ps-2 d-flex align-items-center">
                        <ArrowRight className="feather-16" />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="fast-actions-grid">
                    <Link to="#" className="fast-action-btn">
                      <div className="fast-action-icon">
                        <UserPlus size={28} />
                      </div>
                      <div className="fast-action-label">New Client</div>
                    </Link>
                    <Link to="#" className="fast-action-btn">
                      <div className="fast-action-icon">
                        <Briefcase size={28} />
                      </div>
                      <div className="fast-action-label">New Case</div>
                    </Link>
                    <Link to="#" className="fast-action-btn">
                      <div className="fast-action-icon">
                        <Clock size={28} />
                      </div>
                      <div className="fast-action-label">Log Time</div>
                    </Link>
                    <Link to="#" className="fast-action-btn">
                      <div className="fast-action-icon">
                        <FileText size={28} />
                      </div>
                      <div className="fast-action-label">Case Note</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Revenue Overview Section */}
            {hasFinancialSummaryPermission && (
            <div className="col-xl-6 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0 d-flex align-items-center">
                    <BarChart2 className="me-2" size={20} color="#00cfe8" />
                    Revenue Overview
                  </h4>
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
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="bar"
                    height={320}
                  />
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Recent Activities Section */}
          {hasCasesPermission && (
          <div className="row g-2 mb-1">
            <div className="col-xl-12 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0 d-flex align-items-center">
                    <Activity className="me-2" size={20} color="#28c76f" />
                    Recent Activities
                  </h4>
                  <div className="view-all-link">
                    <Link to="#" className="view-all d-flex align-items-center">
                      View All
                      <span className="ps-2 d-flex align-items-center">
                        <ArrowRight className="feather-16" />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="activities-list">
                    {recentActivities.map((activity) => {
                      const IconComponent = activity.icon;
                      return (
                        <div
                          key={activity.id}
                          className="activity-item d-flex align-items-start mb-2"
                        >
                          <div
                            className="activity-icon me-3"
                            style={{ backgroundColor: activity.color }}
                          >
                            <IconComponent size={18} color="#fff" />
                          </div>
                          <div className="activity-content flex-grow-1">
                            <div className="activity-type fw-bold mb-1">
                              {activity.type}
                            </div>
                            <div className="activity-description text-muted small mb-1">
                              {activity.description}
                            </div>
                            <div className="activity-time text-muted" style={{ fontSize: "12px" }}>
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Upcoming Events and Recent Documents */}
          <div className="row g-2 mb-1">
            {/* Upcoming Events Section */}
            {hasCalendarPermission && (
            <div className="col-xl-6 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0 d-flex align-items-center">
                    <Calendar className="me-2" size={20} color="#ff9800" />
                    Upcoming Events
                  </h4>
                  <div className="view-all-link">
                    <Link to="#" className="view-all d-flex align-items-center">
                      View All
                      <span className="ps-2 d-flex align-items-center">
                        <ArrowRight className="feather-16" />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="events-list">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="event-item d-flex align-items-start mb-3"
                      >
                        <div
                          className={`event-icon me-3 ${
                            event.type === "court"
                              ? "bg-danger"
                              : event.type === "meeting"
                              ? "bg-primary"
                              : "bg-info"
                          }`}
                        >
                          {event.type === "court" ? (
                            <Award size={18} color="#fff" />
                          ) : event.type === "meeting" ? (
                            <Users size={18} color="#fff" />
                          ) : (
                            <FileText size={18} color="#fff" />
                          )}
                        </div>
                        <div className="event-content flex-grow-1">
                          <div className="event-title fw-bold mb-1">
                            {event.title}
                          </div>
                          <div className="event-client text-muted small mb-1">
                            {event.client}
                          </div>
                          <div className="event-date text-muted" style={{ fontSize: "12px" }}>
                            <Clock size={12} className="me-1" />
                            {event.date}
                          </div>
                        </div>
                      </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Recent Documents Section */}
            {hasDocumentsPermission && (
            <div className="col-xl-6 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0 d-flex align-items-center">
                    <Folder className="me-2" size={20} color="#1e293b" />
                    Recent Documents
                  </h4>
                  <div className="view-all-link">
                    <Link to="#" className="view-all d-flex align-items-center">
                      View All
                      <span className="ps-2 d-flex align-items-center">
                        <ArrowRight className="feather-16" />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="documents-list">
                    {recentDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="document-item d-flex align-items-center mb-2"
                      >
                        <div
                          className={`document-icon me-3 ${
                            doc.type === "pdf" ? "bg-danger" : "bg-primary"
                          }`}
                        >
                          <FileText size={18} color="#fff" />
                        </div>
                        <div className="document-content flex-grow-1">
                          <div className="document-name fw-medium mb-1">
                            {doc.name}
                          </div>
                          <div className="document-meta text-muted small d-flex align-items-center">
                            <span className="me-3">{doc.case}</span>
                            <span className="me-3">{doc.date}</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                        <div className="document-actions d-flex gap-2">
                          <button className="btn btn-sm btn-light p-2">
                            <Eye size={16} />
                          </button>
                          <button className="btn btn-sm btn-light p-2">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* New Sections: Unbilled Work + Recent Cases Table (Left) and Right Column */}
          <div className="row g-2 mb-1">
            {/* Left Column: Unbilled Work and Recent Cases Table */}
            <div className="col-xl-8 col-lg-8 col-md-12 col-12">
              <div className="d-flex flex-column" style={{ gap: "8px" }}>
                {/* Unbilled Work Card */}
                {hasTimeEntriesPermission && (
                <div className="card flex-fill">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0 d-flex align-items-center">
                      <Send className="me-2" size={20} color="#ffc107" />
                      Unbilled Work
                    </h4>
                    <div className="view-all-link">
                      <Link to="#" className="view-all d-flex align-items-center">
                        View All
                        <span className="ps-2 d-flex align-items-center">
                          <ArrowRight className="feather-16" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="unbilled-work-content">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <div className="unbilled-hours fw-bold" style={{ fontSize: "32px", color: "#1b2850" }}>
                            4.50 Hours
                          </div>
                          <div className="unbilled-amount fw-bold mt-2" style={{ fontSize: "24px", color: "#28c76f" }}>
                            $1,125.00
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <DollarSign size={32} color="#28c76f" className="me-2" />
                          <span className="fw-bold" style={{ fontSize: "28px", color: "#1b2850" }}>
                            $6,200.00
                          </span>
                        </div>
                      </div>
                      <div className="unbilled-status-badge">
                        <span className="badge bg-warning text-dark px-3 py-2" style={{ fontSize: "12px", fontWeight: 600 }}>
                          a.30 lits, not billed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Recent Cases Table */}
                {hasCasesPermission && (
                <div className="card flex-fill">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0 d-flex align-items-center">
                      <Briefcase className="me-2" size={20} color="#1e293b" />
                      Recent Cases
                    </h4>
                    <div className="view-all-link">
                      <Link to="#" className="view-all d-flex align-items-center">
                        View All
                        <span className="ps-2 d-flex align-items-center">
                          <ArrowRight className="feather-16" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Client</th>
                            <th>Case Type</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentCases.map((caseItem) => (
                            <tr key={caseItem.id}>
                              <td className="fw-medium">{caseItem.client}</td>
                              <td className="text-muted">{caseItem.caseType}</td>
                              <td className="text-muted">{caseItem.date}</td>
                              <td className="fw-bold text-success">{caseItem.amount}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    caseItem.status === "Active"
                                      ? "bg-success"
                                      : "bg-warning"
                                  }`}
                                >
                                  {caseItem.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Right Column: Unpaid Card, Recent Cases with Search, Settings, Company Portal */}
            <div className="col-xl-4 col-lg-4 col-md-12 col-12">
              <div className="d-flex flex-column" style={{ gap: "8px" }}>
                {/* Unpaid Card */}
                {hasFinancialSummaryPermission && (
                <div className="card flex-fill unpaid-card">
                  <div className="card-header unpaid-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0 text-black fw-bold">
                      $1,450.00 Unpaid
                    </h4>
                  </div>
                  <div className="card-body">
                    <div className="unpaid-metrics">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Flat Fees</span>
                        <span className="fw-bold" style={{ fontSize: "18px", color: "#1b2850" }}>
                          $6,200.00
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Recent Cases 8a</span>
                        <span className="fw-bold" style={{ fontSize: "18px", color: "#1b2850" }}>
                          $5,400.00
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Recent Cases with Search */}
                {hasCasesPermission && (
                <div className="card flex-fill">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0">Recent Cases</h4>
                    <div className="view-all-link">
                      <Link to="#" className="view-all d-flex align-items-center">
                        View All
                        <span className="ps-2 d-flex align-items-center">
                          <ArrowRight className="feather-16" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="search-box mb-3">
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Search size={16} />
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Search cases..."
                          style={{ fontSize: "14px" }}
                        />
                      </div>
                    </div>
                    <div className="recent-cases-list">
                      <div className="d-flex justify-content-between align-items-center mb-3 p-2 rounded" style={{ background: "#f8fafc" }}>
                        <div className="d-flex align-items-center">
                          <div className="me-3" style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#e0f7fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Users size={18} color="#00cfe8" />
                          </div>
                          <span className="fw-medium">Recent Cases</span>
                        </div>
                        <span className="fw-bold text-primary">$1,250.00</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ background: "#f8fafc" }}>
                        <div className="d-flex align-items-center">
                          <div className="me-3" style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Calendar size={18} color="#28c76f" />
                          </div>
                          <span className="fw-medium">Tasks & Calendar</span>
                        </div>
                        <span className="fw-bold text-success">$620.00</span>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Settings Section */}
                {hasSettingsPermission && (
                <div className="card flex-fill">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0 d-flex align-items-center">
                      <Settings className="me-2" size={20} color="#1e293b" />
                      Settings
                    </h4>
                    <div className="view-all-link">
                      <Link to="#" className="view-all d-flex align-items-center">
                        View All
                        <span className="ps-2 d-flex align-items-center">
                          <ArrowRight className="feather-16" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="settings-list">
                      <Link to="#" className="d-flex justify-content-between align-items-center mb-3 p-2 rounded text-decoration-none" style={{ background: "#f8fafc", color: "#1b2850" }}>
                        <div className="d-flex align-items-center">
                          <div className="me-3" style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <UserPlus size={18} color="#28c76f" />
                          </div>
                          <span className="fw-medium">User Management</span>
                        </div>
                        <ChevronDown size={16} className="text-muted" style={{ transform: "rotate(-90deg)" }} />
                      </Link>
                      <Link to="#" className="d-flex justify-content-between align-items-center mb-3 p-2 rounded text-decoration-none" style={{ background: "#f8fafc", color: "#1b2850" }}>
                        <div className="d-flex align-items-center">
                          <div className="me-3" style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fff5e6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Briefcase size={18} color="#ff9800" />
                          </div>
                          <span className="fw-medium">Case Settings</span>
                        </div>
                        <ChevronDown size={16} className="text-muted" style={{ transform: "rotate(-90deg)" }} />
                      </Link>
                      <Link to="#" className="d-flex justify-content-between align-items-center p-2 rounded text-decoration-none" style={{ background: "#f8fafc", color: "#1b2850" }}>
                        <div className="d-flex align-items-center">
                          <div className="me-3" style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#e0f7fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <DollarSign size={18} color="#00cfe8" />
                          </div>
                          <span className="fw-medium">Billing & Payments</span>
                        </div>
                        <ChevronDown size={16} className="text-muted" style={{ transform: "rotate(-90deg)" }} />
                      </Link>
                    </div>
                  </div>
                </div>
                )}

                {/* Company Portal Section */}
                {hasCasesPermission && (
                <div className="card flex-fill">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0">Company Portal</h4>
                    <div className="view-all-link">
                      <Link to="#" className="view-all d-flex align-items-center">
                        View All
                        <span className="ps-2 d-flex align-items-center">
                          <ArrowRight className="feather-16" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="company-portal-list">
                      <Link to="#" className="d-flex justify-content-between align-items-center mb-3 p-2 rounded text-decoration-none" style={{ background: "#f8fafc", color: "#1b2850" }}>
                        <div className="d-flex align-items-center">
                          <div className="me-3" style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fff5e6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FileText size={18} color="#ff9800" />
                          </div>
                          <span className="fw-medium">CoPapers</span>
                        </div>
                        <ChevronDown size={16} className="text-muted" style={{ transform: "rotate(-90deg)" }} />
                      </Link>
                      <Link to="#" className="d-flex justify-content-between align-items-center p-2 rounded text-decoration-none" style={{ background: "#f8fafc", color: "#1b2850" }}>
                        <div className="d-flex align-items-center">
                          <div className="me-3" style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#e0f7fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Users size={18} color="#00cfe8" />
                          </div>
                          <span className="fw-medium">LaPortos</span>
                        </div>
                        <ChevronDown size={16} className="text-muted" style={{ transform: "rotate(-90deg)" }} />
                      </Link>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
