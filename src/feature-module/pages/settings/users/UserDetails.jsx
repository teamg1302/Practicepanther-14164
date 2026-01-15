/**
 * User Details page component.
 * @module feature-module/pages/settings/users/UserDetails
 *
 * Displays detailed information about a team member including:
 * - Profile information (name, email, phone)
 * - Role and timezone
 * - Status and activity information
 * - Created/updated timestamps
 * - Two Factor Authentication status
 * - Permissions by module
 *
 * @component
 */

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Chip, Tabs, Tab, Box } from "@mui/material";
import {
  Edit,
  Email,
  Phone,
  Security,
  Work,
  Business,
  AccessTime,
  CalendarToday,
  Add,
  Visibility,
  Delete,
  ArrowForward,
  Assignment,
} from "@mui/icons-material";

import { getUserDetails } from "@/core/services/userService";
import { getContacts } from "@/core/services/contactsService";
import { getMatters } from "@/core/services/mattersService";
import { getTimeEntries } from "@/core/services/timeEntryService";
import { all_routes } from "@/Router/all_routes";
import ListPageLayout from "@/feature-module/components/list-page-layout";
import { formatToTitleCase } from "@/core/utilities/stringFormatter";
import EntityListView from "@/feature-module/components/entity-list-view";
import withEntityHandlers from "@/feature-module/hoc/withEntityHandlers";
import { getTableColumns } from "@/feature-module/components/table-columns";

/**
 * UserDetails component for displaying team member information.
 * @component
 * @returns {JSX.Element} User details page
 */
const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [contactsFilters] = useState({});
  const [mattersFilters] = useState({});
  const [timeEntriesFilters] = useState({});
  const [dashboardStats, setDashboardStats] = useState({
    totalContacts: 0,
    totalMatters: 0,
    totalTimeEntries: 0,
    totalBillableHours: 0,
    hoursToday: 0,
    hoursThisWeek: 0,
    hoursThisMonth: 0,
    hoursThisYear: 0,
  });
  const [agendaItems, setAgendaItems] = useState([]);

  // Contacts columns
  const contactsColumns = useMemo(() => {
    const COLUMNS_CONFIG = [
      {
        header: "Name",
        accessorKey: "name",
        detailRoute: all_routes.contactDetails.path,
      },
      { header: "Email", accessorKey: "email" },
      { header: "Phone", accessorKey: "phoneMobile" },
      { header: "Location", accessorKey: "city" },
      { header: "Created At", accessorKey: "createdAt", type: "date" },
    ];
    return getTableColumns(COLUMNS_CONFIG, { navigate });
  }, [navigate]);

  // Matters columns
  const mattersColumns = useMemo(() => {
    const COLUMNS_CONFIG = [
      {
        header: "Name",
        accessorKey: "name",
        detailRoute: all_routes.matterDetails.path,
      },
      { header: "Description", accessorKey: "description" },
      { header: "Contact", accessorKey: "contactId.name", type: "nested" },
      { header: "Status", accessorKey: "status" },
      { header: "Created At", accessorKey: "createdAt", type: "date" },
    ];
    return getTableColumns(COLUMNS_CONFIG, { navigate });
  }, [navigate]);

  // Time Entries columns
  const timeEntriesColumns = useMemo(() => {
    const COLUMNS_CONFIG = [
      { header: "Date", accessorKey: "date", type: "date" },
      { header: "Description", accessorKey: "description" },
      { header: "Contact", accessorKey: "contactId.name", type: "nested" },
      { header: "Matter", accessorKey: "matterId.name", type: "nested" },
      { header: "Time", accessorKey: "totalTime" },
      {
        header: "Billable",
        accessorKey: "isBillable",
        type: "chip",
        chipMap: {
          true: { label: "Yes", color: "success" },
          false: { label: "No", color: "default" },
        },
      },
      { header: "Created At", accessorKey: "createdAt", type: "date" },
    ];
    return getTableColumns(COLUMNS_CONFIG, { navigate });
  }, [navigate]);

  // Service functions with userId filter
  const getContactsByUserId = async (params = {}) => {
    const response = await getContacts({
      ...params,
      // Note: API may need to filter by assignedTo on backend
      // For now, we'll pass it and let the API handle it
    });
    // Filter by assignedTo on frontend if needed
    if (response?.list) {
      response.list = response.list.filter(
        (contact) =>
          contact.assignedTo?._id === userId || contact.assignedTo === userId
      );
    }
    return response;
  };

  const getMattersByUserId = async (params = {}) => {
    const response = await getMatters({
      ...params,
      // Note: API may need to filter by assignedTo on backend
      // For now, we'll pass it and let the API handle it
    });
    // Filter by assignedTo on frontend if needed
    if (response?.list) {
      response.list = response.list.filter(
        (matter) =>
          matter.assignedTo?._id === userId || matter.assignedTo === userId
      );
    }
    return response;
  };

  const getTimeEntriesByUserId = async (params = {}) => {
    const response = await getTimeEntries({
      ...params,
      userId: userId, // Filter by user ID
    });
    return response;
  };

  const EnhancedContactsList = withEntityHandlers(EntityListView);
  const EnhancedMattersList = withEntityHandlers(EntityListView);
  const EnhancedTimeEntriesList = withEntityHandlers(EntityListView);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const userData = await getUserDetails(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
        Swal.fire({
          title: "Error",
          text: error?.message || "Failed to load user details",
          icon: "error",
        });
        navigate(all_routes.settings[1].children[0].path);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId, navigate]);

  // Helper function to parse time string to hours
  const parseTimeToHours = (timeString) => {
    if (!timeString) return 0;
    const timeParts = timeString.split(":");
    const hours = parseFloat(timeParts[0]) || 0;
    const minutes = parseFloat(timeParts[1]) || 0;
    return hours + minutes / 60;
  };

  // Helper function to check if date is within range
  const isDateInRange = (dateString, startDate, endDate) => {
    const date = new Date(dateString);
    return date >= startDate && date <= endDate;
  };

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!userId) return;

      try {
        // Fetch contacts count
        const contactsResponse = await getContactsByUserId({ limit: 1 });
        const contactsCount =
          contactsResponse?.total || contactsResponse?.list?.length || 0;

        // Fetch matters count
        const mattersResponse = await getMattersByUserId({ limit: 1 });
        const mattersCount =
          mattersResponse?.total || mattersResponse?.list?.length || 0;

        // Fetch all time entries for calculations
        const timeEntriesResponse = await getTimeEntriesByUserId({
          limit: 1000,
        });
        const timeEntriesList = timeEntriesResponse?.list || [];
        const timeEntriesCount =
          timeEntriesResponse?.total || timeEntriesList.length;

        // Calculate hours for different periods
        const now = new Date();
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const yearStart = new Date(now.getFullYear(), 0, 1);

        let hoursToday = 0;
        let hoursThisWeek = 0;
        let hoursThisMonth = 0;
        let hoursThisYear = 0;
        let totalBillableHours = 0;

        timeEntriesList.forEach((entry) => {
          if (entry.date && entry.totalTime) {
            const entryDate = new Date(entry.date);
            const hours = parseTimeToHours(entry.totalTime);

            if (isDateInRange(entryDate, todayStart, now)) {
              hoursToday += hours;
            }
            if (isDateInRange(entryDate, weekStart, now)) {
              hoursThisWeek += hours;
            }
            if (isDateInRange(entryDate, monthStart, now)) {
              hoursThisMonth += hours;
            }
            if (isDateInRange(entryDate, yearStart, now)) {
              hoursThisYear += hours;
            }

            if (entry.isBillable) {
              totalBillableHours += hours;
            }
          }
        });

        setDashboardStats({
          totalContacts: contactsCount,
          totalMatters: mattersCount,
          totalTimeEntries: timeEntriesCount,
          totalBillableHours: totalBillableHours.toFixed(2),
          hoursToday: hoursToday.toFixed(2),
          hoursThisWeek: hoursThisWeek.toFixed(2),
          hoursThisMonth: hoursThisMonth.toFixed(2),
          hoursThisYear: hoursThisYear.toFixed(2),
        });

        // TODO: Fetch agenda items (tasks/overdue items)
        // For now, set empty array
        setAgendaItems([]);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    if (tabValue === 1) {
      // Only fetch when Dashboard tab is active
      fetchDashboardStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, tabValue]);

  const handleEdit = () => {
    navigate(all_routes.editUser.path.replace(":userId", userId));
  };

  if (loading) {
    return (
      <ListPageLayout
        breadcrumbs={[
          {
            label: "Settings",
            redirect: all_routes.settings[0].path,
          },
          {
            label: "Team Members",
            redirect: all_routes.settings[1].children[0].path,
          },
          {
            label: "Details",
            redirect: "#",
          },
        ]}
        isSettingsLayout={true}
        title={t("Team Member Details")}
        subtitle="View team member information"
      >
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </ListPageLayout>
    );
  }

  if (!user) {
    return (
      <ListPageLayout
        breadcrumbs={[
          {
            label: "Settings",
            redirect: all_routes.settings[0].path,
          },
          {
            label: "Team Members",
            redirect: all_routes.settings[1].children[0].path,
          },
          {
            label: "Details",
            redirect: "#",
          },
        ]}
        isSettingsLayout={true}
        title={t("Team Member Details")}
        subtitle="View team member information"
      >
        <div className="alert alert-warning">User not found</div>
      </ListPageLayout>
    );
  }

  // Format permissions data
  const permissions = user?.permissions || user?.roleId?.permissions || [];
  const moduleCount = permissions.length;
  const twoFactorDays = user?.twoFactorAuth?.days || 0;
  const isTwoFactorEnabled = twoFactorDays > 0;

  // Format date for Last Login
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get access level for a module
  const getAccessLevel = (permission) => {
    const actions = permission?.actions || {};
    const hasCreate = actions.create || false;
    const hasRead = actions.read || false;
    const hasUpdate = actions.update || false;
    const hasDelete = actions.delete || false;

    const hasAll = hasCreate && hasRead && hasUpdate && hasDelete;
    const hasAny = hasCreate || hasRead || hasUpdate || hasDelete;

    if (hasAll) {
      return "Full Access";
    } else if (hasAny) {
      return "Limited Access";
    } else {
      return "No Access";
    }
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // TabPanel component
  const TabPanel = ({ children, value, index }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`user-tabpanel-${index}`}
        aria-labelledby={`user-tab-${index}`}
      >
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
      </div>
    );
  };

  TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
  };

  return (
    <>
      <style>
        {`
          .permission-module-card {
            transition: box-shadow 0.3s ease;
          }
          .permission-module-card:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
          }
        `}
      </style>
      <ListPageLayout
        breadcrumbs={[
          {
            label: "Settings",
            redirect: all_routes.settings[0].path,
          },
          {
            label: "Team Members",
            redirect: all_routes.settings[1].children[0].path,
          },
          {
            label: user.name || "Details",
            redirect: "#",
          },
        ]}
        isSettingsLayout={true}
        title={user.name || t("Team Member Details")}
        subtitle="View team member information"
        actions={{
          addButton: {
            text: "Edit",
            onClick: handleEdit,
            icon: <Edit fontSize="small" className="me-1 iconsize" />,
          },
        }}
      >
        <div className="card">
          <div className="card-body">
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="user details tabs"
              >
                <Tab label="Basic Information" id="user-tab-0" />
                <Tab label="Dashboard" id="user-tab-1" />
                <Tab label="Clients" id="user-tab-2" />
                <Tab label="Cases" id="user-tab-3" />
                <Tab label="Time Entries" id="user-tab-4" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <div className="row">
                {/* Left Column - USER INFORMATION */}
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="card">
                    <div className="card-body">
                      <h5
                        className="card-title mb-4"
                        style={{
                          fontWeight: 600,
                          textTransform: "uppercase",
                          color: "#333",
                        }}
                      >
                        USER INFORMATION
                      </h5>

                      <div className="user-info-list">
                        {/* Email */}
                        <div className="d-flex align-items-center mb-3">
                          <Email
                            fontSize="small"
                            className="me-3"
                            style={{ color: "#6c757d" }}
                          />
                          <div className="flex-grow-1">
                            <span className="text-muted small">Email</span>
                            <div>
                              <a
                                href={`mailto:${user.email}`}
                                className="text-primary text-decoration-none"
                                style={{ fontWeight: 500 }}
                              >
                                {user.email || "-"}
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="d-flex align-items-center mb-3">
                          <Phone
                            fontSize="small"
                            className="me-3"
                            style={{ color: "#6c757d" }}
                          />
                          <div className="flex-grow-1">
                            <span className="text-muted small">Phone</span>
                            <div style={{ fontWeight: 500 }}>
                              {user.phone || "-"}
                            </div>
                          </div>
                        </div>

                        {/* Role */}
                        <div className="d-flex align-items-center mb-3">
                          <Security
                            fontSize="small"
                            className="me-3"
                            style={{ color: "#6c757d" }}
                          />
                          <div className="flex-grow-1">
                            <span className="text-muted small">Role</span>
                            <div style={{ fontWeight: 600 }}>
                              {user.roleId?.name || user.role?.name || "-"}
                            </div>
                          </div>
                        </div>

                        {/* Job Title */}
                        {user.jobTitleId?.name && (
                          <div className="d-flex align-items-center mb-3">
                            <Work
                              fontSize="small"
                              className="me-3"
                              style={{ color: "#6c757d" }}
                            />
                            <div className="flex-grow-1">
                              <span className="text-muted small">
                                Job Title
                              </span>
                              <div style={{ fontWeight: 600 }}>
                                {user.jobTitleId.name}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Firm */}
                        {user.firmId?.name && (
                          <div className="d-flex align-items-center mb-3">
                            <Business
                              fontSize="small"
                              className="me-3"
                              style={{ color: "#6c757d" }}
                            />
                            <div className="flex-grow-1">
                              <span className="text-muted small">Firm</span>
                              <div style={{ fontWeight: 600 }}>
                                {user.firmId.name}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Timezone */}
                        <div className="d-flex align-items-center mb-3">
                          <AccessTime
                            fontSize="small"
                            className="me-3"
                            style={{ color: "#6c757d" }}
                          />
                          <div className="flex-grow-1">
                            <span className="text-muted small">Timezone</span>
                            <div style={{ fontWeight: 600 }}>
                              {user.timezoneId?.name ||
                                user.timezone?.name ||
                                "-"}
                            </div>
                          </div>
                        </div>

                        {/* Last Login */}
                        {user.lastLogin && (
                          <div className="d-flex align-items-center mb-3">
                            <CalendarToday
                              fontSize="small"
                              className="me-3"
                              style={{ color: "#6c757d" }}
                            />
                            <div className="flex-grow-1">
                              <span className="text-muted small">
                                Last Login
                              </span>
                              <div style={{ fontWeight: 500 }}>
                                {formatDate(user.lastLogin)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - ADDITIONAL INFORMATION */}
                <div className="col-lg-8 col-md-6 col-sm-12">
                  <div className="card">
                    <div className="card-body">
                      <h5
                        className="card-title mb-4"
                        style={{
                          fontWeight: 600,
                          textTransform: "uppercase",
                          color: "#333",
                        }}
                      >
                        ADDITIONAL INFORMATION
                      </h5>

                      {/* Two Factor Authentication */}
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <span
                            className="text-muted"
                            style={{ fontWeight: 500 }}
                          >
                            Two Factor Authentication
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <Chip
                            label={isTwoFactorEnabled ? "Enabled" : "Disabled"}
                            color={isTwoFactorEnabled ? "success" : "default"}
                            size="small"
                            style={{ fontWeight: 500 }}
                          />
                          {isTwoFactorEnabled && (
                            <span className="text-muted small ms-2">
                              (Valid for {twoFactorDays} days)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Permissions */}
                      <div>
                        <div className="d-flex align-items-center mb-3">
                          <Security
                            fontSize="small"
                            className="me-2"
                            style={{ color: "#6c757d" }}
                          />
                          <span
                            className="text-muted"
                            style={{ fontWeight: 500 }}
                          >
                            Permissions ({moduleCount} modules)
                          </span>
                        </div>

                        {permissions.length > 0 ? (
                          <div className="row">
                            {permissions.map((permission, index) => (
                              <div key={index} className="col-md-6 mb-3">
                                <div
                                  className="permission-module-card p-3 "
                                  style={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    backgroundColor: "#fafafa",
                                    minHeight: "120px",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div className="d-flex align-items-center mb-2">
                                    <div
                                      className="me-2"
                                      style={{
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        backgroundColor: "#1976d2",
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontWeight: 500,
                                        fontSize: "14px",
                                      }}
                                    >
                                      {formatToTitleCase(permission.moduleName)}
                                    </span>
                                  </div>
                                  <div className="mb-2">
                                    <Chip
                                      label={getAccessLevel(permission)}
                                      color={
                                        getAccessLevel(permission) ===
                                        "Full Access"
                                          ? "success"
                                          : getAccessLevel(permission) ===
                                            "Limited Access"
                                          ? "warning"
                                          : "error"
                                      }
                                      size="small"
                                      style={{
                                        fontWeight: 500,
                                        fontSize: "11px",
                                      }}
                                    />
                                  </div>
                                  <div
                                    className="d-flex gap-1 flex-wrap"
                                    style={{ alignItems: "flex-start" }}
                                  >
                                    {permission.actions?.create && (
                                      <button
                                        className="btn btn-sm"
                                        style={{
                                          backgroundColor: "#1976d2",
                                          color: "white",
                                          border: "none",
                                          borderRadius: "4px",
                                          padding: "2px 8px",
                                          fontSize: "11px",
                                        }}
                                      >
                                        <Add
                                          fontSize="inherit"
                                          className="me-1"
                                        />
                                        Create
                                      </button>
                                    )}
                                    {permission.actions?.read && (
                                      <button
                                        className="btn btn-sm"
                                        style={{
                                          backgroundColor: "#4caf50",
                                          color: "white",
                                          border: "none",
                                          borderRadius: "4px",
                                          padding: "2px 8px",
                                          fontSize: "11px",
                                        }}
                                      >
                                        <Visibility
                                          fontSize="inherit"
                                          className="me-1"
                                        />
                                        Read
                                      </button>
                                    )}
                                    {permission.actions?.update && (
                                      <button
                                        className="btn btn-sm"
                                        style={{
                                          backgroundColor: "#ff9800",
                                          color: "white",
                                          border: "none",
                                          borderRadius: "4px",
                                          padding: "2px 8px",
                                          fontSize: "11px",
                                        }}
                                      >
                                        <Edit
                                          fontSize="inherit"
                                          className="me-1"
                                        />
                                        Update
                                      </button>
                                    )}
                                    {permission.actions?.delete && (
                                      <button
                                        className="btn btn-sm"
                                        style={{
                                          backgroundColor: "#f44336",
                                          color: "white",
                                          border: "none",
                                          borderRadius: "4px",
                                          padding: "2px 8px",
                                          fontSize: "11px",
                                        }}
                                      >
                                        <Delete
                                          fontSize="inherit"
                                          className="me-1"
                                        />
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted">
                            No permissions assigned
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Dashboard Tab */}
            <TabPanel value={tabValue} index={1}>
              <div className="row">
                {/* USER'S HOURS Section */}
                <div className="col-12 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="d-flex justify-content-between align-items-center mb-4"
                        style={{
                          borderBottom: "1px solid #e8ebed",
                          paddingBottom: "16px",
                        }}
                      >
                        <h5
                          className="mb-0"
                          style={{
                            fontWeight: 700,
                            textTransform: "uppercase",
                            color: "#1b2850",
                            fontSize: "16px",
                          }}
                        >
                          {user?.name?.toUpperCase() || "USER"}&apos;S HOURS
                        </h5>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setTabValue(4); // Navigate to Time Entries tab
                          }}
                          style={{
                            fontWeight: 700,
                            textTransform: "uppercase",
                            color: "#5b6670",
                            textDecoration: "none",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          ALL TIME ENTRIES
                          <ArrowForward fontSize="small" />
                        </a>
                      </div>

                      <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                          <div
                            style={{
                              border: "1px solid #e8ebed",
                              borderRadius: "4px",
                              padding: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                textTransform: "uppercase",
                                color: "#5b6670",
                                fontSize: "12px",
                              }}
                            >
                              HOURS TODAY
                            </span>
                            <span
                              style={{
                                fontWeight: 600,
                                color: "#ffb800",
                                fontSize: "24px",
                              }}
                            >
                              {dashboardStats.hoursToday}
                            </span>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                          <div
                            style={{
                              border: "1px solid #e8ebed",
                              borderRadius: "4px",
                              padding: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                textTransform: "uppercase",
                                color: "#5b6670",
                                fontSize: "12px",
                              }}
                            >
                              HOURS THIS WEEK
                            </span>
                            <span
                              style={{
                                fontWeight: 600,
                                color: "#ffb800",
                                fontSize: "24px",
                              }}
                            >
                              {dashboardStats.hoursThisWeek}
                            </span>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                          <div
                            style={{
                              border: "1px solid #e8ebed",
                              borderRadius: "4px",
                              padding: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                textTransform: "uppercase",
                                color: "#5b6670",
                                fontSize: "12px",
                              }}
                            >
                              HOURS THIS MONTH
                            </span>
                            <span
                              style={{
                                fontWeight: 600,
                                color: "#ffb800",
                                fontSize: "24px",
                              }}
                            >
                              {dashboardStats.hoursThisMonth}
                            </span>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                          <div
                            style={{
                              border: "1px solid #e8ebed",
                              borderRadius: "4px",
                              padding: "16px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                textTransform: "uppercase",
                                color: "#5b6670",
                                fontSize: "12px",
                              }}
                            >
                              HOURS THIS YEAR
                            </span>
                            <span
                              style={{
                                fontWeight: 600,
                                color: "#ffb800",
                                fontSize: "24px",
                              }}
                            >
                              {dashboardStats.hoursThisYear}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* USER'S AGENDA Section */}
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="d-flex justify-content-between align-items-center mb-4"
                        style={{
                          borderBottom: "1px solid #e8ebed",
                          paddingBottom: "16px",
                        }}
                      >
                        <h5
                          className="mb-0"
                          style={{
                            fontWeight: 700,
                            textTransform: "uppercase",
                            color: "#1b2850",
                            fontSize: "16px",
                          }}
                        >
                          {user?.name?.toUpperCase() || "USER"}&apos;S AGENDA
                        </h5>
                        <div className="d-flex gap-3">
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              // TODO: Navigate to calendar view
                            }}
                            style={{
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: "#5b6670",
                              textDecoration: "none",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            VIEW CALENDAR
                            <ArrowForward fontSize="small" />
                          </a>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              // TODO: Navigate to all tasks
                            }}
                            style={{
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: "#5b6670",
                              textDecoration: "none",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            ALL TASKS
                            <ArrowForward fontSize="small" />
                          </a>
                        </div>
                      </div>

                      <div>
                        <h6
                          className="mb-3"
                          style={{
                            fontWeight: 700,
                            textTransform: "uppercase",
                            color: "#1b2850",
                            fontSize: "14px",
                          }}
                        >
                          OVERDUE
                        </h6>

                        {agendaItems.length > 0 ? (
                          <div>
                            {agendaItems.map((item, index) => (
                              <div
                                key={index}
                                className="d-flex align-items-start mb-3"
                                style={{
                                  paddingBottom: "16px",
                                  borderBottom:
                                    index < agendaItems.length - 1
                                      ? "1px solid #e8ebed"
                                      : "none",
                                }}
                              >
                                <Assignment
                                  style={{
                                    color: "#5b6670",
                                    marginRight: "12px",
                                    marginTop: "4px",
                                  }}
                                  fontSize="small"
                                />
                                <div className="flex-grow-1">
                                  <div
                                    style={{
                                      fontWeight: 700,
                                      color: "#ff0000",
                                      fontSize: "14px",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    {item.title}
                                  </div>
                                  <div
                                    style={{
                                      color: "#9595b5",
                                      fontSize: "12px",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    {item.timeframe}
                                  </div>
                                  {item.description && (
                                    <div
                                      style={{
                                        color: "#9595b5",
                                        fontSize: "12px",
                                        marginBottom: "4px",
                                      }}
                                    >
                                      {item.description}
                                    </div>
                                  )}
                                  {item.reference && (
                                    <div
                                      style={{
                                        color: "#9595b5",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Re:{" "}
                                      {item.reference
                                        .split(" / ")
                                        .map((ref, refIndex) => (
                                          <span key={refIndex}>
                                            <a
                                              href="#"
                                              style={{
                                                color: "#9595b5",
                                                textDecoration: "underline",
                                              }}
                                            >
                                              {ref}
                                            </a>
                                            {refIndex <
                                              item.reference.split(" / ")
                                                .length -
                                                1 && " / "}
                                          </span>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div
                            style={{
                              color: "#9595b5",
                              fontSize: "14px",
                              fontStyle: "italic",
                            }}
                          >
                            No overdue items
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Contacts Tab */}
            <TabPanel value={tabValue} index={2}>
              <EnhancedContactsList
                module={all_routes.headers?.[1]?.module}
                columns={contactsColumns}
                customFilters={contactsFilters}
                service={getContactsByUserId}
                options={{
                  customButtons: {
                    add: false,
                    edit: false,
                    delete: false,
                  },
                  tableSetting: {
                    srNo: true,
                    selectRow: false,
                  },
                }}
              />
            </TabPanel>

            {/* Matters Tab */}
            <TabPanel value={tabValue} index={3}>
              <EnhancedMattersList
                module={all_routes.headers?.[2]?.module}
                columns={mattersColumns}
                customFilters={mattersFilters}
                service={getMattersByUserId}
                options={{
                  customButtons: {
                    add: false,
                    edit: false,
                    delete: false,
                  },
                  tableSetting: {
                    srNo: true,
                    selectRow: false,
                  },
                }}
              />
            </TabPanel>

            {/* Time Entries Tab */}
            <TabPanel value={tabValue} index={4}>
              <EnhancedTimeEntriesList
                module={all_routes.headers?.[3]?.module}
                columns={timeEntriesColumns}
                customFilters={timeEntriesFilters}
                service={getTimeEntriesByUserId}
                options={{
                  customButtons: {
                    add: false,
                    edit: false,
                    delete: false,
                  },
                  tableSetting: {
                    srNo: true,
                    selectRow: false,
                  },
                }}
              />
            </TabPanel>
          </div>
        </div>
      </ListPageLayout>
    </>
  );
};

export default UserDetails;
