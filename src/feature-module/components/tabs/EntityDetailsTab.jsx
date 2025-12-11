import React, { useState } from "react";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";
import ImageWithBasePath from "@/core/img/imagewithbasebath";
import PropTypes from "prop-types";

/**
 * EntityDetailsTab - A reusable component for displaying entity details with analytics and tabs
 * @param {string} pageTitle - The title to display at the top of the page
 * @param {Array} analytics - Array of analytics objects with icon, value, label, prefix, decimals, and widgetClass
 * @param {Array} tabs - Array of tab objects with id, label, icon, and content
 */
const EntityDetailsTab = ({ pageTitle, analytics = [], tabs = [] }) => {
  const { t } = useTranslation();

  // Ensure tabs is an array - calculate directly since useState needs it
  const tabsArray = Array.isArray(tabs) ? tabs : [];
  const analyticsArray = Array.isArray(analytics) ? analytics : [];

  // Initialize activeTab with the first tab ID
  const [activeTab, setActiveTab] = useState(() => {
    if (tabsArray.length === 0) return null;
    const firstTab = tabsArray[0];
    return firstTab?.id || `tab-0`;
  });

  // Calculate column width based on number of analytics items
  const getAnalyticsColClass = (count) => {
    if (count === 0) return "";
    if (count === 1) return "col-xl-12 col-sm-6 col-12";
    if (count === 2) return "col-xl-6 col-sm-6 col-12";
    if (count === 3) return "col-xl-4 col-sm-6 col-12";
    if (count === 4) return "col-xl-3 col-sm-6 col-12";
    return "col-xl-3 col-sm-6 col-12";
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>{pageTitle || t("pageTitle") || "Entity Details"}</h4>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                {/* Always show card structure, even if empty */}
                {analyticsArray.length > 0 && (
                  <div className="card-header">
                    <div className="card-title">
                      <div className="row">
                        {analyticsArray.map((item, index) => {
                          const colClass = getAnalyticsColClass(
                            analyticsArray.length
                          );
                          const widgetClass = item.widgetClass
                            ? `dash-widget ${item.widgetClass}`
                            : "dash-widget";
                          return (
                            <div key={index} className={`${colClass} d-flex`}>
                              <div className={`${widgetClass} w-100 p-2 mb-0`}>
                                <div className="dash-widgetimg">
                                  <span>
                                    <ImageWithBasePath
                                      src={item.icon}
                                      alt={item.label || "analytics"}
                                    />
                                  </span>
                                </div>
                                <div className="dash-widgetcontent">
                                  <h5>
                                    {item.prefix &&
                                      !item.prefix.includes("$") && (
                                        <span>{item.prefix}</span>
                                      )}
                                    <CountUp
                                      start={0}
                                      end={item.value || 0}
                                      duration={item.duration || 3}
                                      prefix={item.prefix === "$" ? "$" : ""}
                                      decimals={item.decimals || 0}
                                    />
                                  </h5>
                                  <h6>
                                    {item.labelKey
                                      ? t(item.labelKey)
                                      : item.label || ""}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {tabsArray.length > 0 ? (
                  <div className="card-body d-flex align-items-start">
                    <div className="row w-100">
                      <div
                        className="col-md-2"
                        style={{ borderRight: "1px solid #e0e0e0" }}
                      >
                        <div
                          className="nav flex-column nav-pills me-3 tab-style-7"
                          id="v-pills-tab"
                          role="tablist"
                          aria-orientation="vertical"
                        >
                          {tabsArray.map((tab, index) => {
                            const tabId = tab.id || `tab-${index}`;
                            // Show first tab as active if activeTab is null or doesn't match
                            const isActive =
                              activeTab === tabId ||
                              (index === 0 && !activeTab);
                            return (
                              <button
                                key={tabId}
                                className={`nav-link text-start ${
                                  isActive ? "active" : ""
                                }`}
                                id={`${tabId}-tab`}
                                type="button"
                                role="tab"
                                aria-controls={tabId}
                                aria-selected={isActive}
                                onClick={() => setActiveTab(tabId)}
                              >
                                {tab.icon && (
                                  <i
                                    className={`${tab.icon} me-1 align-middle d-inline-block`}
                                  />
                                )}
                                {tab.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="col-md-10">
                        <div className="tab-content" id="v-pills-tabContent">
                          {tabsArray.map((tab, index) => {
                            const tabId = tab.id || `tab-${index}`;
                            // Show first tab if activeTab is null or doesn't match
                            const isActive =
                              activeTab === tabId ||
                              (index === 0 && !activeTab);
                            return (
                              <div
                                key={tabId}
                                className={`tab-pane ${
                                  isActive ? "show active" : ""
                                }`}
                                id={tabId}
                                role="tabpanel"
                                aria-labelledby={`${tabId}-tab`}
                                tabIndex={0}
                                style={{
                                  display: isActive ? "block" : "none",
                                }}
                              >
                                {typeof tab.content === "function"
                                  ? tab.content()
                                  : tab.content}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card-body">
                    <p className="text-muted">No tabs available</p>
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

EntityDetailsTab.propTypes = {
  pageTitle: PropTypes.string,
  analytics: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      label: PropTypes.string,
      labelKey: PropTypes.string, // Translation key
      prefix: PropTypes.string, // e.g., "$"
      decimals: PropTypes.number,
      duration: PropTypes.number,
      widgetClass: PropTypes.string, // e.g., "dash1", "dash2", "dash3"
    })
  ),
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string, // Icon class name
      content: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func, // Function that returns JSX
      ]).isRequired,
    })
  ),
};

export default EntityDetailsTab;
