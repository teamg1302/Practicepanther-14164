/**
 * Reusable Switch/Toggle component for React Hook Form.
 * @module feature-module/components/form-elements/switch
 *
 * Features:
 * - Integrated with React Hook Form
 * - Custom styled toggle switch with Yes/No labels
 * - Accessible with ARIA attributes
 * - Responsive design
 * - Smooth animations
 * - Customizable colors and sizes
 *
 * @component
 */

import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

/**
 * Switch component props.
 * @typedef {Object} SwitchProps
 * @property {string} name - Field name for React Hook Form registration
 * @property {string} label - Label text for the switch
 * @property {boolean} [defaultValue=false] - Default checked state
 * @property {string} [className] - Additional CSS classes
 * @property {Object} [registerOptions] - Additional options for react-hook-form register
 * @property {string} [id] - Switch ID (defaults to name if not provided)
 * @property {string} [ariaLabel] - Custom aria-label (defaults to label if not provided)
 * @property {string} [activeColor="#FF9F43"] - Color when switch is active
 * @property {string} [inactiveColor="#e9ecef"] - Color when switch is inactive
 * @property {string} [activeText="Yes"] - Text displayed when switch is active
 * @property {string} [inactiveText="No"] - Text displayed when switch is inactive
 * @property {number} [width=90] - Width of the switch in pixels
 * @property {number} [height=36] - Height of the switch in pixels
 * @property {boolean} [disabled=false] - Whether the switch is disabled
 */

/**
 * Reusable Switch/Toggle component integrated with React Hook Form.
 *
 * @param {SwitchProps} props - Component props
 * @returns {JSX.Element} Switch component with label
 *
 * @example
 * // Basic usage
 * <Switch
 *   name="roundTimeEntries"
 *   label="Round time entries?"
 * />
 *
 * @example
 * // With custom colors and text
 * <Switch
 *   name="notifications"
 *   label="Enable notifications"
 *   activeColor="#28a745"
 *   inactiveColor="#dc3545"
 *   activeText="On"
 *   inactiveText="Off"
 * />
 */
// eslint-disable-next-line react/prop-types -- Using JSDoc for type documentation
const Switch = ({
  name,
  label,
  defaultValue = false,
  className = "",
  registerOptions = {},
  id,
  ariaLabel,
  activeColor = "#FF9F43",
  inactiveColor = "#e9ecef",
  activeText = "Yes",
  inactiveText = "No",
  width = 90,
  height = 36,
  disabled = false,
}) => {
  const { register, watch, setValue } = useFormContext();
  const inputId = id || name;
  const switchAriaLabel = ariaLabel || label;
  const isChecked = watch(name) ?? defaultValue;

  /**
   * Handles switch toggle.
   *
   * @param {Event} e - Change event
   * @returns {void}
   */
  const handleToggle = (e) => {
    if (!disabled) {
      setValue(name, e.target.checked, { shouldValidate: true });
    }
  };

  return (
    <div className={`mb-3 ${className}`}>
      <label className="form-label">{label}</label>
      <div>
        <label
          htmlFor={inputId}
          style={{
            position: "relative",
            display: "inline-block",
            width: `${width}px`,
            height: `${height}px`,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
          }}
          aria-label={switchAriaLabel}
        >
          <input
            id={inputId}
            type="checkbox"
            {...register(name, {
              value: defaultValue,
              ...registerOptions,
            })}
            checked={isChecked}
            onChange={handleToggle}
            disabled={disabled}
            aria-label={switchAriaLabel}
            aria-checked={isChecked}
            style={{
              opacity: 0,
              width: 0,
              height: 0,
              position: "absolute",
            }}
          />
          <span
            role="switch"
            aria-checked={isChecked}
            aria-label={switchAriaLabel}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isChecked ? activeColor : inactiveColor,
              borderRadius: "6px",
              border: "1px solid #ff9f43",
              transition: "background-color 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: isChecked ? "flex-start" : "flex-end",
              padding: "0",
              fontSize: "14px",
              fontWeight: "500",
              color: isChecked ? "#ffffff" : "#6c757d",
              minWidth: "44px",
              minHeight: "44px",
            }}
          >
            <span
              style={{
                content: '""',
                position: "absolute",
                height: `${height - 2}px`,
                width: `${height}px`,
                left: isChecked ? `calc(100% - ${height}px)` : "0px",
                backgroundColor: "#ffffff",
                borderTopRightRadius: `${isChecked ? "6px" : "0px"}`,
                borderBottomRightRadius: `${isChecked ? "6px" : "0px"}`,
                borderTopLeftRadius: `${isChecked ? "0px" : "6px"}`,
                borderBottomLeftRadius: `${isChecked ? "0px" : "6px"}`,
                transition: "left 0.3s ease",
                zIndex: 1,
              }}
              aria-hidden="true"
            />
            <span
              style={{
                position: "relative",
                zIndex: 2,
                marginLeft: isChecked ? "8px" : "0",
                marginRight: isChecked ? "0" : "8px",
                color: isChecked ? "#FFFFFF" : "#000000",
                userSelect: "none",
              }}
              aria-hidden="true"
            >
              {isChecked ? activeText : inactiveText}
            </span>
          </span>
        </label>
      </div>
    </div>
  );
};

Switch.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool,
  className: PropTypes.string,
  registerOptions: PropTypes.object,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  activeText: PropTypes.string,
  inactiveText: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  disabled: PropTypes.bool,
};

Switch.defaultProps = {
  defaultValue: false,
  className: "",
  registerOptions: {},
  id: undefined,
  ariaLabel: undefined,
  activeColor: "#FF9F43",
  inactiveColor: "#e9ecef",
  activeText: "Yes",
  inactiveText: "No",
  width: 72,
  height: 36,
  disabled: false,
};

export default Switch;
