import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
} from "react-feather";
import { useSelector } from "react-redux";

import PageLayout from "@/feature-module/components/list-page-layout";
import { all_routes } from "@/Router/all_routes";

/**
 * Subscription Settings component.
 * Displays current membership status, expiration date, and membership type.
 * @component
 */
const SubscriptionSettings = () => {
  const navigate = useNavigate();
  const firmInfo = useSelector((state) => state.auth.user?.firmId);

  // Mock data - Replace with actual API call
  const [subscriptionData] = useState({
    membershipType: "Free Membership", // "free" or "premium"
    status: "active", // "active", "expired", "expiring_soon"
    expiredDate: firmInfo.trialEndDate,
    startDate: firmInfo.trialStartDate,
  });

  // Calculate days until expiration
  const getDaysUntilExpiration = (expiredDate) => {
    const today = new Date();
    const expiry = new Date(expiredDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiration = getDaysUntilExpiration(
    subscriptionData.expiredDate
  );
  const isExpired = daysUntilExpiration < 0;
  const isExpiringSoon = daysUntilExpiration >= 0 && daysUntilExpiration <= 30;

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status badge class and icon
  const getStatusBadge = () => {
    if (isExpired) {
      return {
        className: "badge bg-danger",
        icon: <XCircle size={16} className="me-1" />,
        text: "Expired",
      };
    }
    if (isExpiringSoon) {
      return {
        className: "badge bg-warning",
        icon: <AlertCircle size={16} className="me-1" />,
        text: "Expiring Soon",
      };
    }
    return {
      className: "badge bg-success",
      icon: <CheckCircle size={16} className="me-1" />,
      text: "Active",
    };
  };

  const statusBadge = getStatusBadge();

  return (
    <>
      <PageLayout
        breadcrumbs={[
          {
            label: "Settings",
            redirect: all_routes.settings[2].path,
          },
          {
            label: "Subscriptions",
            redirect: "#",
          },
        ]}
        isFormLayout={true}
        isSettingsLayout={true}
        title={"Subscriptions"}
        subtitle="Manage your subscriptions"
        actions={{
          onPrevious: {
            text: "Back to Home",
            onClick: () => navigate(all_routes.base_path),
          },
        }}
      >
        <div className="row">
          {/* Membership Status Card */}
          <div className="col-12 col-lg-8 col-xl-6 mb-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Current Membership</h5>
                <span className={statusBadge.className}>
                  {statusBadge.icon}
                  {statusBadge.text}
                </span>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div
                    className={`membership-icon d-flex align-items-center justify-content-center me-3 ${
                      subscriptionData.membershipType === "premium"
                        ? "text-warning"
                        : "text-secondary"
                    }`}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "12px",
                      backgroundColor:
                        subscriptionData.membershipType === "premium"
                          ? "rgba(255, 193, 7, 0.1)"
                          : "rgba(108, 117, 125, 0.1)",
                    }}
                  >
                    <Award
                      size={32}
                      fill={
                        subscriptionData.membershipType === "premium"
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h4 className="mb-1">
                      {subscriptionData.membershipType === "premium"
                        ? "Premium Membership"
                        : "Free Membership"}
                    </h4>
                    <p className="text-muted mb-0">
                      {subscriptionData.membershipType === "premium"
                        ? "Full access to all features"
                        : "Limited access to basic features"}
                    </p>
                  </div>
                </div>

                <div className="border-top pt-3">
                  <div className="row">
                    <div className="col-12 col-sm-6 mb-3 mb-sm-0">
                      <div className="d-flex align-items-center">
                        <Calendar size={18} className="me-2 text-primary" />
                        <div>
                          <p className="text-muted mb-0 small">Start Date</p>
                          <p className="mb-0 fw-semibold">
                            {formatDate(firmInfo.trialStartDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="d-flex align-items-center">
                        <Calendar
                          size={18}
                          className={`me-2 ${
                            isExpired
                              ? "text-danger"
                              : isExpiringSoon
                              ? "text-warning"
                              : "text-success"
                          }`}
                        />
                        <div>
                          <p className="text-muted mb-0 small">
                            Expiration Date
                          </p>
                          <p
                            className={`mb-0 fw-semibold ${
                              isExpired
                                ? "text-danger"
                                : isExpiringSoon
                                ? "text-warning"
                                : "text-success"
                            }`}
                          >
                            {formatDate(firmInfo.trialEndDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isExpiringSoon && !isExpired && (
                  <div className="alert alert-warning mt-3 mb-0" role="alert">
                    <AlertCircle size={18} className="me-2" />
                    Your membership will expire in{" "}
                    <strong>{daysUntilExpiration} days</strong>. Please renew to
                    continue enjoying premium features.
                  </div>
                )}

                {isExpired && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    <XCircle size={18} className="me-2" />
                    Your membership has expired. Please renew to restore access
                    to premium features.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Membership Features Card */}
          <div className="col-12 col-lg-4 col-xl-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Membership Benefits</h5>
              </div>
              <div className="card-body">
                {subscriptionData.membershipType === "premium" ? (
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2 d-flex align-items-center">
                      <CheckCircle size={18} className="me-2 text-success" />
                      <span>Unlimited projects and clients</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <CheckCircle size={18} className="me-2 text-success" />
                      <span>Advanced reporting and analytics</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <CheckCircle size={18} className="me-2 text-success" />
                      <span>Priority customer support</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <CheckCircle size={18} className="me-2 text-success" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="mb-0 d-flex align-items-center">
                      <CheckCircle size={18} className="me-2 text-success" />
                      <span>API access</span>
                    </li>
                  </ul>
                ) : (
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2 d-flex align-items-center">
                      <XCircle size={18} className="me-2 text-muted" />
                      <span className="text-muted">Limited to 5 projects</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <XCircle size={18} className="me-2 text-muted" />
                      <span className="text-muted">Basic reporting only</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <XCircle size={18} className="me-2 text-muted" />
                      <span className="text-muted">Standard support</span>
                    </li>
                    <li className="mb-0">
                      <button
                        className="btn btn-primary btn-sm w-100 mt-2"
                        onClick={() => {
                          // Navigate to upgrade page or open upgrade modal
                          console.log("Upgrade to premium");
                        }}
                      >
                        Upgrade to Premium
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Subscription Actions</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-3 mb-3 mb-md-0">
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => {
                        // Handle renew subscription
                        console.log("Renew subscription");
                      }}
                    >
                      Renew Subscription
                    </button>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3 mb-3 mb-md-0">
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        // Handle view billing history
                        console.log("View billing history");
                      }}
                    >
                      Billing History
                    </button>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3 mb-3 mb-md-0">
                    <button
                      className="btn btn-outline-info w-100"
                      onClick={() => {
                        // Handle change plan
                        console.log("Change plan");
                      }}
                    >
                      Change Plan
                    </button>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={() => {
                        // Handle cancel subscription
                        console.log("Cancel subscription");
                      }}
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default SubscriptionSettings;
