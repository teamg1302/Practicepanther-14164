import React from "react";
import PropTypes from "prop-types";
import ImageWithBasePath from "@/core/img/imagewithbasebath";

/**
 * BasicDetails - A reusable component for displaying label-value pairs with different types
 * @param {Array} details - Array of detail objects with label, value, and type
 * @param {string} layout - Layout style: 'vertical' (default) or 'horizontal'
 * @param {string} labelClass - Custom CSS class for labels
 * @param {string} valueClass - Custom CSS class for values
 */
const BasicDetails = ({
  details = [],
  layout = "horizontal",
  labelClass = "",
  valueClass = "",
}) => {
  /**
   * Render value based on type
   */
  const renderValue = (item) => {
    const {
      type = "text",
      value,
      badgeVariant,
      badgeClass,
      imageAlt,
      customComponent,
    } = item;

    switch (type) {
      case "image": {
        // Check if it's an external URL (starts with http:// or https://)
        const isExternalUrl =
          typeof value === "string" &&
          (value.startsWith("http://") || value.startsWith("https://"));

        const imageStyle = {
          maxWidth: "150px",
          maxHeight: "150px",
          width: "auto",
          height: "auto",
          objectFit: "contain",
          borderRadius: "4px",
        };

        if (isExternalUrl) {
          // Use regular img tag for external URLs
          return (
            <img
              src={value}
              alt={imageAlt || item.label || "Image"}
              className={valueClass}
              style={imageStyle}
            />
          );
        }
        // Use ImageWithBasePath for local assets
        return (
          <ImageWithBasePath
            src={value}
            alt={imageAlt || item.label || "Image"}
            className={valueClass}
            style={imageStyle}
          />
        );
      }

      case "badge": {
        const badgeClasses =
          badgeClass || `badge badge-${badgeVariant || "primary"}`;
        return (
          <span className={badgeClasses} style={{ display: "inline-block" }}>
            {value}
          </span>
        );
      }

      case "tags": {
        // Tags renderer - expects array of objects with { _id, name, color }
        if (!value || !Array.isArray(value) || value.length === 0) {
          return <span className="text-muted">No tags</span>;
        }
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {value.map((tag) => {
              if (!tag || typeof tag !== "object") return null;
              const tagName = tag.name || tag.label || String(tag);
              const tagColor = tag.color || "#6c757d";
              return (
                <span
                  key={tag._id || tag.id || tagName}
                  className="badge badge-sm"
                  style={{
                    backgroundColor: tagColor,
                    color: "#ffffff",
                  }}
                >
                  {tagName}
                </span>
              );
            })}
          </div>
        );
      }

      case "custom": {
        // If customComponent is a function, call it; otherwise render it directly
        if (typeof customComponent === "function") {
          return customComponent(item);
        }
        return customComponent || value || null;
      }

      case "text":
      default:
        return <span className={valueClass}>{value}</span>;
    }
  };

  if (!details || details.length === 0) {
    return <div className="text-muted">No details available</div>;
  }

  const containerClass = layout === "horizontal" ? "row" : "";
  const itemClass = layout === "horizontal" ? "col-md-6 mb-3" : "mb-3";

  return (
    <div className={containerClass}>
      {details.map((item, index) => {
        const { label, type, className = "" } = item;

        // Skip items without label or value (unless it's custom type)
        if (!label && type !== "custom") {
          return null;
        }

        return (
          <div key={index} className={`${itemClass} ${className}`}>
            {layout === "vertical" ? (
              <div>
                {label && (
                  <div
                    className={`font-weight-semibold mb-1 text-muted ${labelClass}`}
                    style={{ fontSize: "0.875rem" }}
                  >
                    {label}
                  </div>
                )}
                <div className="d-flex align-items-center">
                  {renderValue(item)}
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column flex-md-row align-items-start">
                {label && (
                  <div
                    className={`font-weight-semibold text-muted mb-2 mb-md-0 ${labelClass}`}
                    style={{
                      fontSize: "0.875rem",
                      wordBreak: "break-word",
                      flexShrink: 0,
                    }}
                  >
                    <span className="d-md-none">{label}:</span>
                    <span
                      className="d-none d-md-inline-block"
                      style={{
                        minWidth: "180px",
                        maxWidth: "180px",
                        paddingRight: "16px",
                      }}
                    >
                      {label}:
                    </span>
                  </div>
                )}
                <div className="d-flex align-items-center flex-grow-1 w-100 w-md-auto">
                  {renderValue(item)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

BasicDetails.propTypes = {
  details: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node,
      ]),
      type: PropTypes.oneOf(["text", "image", "badge", "tags", "custom"]),
      badgeVariant: PropTypes.string, // For badge type: primary, success, danger, warning, info, etc.
      badgeClass: PropTypes.string, // Custom badge class
      imageAlt: PropTypes.string, // Alt text for image type
      customComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]), // For custom type
      className: PropTypes.string, // Additional class for the detail item
    })
  ).isRequired,
  layout: PropTypes.oneOf(["vertical", "horizontal"]),
  labelClass: PropTypes.string,
  valueClass: PropTypes.string,
};

export default BasicDetails;
