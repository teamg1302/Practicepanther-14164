/**
 * Reusable Input component for React Hook Form.
 * @module feature-module/components/form-elements/input
 *
 * Features:
 * - Integrated with React Hook Form
 * - Automatic error handling and display
 * - Accessible form inputs with ARIA attributes
 * - Responsive design
 * - Support for all HTML input types
 * - Customizable styling
 *
 * @component
 */

import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

/**
 * Input component props.
 * @typedef {Object} InputProps
 * @property {string} name - Field name for React Hook Form registration
 * @property {string} label - Label text for the input
 * @property {string} [type="text"] - HTML input type (text, email, number, etc.)
 * @property {string} [placeholder] - Placeholder text
 * @property {boolean} [required=false] - Whether the field is required
 * @property {string} [className] - Additional CSS classes
 * @property {Object} [registerOptions] - Additional options for react-hook-form register
 * @property {string} [id] - Input ID (defaults to name if not provided)
 * @property {string} [ariaLabel] - Custom aria-label (defaults to label if not provided)
 * @property {boolean} [showError=true] - Whether to display error messages
 * @property {string} [helpText] - Optional help text to display below the input
 * @property {Object} [inputProps] - Additional props to pass to the input element
 */

/**
 * Reusable Input component integrated with React Hook Form.
 *
 * @param {InputProps} props - Component props
 * @returns {JSX.Element} Input component with label and error handling
 *
 * @example
 * // Basic usage
 * <Input
 *   name="firstName"
 *   label="First Name"
 *   type="text"
 *   required
 * />
 *
 * @example
 * // With custom validation
 * <Input
 *   name="email"
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 *   registerOptions={{
 *     pattern: {
 *       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
 *       message: "Invalid email address"
 *     }
 *   }}
 * />
 *
 * @example
 * // With help text
 * <Input
 *   name="mobile"
 *   label="Mobile Number"
 *   type="tel"
 *   helpText="You can get SMS reminders for tasks or events (US & Canada Only)."
 * />
 */
// eslint-disable-next-line react/prop-types -- Using JSDoc for type documentation
const Input = ({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  className = "",
  registerOptions = {},
  id,
  ariaLabel,
  showError = true,
  helpText,
  inputProps = {},
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Helper function to get nested errors for array fields
  const getNestedError = (errorsObj, fieldName) => {
    if (!errorsObj || !fieldName) return undefined;

    // If field name contains dots, navigate through nested structure
    if (fieldName.includes(".")) {
      const parts = fieldName.split(".");
      let current = errorsObj;

      for (const part of parts) {
        // Handle array indices (numeric strings)
        const index = parseInt(part, 10);
        if (!isNaN(index) && Array.isArray(current)) {
          current = current[index];
        } else if (current && typeof current === "object") {
          current = current[part];
        } else {
          return undefined;
        }

        if (current === undefined || current === null) {
          return undefined;
        }
      }

      return current;
    }

    // Simple field name, direct access
    return errorsObj[fieldName];
  };

  const inputId = id || name;
  const error = getNestedError(errors, name);
  const hasError = !!error;
  const errorMessage = error?.message;
  const inputAriaLabel = ariaLabel || label;

  // Extract className and style from inputProps to merge with form-control
  const {
    className: inputPropsClassName,
    style: inputPropsStyle,
    ...restInputProps
  } = inputProps;

  const inputClassName = `form-control ${hasError ? "is-invalid" : ""} ${
    inputPropsClassName || ""
  }`.trim();

  // Remove background image for password fields when there's an error
  const inputStyle =
    hasError && type === "password"
      ? { ...inputPropsStyle, backgroundImage: "none" }
      : inputPropsStyle || {};

  return (
    <div className={`mb-3 ${className}`}>
      <label htmlFor={inputId} className="form-label">
        {label}
        {required && (
          <span className="text-danger ms-1" aria-label="required">
            *
          </span>
        )}
      </label>
      <div className="pass-group" style={{ position: "relative" }}>
        <input
          id={inputId}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          className={inputClassName}
          style={inputStyle}
          placeholder={placeholder}
          aria-label={inputAriaLabel}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : helpText
              ? `${inputId}-help`
              : undefined
          }
          {...register(name, {
            required: required ? `${label} is required.` : false,
            ...registerOptions,
          })}
          {...restInputProps}
        />
        {type === "password" && (
          <span
            className={`fas toggle-password ${
              showPassword ? "fa-eye" : "fa-eye-slash"
            }`}
            onClick={() => setShowPassword(!showPassword)}
          ></span>
        )}
      </div>

      {showError && hasError && (
        <p
          id={`${inputId}-error`}
          className="text-danger mt-1 mb-0 small"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
      {helpText && (
        <span className="text-muted small" id={`${inputId}-help`}>
          {helpText}
        </span>
      )}
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  registerOptions: PropTypes.object,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  showError: PropTypes.bool,
  helpText: PropTypes.string,
  inputProps: PropTypes.object,
};

export default Input;
