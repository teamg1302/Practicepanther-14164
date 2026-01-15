import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getContactById,
  getActivitiesLogByContactId,
} from "@/core/services/contactsService";
import { EntityDetailsTab } from "@/feature-module/components/tabs";
import BasicDetails from "@/feature-module/components/basic-details";
import ContactMatters from "./Matters";
import { setPageLoader } from "@/core/redux/action";
import PageLayout from "@/feature-module/components/list-page-layout";
import { all_routes } from "@/Router/all_routes";

const ContactDetails = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const { contactId } = useParams();
  const [contactDetails, setContactDetails] = useState([]);
  const [activitiesLog, setActivitiesLog] = useState([]);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        dispatch(setPageLoader(true));
        const response = await getContactById(contactId);
        setContactDetails(response);
        dispatch(setPageLoader(false));
      } catch (error) {
        console.error("Error fetching contact details:", error);
        dispatch(setPageLoader(false));
      }
    };
    const fetchActivitiesLog = async () => {
      try {
        const response = await getActivitiesLogByContactId({ contactId });
        setActivitiesLog(response.list);
      } catch (error) {
        console.error("Error fetching activities log:", error);
      }
    };
    if (contactId) {
      fetchContactDetails();
      fetchActivitiesLog();
    }
  }, [contactId, dispatch]);

  // Transform contact details to BasicDetails format
  const transformContactDetails = (contact) => {
    if (!contact) return [];

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const details = [];

    // Basic Information
    if (contact.image) {
      details.push({
        label: "Profile Photo",
        value: contact.image,
        type: "image",
      });
    }

    if (contact.name) {
      details.push({
        label: "Name",
        value: contact.name,
        type: "text",
      });
    }

    if (contact.registrationNumber) {
      details.push({
        label: "Registration Number",
        value: contact.registrationNumber,
        type: "text",
      });
    }

    if (contact.preferredContactMethod) {
      details.push({
        label: "Preferred Contact Method",
        value: contact.preferredContactMethod,
        type: "text",
      });
    }

    // Status with badge
    if (contact.status) {
      const statusValue =
        contact.status.charAt(0).toUpperCase() + contact.status.slice(1);
      details.push({
        label: "Status",
        value: statusValue,
        type: "badge",
        badgeVariant: contact.status === "active" ? "success" : "secondary",
      });
    }

    // Address Information
    if (contact.fullAddress) {
      details.push({
        label: "Full Address",
        value: contact.fullAddress,
        type: "text",
      });
    }

    if (contact.stateId?.name) {
      details.push({
        label: "State",
        value: `${contact.stateId.name} (${contact.stateId.code || ""})`,
        type: "text",
      });
    }

    if (contact.countryId?.name) {
      details.push({
        label: "Country",
        value: `${contact.countryId.name} (${contact.countryId.code || ""})`,
        type: "text",
      });
    }

    // Assigned To
    if (contact.assignedTo?.name) {
      details.push({
        label: "Assigned To",
        value: contact.assignedTo.name,
        type: "text",
      });
    }

    if (contact.assignedTo?.email) {
      details.push({
        label: "Assigned To Email",
        value: contact.assignedTo.email,
        type: "text",
      });
    }

    // Firm Information
    if (contact.firmId?.name) {
      details.push({
        label: "Firm",
        value: contact.firmId.name,
        type: "text",
      });
    }

    // Created By
    if (contact.createdBy?.name) {
      details.push({
        label: "Created By",
        value: contact.createdBy.name,
        type: "text",
      });
    }

    if (contact.createdBy?.email) {
      details.push({
        label: "Created By Email",
        value: contact.createdBy.email,
        type: "text",
      });
    }

    // Updated By
    if (contact.updatedBy?.name) {
      details.push({
        label: "Updated By",
        value: contact.updatedBy.name,
        type: "text",
      });
    }

    if (contact.updatedBy?.email) {
      details.push({
        label: "Updated By Email",
        value: contact.updatedBy.email,
        type: "text",
      });
    }

    // Boolean Status
    details.push({
      label: "Is Active",
      value: contact.isActive ? "Yes" : "No",
      type: "badge",
      badgeVariant: contact.isActive ? "success" : "danger",
    });

    details.push({
      label: "Is Deleted",
      value: contact.isDeleted ? "Yes" : "No",
      type: "badge",
      badgeVariant: contact.isDeleted ? "danger" : "success",
    });

    // Dates
    if (contact.createdAt) {
      details.push({
        label: "Created At",
        value: formatDate(contact.createdAt),
        type: "text",
      });
    }

    if (contact.updatedAt) {
      details.push({
        label: "Updated At",
        value: formatDate(contact.updatedAt),
        type: "text",
      });
    }

    // Tags
    if (contact.tags && contact.tags.length > 0) {
      details.push({
        label: "Tags",
        value: contact.tags.join(", "),
        type: "text",
      });
    } else {
      details.push({
        label: "Tags",
        value: "No tags",
        type: "text",
      });
    }

    // Additional Invoice Recipients
    if (
      contact.additionalInvoiceRecipients &&
      contact.additionalInvoiceRecipients.length > 0
    ) {
      details.push({
        label: "Additional Invoice Recipients",
        value: contact.additionalInvoiceRecipients
          .map((recipient) => recipient.email || recipient.name || "N/A")
          .join(", "),
        type: "text",
      });
    }

    return details;
  };

  // Analytics data for contact details
  const analytics = [
    {
      icon: "assets/img/icons/dash1.svg",
      value: 307144,
      label: "Trust",
      prefix: "$",
      duration: 3,
    },
    {
      icon: "assets/img/icons/dash2.svg",
      value: 4385,
      label: "Paid",
      prefix: "$",
      duration: 3,
      widgetClass: "dash1",
    },
    {
      icon: "assets/img/icons/dash3.svg",
      value: 385656.5,
      label: "Due",
      prefix: "$",
      duration: 3,
      decimals: 1,
      widgetClass: "dash2",
    },
    {
      icon: "assets/img/icons/dash4.svg",
      value: 40000,
      label: "Billable",
      prefix: "$",
      duration: 3,
      widgetClass: "dash3",
    },
  ];

  // Tabs data
  const tabs = [
    {
      id: "main-profile",
      label: "Basic Information",
      icon: "feather-users me-1 align-middle d-inline-block",
      content: (
        <div>
          <BasicDetails details={transformContactDetails(contactDetails)} />
        </div>
      ),
    },
    {
      id: "contact-matters",
      label: "Cases",
      icon: "feather-briefcase me-1 align-middle d-inline-block",
      content: <ContactMatters contactId={contactId} />,
    },
    {
      id: "contact-activities",
      label: "Activities",
      icon: "feather-activity me-1 align-middle d-inline-block",
      content: (
        <div className="activities-container">
          {(() => {
            // Helper function to get icon and color based on action type
            const getActivityConfig = (action) => {
              const configs = {
                CREATE: { icon: "feather-user-plus", color: "success" },
                UPDATE: { icon: "feather-edit", color: "info" },
                DELETE: { icon: "feather-trash-2", color: "danger" },
                ASSIGN: { icon: "feather-user-check", color: "primary" },
                default: { icon: "feather-activity", color: "secondary" },
              };
              return configs[action] || configs.default;
            };

            // Format date helper
            const formatDate = (dateString) => {
              if (!dateString) return "N/A";
              const date = new Date(dateString);
              return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            };

            if (activitiesLog.length === 0) {
              return (
                <div className="text-center text-muted py-5">
                  <i
                    className="feather-activity mb-2"
                    style={{ fontSize: "48px", opacity: 0.3 }}
                  />
                  <p>No activities found</p>
                </div>
              );
            }

            return activitiesLog.map((activity, index, array) => {
              const config = getActivityConfig(activity.action);
              const userName = activity.userId?.name || "System";
              const userEmail = activity.userId?.email || "";
              const description =
                activity.description ||
                activity.changes?.summary ||
                "Activity performed";
              const activityDate = formatDate(activity.createdAt);

              return (
                <div
                  key={activity._id || activity.id || index}
                  className="activity-item d-flex mb-4 position-relative"
                >
                  <div
                    className="activity-icon-wrapper me-3 position-relative"
                    style={{ flexShrink: 0 }}
                  >
                    <div
                      className={`activity-icon d-flex align-items-center justify-content-center bg-${config.color} text-white`}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      <i className={`${config.icon} feather-16`} />
                    </div>
                    {index < array.length - 1 && (
                      <div
                        className="activity-line position-absolute"
                        style={{
                          left: "19px",
                          top: "40px",
                          width: "2px",
                          height: "calc(100% + 1rem)",
                          backgroundColor: "#e0e0e0",
                          zIndex: 1,
                        }}
                      />
                    )}
                  </div>
                  <div className="activity-content flex-grow-1">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-1">
                      <h6 className="mb-1 mb-md-0 font-weight-semibold">
                        {activity.action || "Activity"}
                      </h6>
                      <span
                        className="text-muted ms-md-2"
                        style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                      >
                        {activityDate}
                      </span>
                    </div>
                    <p
                      className="text-muted mb-1"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {description}
                    </p>
                    <div className="d-flex align-items-center">
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        <i
                          className="feather-user me-1"
                          style={{ fontSize: "12px" }}
                        />
                        {userName}
                        {userEmail && ` (${userEmail})`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Contact Details"
      breadcrumbs={[
        {
          label: "Contacts",
          redirect: route.headers[1].path,
        },
        {
          label: "Contact Details",
          redirect: "#",
        },
      ]}
    >
      <EntityDetailsTab
        pageTitle="Contact Details"
        analytics={analytics}
        tabs={tabs}
      />
    </PageLayout>
  );
};

export default ContactDetails;
