/**
 * Reusable DatePicker component for React Hook Form.
 * @module feature-module/components/form-elements/datepicker
 *
 * Features:
 * - Integrated with React Hook Form
 * - Built on react-datepicker for enhanced UX
 * - Automatic error handling and display
 * - Accessible date inputs with ARIA attributes
 * - Responsive design
 * - Customizable date formats
 * - Min/Max date support
 *
 * @component
 */

import React from "react";
import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * DatePicker component props.
 * @typedef {Object} DatePickerProps
 * @property {string} name - Field name for React Hook Form registration
 * @property {string} label - Label text for the date picker
 * @property {string} [placeholder="Select date"] - Placeholder text
 * @property {boolean} [required=false] - Whether the field is required
 * @property {string} [className] - Additional CSS classes
 * @property {Object} [registerOptions] - Additional options for react-hook-form register
 * @property {string} [id] - DatePicker ID (defaults to name if not provided)
 * @property {string} [ariaLabel] - Custom aria-label (defaults to label if not provided)
 * @property {boolean} [showError=true] - Whether to display error messages
 * @property {boolean} [disabled=false] - Whether the date picker is disabled
 * @property {Date} [minDate] - Minimum selectable date
 * @property {Date} [maxDate] - Maximum selectable date
 * @property {string} [dateFormat="dd/MM/yyyy"] - Date format string
 * @property {boolean} [showYearDropdown=false] - Show year dropdown
 * @property {boolean} [showMonthDropdown=false] - Show month dropdown
 * @property {Object} [datePickerProps] - Additional props to pass to react-datepicker
 */

/**
 * Reusable DatePicker component integrated with React Hook Form.
 *
 * @param {DatePickerProps} props - Component props
 * @returns {JSX.Element} DatePicker component with label and error handling
 *
 * @example
 * // Basic usage
 * <DatePicker
 *   name="formationDate"
 *   label="Formation Date"
 * />
 *
 * @example
 * // With min/max dates and custom format
 * <DatePicker
 *   name="birthDate"
 *   label="Birth Date"
 *   minDate={new Date("1900-01-01")}
 *   maxDate={new Date()}
 *   dateFormat="MM/dd/yyyy"
 *   showYearDropdown
 *   showMonthDropdown
 * />
 */
// eslint-disable-next-line react/prop-types -- Using JSDoc for type documentation
const FormDatePicker = ({
  name,
  label,
  placeholder = "Select date",
  required = false,
  className = "",
  registerOptions = {},
  id,
  ariaLabel,
  showError = true,
  disabled = false,
  minDate,
  maxDate,
  dateFormat = "dd/MM/yyyy",
  showYearDropdown = false,
  showMonthDropdown = false,
  datePickerProps = {},
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const datePickerId = id || name;
  const error = errors[name];
  const hasError = !!error;
  const errorMessage = error?.message;
  const datePickerAriaLabel = ariaLabel || label;

  return (
    <div className={`mb-3 ${className}`}>
      <label htmlFor={datePickerId} className="form-label">
        {label}
        {required && (
          <span className="text-danger ms-1" aria-label="required">
            *
          </span>
        )}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label} is required.` : false,
          ...registerOptions,
        }}
        render={({ field }) => (
          <DatePicker
            id={datePickerId}
            selected={field.value ? new Date(field.value) : null}
            onChange={(date) => {
              field.onChange(date);
            }}
            onBlur={field.onBlur}
            placeholderText={placeholder}
            dateFormat={dateFormat}
            minDate={minDate}
            maxDate={maxDate}
            showYearDropdown={showYearDropdown}
            showMonthDropdown={showMonthDropdown}
            disabled={disabled}
            className={`form-control ${hasError ? "is-invalid" : ""}`}
            aria-label={datePickerAriaLabel}
            aria-required={required}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${datePickerId}-error`
                : undefined
            }
            wrapperClassName="w-100"
            {...datePickerProps}
          />
        )}
      />
      {showError && hasError && (
        <p
          id={`${datePickerId}-error`}
          className="text-danger mt-1 mb-0 small"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

FormDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  registerOptions: PropTypes.object,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  showError: PropTypes.bool,
  disabled: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  dateFormat: PropTypes.string,
  showYearDropdown: PropTypes.bool,
  showMonthDropdown: PropTypes.bool,
  datePickerProps: PropTypes.object,
};

FormDatePicker.defaultProps = {
  placeholder: "Select date",
  required: false,
  className: "",
  registerOptions: {},
  id: undefined,
  ariaLabel: undefined,
  showError: true,
  disabled: false,
  minDate: undefined,
  maxDate: undefined,
  dateFormat: "dd/MM/yyyy",
  showYearDropdown: false,
  showMonthDropdown: false,
  datePickerProps: {},
};

export default FormDatePicker;

