/**
 * Reusable Select component for React Hook Form using react-select.
 * @module feature-module/components/form-elements/select
 *
 * Features:
 * - Integrated with React Hook Form
 * - Built on react-select for enhanced UX
 * - Searchable dropdown with filtering
 * - Automatic error handling and display
 * - Accessible form selects with ARIA attributes
 * - Responsive design
 * - Support for single and multi-select
 * - Customizable styling
 * - Loading states support
 *
 * @component
 */

import React from "react";
import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ReactSelect from "react-select";

/**
 * Select option type.
 * @typedef {Object} SelectOption
 * @property {string|number} value - Option value
 * @property {string} label - Option display label
 * @property {boolean} [disabled=false] - Whether option is disabled
 */

/**
 * Select component props.
 * @typedef {Object} SelectProps
 * @property {string} name - Field name for React Hook Form registration
 * @property {string} label - Label text for the select
 * @property {Array<SelectOption>} [options] - Array of options in {value, label} format
 * @property {string} [placeholder="Select..."] - Placeholder text
 * @property {boolean} [required=false] - Whether the field is required
 * @property {string} [className] - Additional CSS classes
 * @property {Object} [registerOptions] - Additional options for react-hook-form register
 * @property {string} [id] - Select ID (defaults to name if not provided)
 * @property {string} [ariaLabel] - Custom aria-label (defaults to label if not provided)
 * @property {boolean} [showError=true] - Whether to display error messages
 * @property {boolean} [disabled=false] - Whether the select is disabled
 * @property {boolean} [isMulti=false] - Whether multiple selections are allowed
 * @property {boolean} [isSearchable=true] - Whether the select is searchable
 * @property {boolean} [isClearable=false] - Whether the select can be cleared
 * @property {string} [helpText] - Optional help text to display below the select
 * @property {Object} [selectProps] - Additional props to pass to react-select
 */

/**
 * Reusable Select component integrated with React Hook Form using react-select.
 *
 * @param {SelectProps} props - Component props
 * @returns {JSX.Element} Select component with label and error handling
 *
 * @example
 * // Basic usage with options array
 * <Select
 *   name="timezone"
 *   label="Timezone"
 *   options={[
 *     { value: "UTC", label: "UTC" },
 *     { value: "EST", label: "Eastern Time" },
 *     { value: "PST", label: "Pacific Time" }
 *   ]}
 * />
 *
 * @example
 * // With placeholder and required
 * <Select
 *   name="country"
 *   label="Country"
 *   placeholder="Select a country"
 *   required
 *   options={countries}
 * />
 *
 * @example
 * // Multi-select
 * <Select
 *   name="categories"
 *   label="Categories"
 *   isMulti
 *   options={categories}
 * />
 *
 * @example
 * // With help text
 * <Select
 *   name="timezone"
 *   label="Timezone"
 *   options={timezoneOptions}
 *   helpText="Select your local timezone for accurate scheduling."
 * />
 */
// eslint-disable-next-line react/prop-types -- Using JSDoc for type documentation
const FormSelect = ({
  name,
  label,
  options = [],
  placeholder,
  required = false,
  className = "",
  registerOptions = {},
  id,
  ariaLabel,
  showError = true,
  disabled = false,
  isMulti = false,
  isSearchable = true,
  isClearable = false,
  helpText,
  selectProps = {},
}) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const selectId = id || name;
  const error = errors[name];
  const hasError = !!error;
  const errorMessage = error?.message;
  const selectAriaLabel = ariaLabel || label;
  const defaultPlaceholder =
    placeholder || t("formElements.select.placeholder");

  /**
   * Custom styles for react-select to match Bootstrap form styling.
   *
   * @param {Object} base - Base styles
   * @param {Object} state - Component state
   * @returns {Object} Custom styles
   */
  const customStyles = {
    control: (base, state) => ({
      ...base,

      borderColor: hasError
        ? "#dc3545"
        : state.isFocused
        ? "#86b7fe"
        : "#dee2e6",
      boxShadow: hasError
        ? "0 0 0 0.25rem rgba(220, 53, 69, 0.25)"
        : state.isFocused
        ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
        : "none",
      "&:hover": {
        borderColor: hasError ? "#dc3545" : "#86b7fe",
      },
      minHeight: "38px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6c757d",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className={`mb-3 ${className}`}>
      <label htmlFor={selectId} className="form-label">
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
          <ReactSelect
            {...field}
            id={selectId}
            instanceId={selectId}
            options={options}
            placeholder={defaultPlaceholder}
            isDisabled={disabled}
            isMulti={isMulti}
            isSearchable={isSearchable}
            isClearable={isClearable}
            aria-label={selectAriaLabel}
            aria-required={required}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${selectId}-error`
                : helpText
                ? `${selectId}-help`
                : undefined
            }
            styles={customStyles}
            classNamePrefix="react-select"
            className={hasError ? "is-invalid" : ""}
            onChange={(selected) => {
              if (isMulti) {
                field.onChange(
                  selected ? selected.map((item) => item.value) : []
                );
              } else {
                field.onChange(selected ? selected.value : null);
              }
            }}
            value={
              isMulti
                ? options.filter((option) =>
                    (field.value || []).includes(option.value)
                  )
                : options.find((option) => option.value === field.value) || null
            }
            {...selectProps}
          />
        )}
      />
      {showError && hasError && (
        <p
          id={`${selectId}-error`}
          className="text-danger mt-1 mb-0 small"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
      {helpText && (
        <span className="text-muted small" id={`${selectId}-help`}>
          {helpText}
        </span>
      )}
    </div>
  );
};

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  registerOptions: PropTypes.object,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  showError: PropTypes.bool,
  disabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isClearable: PropTypes.bool,
  helpText: PropTypes.string,
  selectProps: PropTypes.object,
};

FormSelect.defaultProps = {
  options: [],
  placeholder: "Select...",
  required: false,
  className: "",
  registerOptions: {},
  id: undefined,
  ariaLabel: undefined,
  showError: true,
  disabled: false,
  isMulti: false,
  isSearchable: true,
  isClearable: false,
  helpText: undefined,
  selectProps: {},
};

export default FormSelect;
