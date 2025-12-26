/**
 * Reusable Textarea component for React Hook Form.
 * @module feature-module/components/form-elements/textarea
 *
 * Features:
 * - Integrated with React Hook Form
 * - Automatic error handling and display
 * - Accessible form textareas with ARIA attributes
 * - Character count display with max length support
 * - Responsive design
 * - Customizable styling
 *
 * @component
 */

import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

/**
 * Textarea component props.
 * @typedef {Object} TextareaProps
 * @property {string} name - Field name for React Hook Form registration
 * @property {string} label - Label text for the textarea
 * @property {string} [placeholder] - Placeholder text
 * @property {boolean} [required=false] - Whether the field is required
 * @property {string} [className] - Additional CSS classes
 * @property {Object} [registerOptions] - Additional options for react-hook-form register
 * @property {string} [id] - Textarea ID (defaults to name if not provided)
 * @property {string} [ariaLabel] - Custom aria-label (defaults to label if not provided)
 * @property {boolean} [showError=true] - Whether to display error messages
 * @property {string} [helpText] - Optional help text to display below the textarea
 * @property {number} [rows=5] - Number of rows for the textarea
 * @property {number} [maxLength] - Maximum character length (displays character count)
 * @property {Object} [textareaProps] - Additional props to pass to the textarea element
 */

/**
 * Reusable Textarea component integrated with React Hook Form.
 *
 * @param {TextareaProps} props - Component props
 * @returns {JSX.Element} Textarea component with label and error handling
 *
 * @example
 * // Basic usage
 * <Textarea
 *   name="description"
 *   label="Description"
 *   rows={5}
 * />
 *
 * @example
 * // With max length and character count
 * <Textarea
 *   name="description"
 *   label="Description"
 *   maxLength={60}
 *   required
 * />
 *
 * @example
 * // With custom validation
 * <Textarea
 *   name="notes"
 *   label="Notes"
 *   placeholder="Enter your notes"
 *   registerOptions={{
 *     minLength: {
 *       value: 10,
 *       message: "Notes must be at least 10 characters"
 *     }
 *   }}
 * />
 *
 * @example
 * // With help text
 * <Textarea
 *   name="description"
 *   label="Description"
 *   helpText="Provide a detailed description of the item."
 * />
 */
// eslint-disable-next-line react/prop-types -- Using JSDoc for type documentation
const Textarea = ({
  name,
  label,
  placeholder,
  required = false,
  className = "",
  registerOptions = {},
  id,
  ariaLabel,
  showError = true,
  helpText,
  rows = 5,
  maxLength,
  textareaProps = {},
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  // Helper function to get nested errors for array fields
  const getNestedError = (errorsObj, fieldName) => {
    if (!errorsObj || !fieldName) return undefined;
    
    // If field name contains dots, navigate through nested structure
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.');
      let current = errorsObj;
      
      for (const part of parts) {
        // Handle array indices (numeric strings)
        const index = parseInt(part, 10);
        if (!isNaN(index) && Array.isArray(current)) {
          current = current[index];
        } else if (current && typeof current === 'object') {
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

  const textareaId = id || name;
  const error = getNestedError(errors, name);
  const hasError = !!error;
  const errorMessage = error?.message;
  const textareaAriaLabel = ariaLabel || label;

  // Watch the value for character count display
  const value = watch(name) || "";
  const currentLength = value.length;

  // Extract className from textareaProps to merge with form-control
  const { className: textareaPropsClassName, ...restTextareaProps } =
    textareaProps;
  const textareaClassName = `form-control h-100 ${
    hasError ? "is-invalid" : ""
  } ${textareaPropsClassName || ""}`.trim();

  return (
    <div
      className={`input-blocks summer-description-box transfer mb-3 ${className}`}
    >
      <label htmlFor={textareaId} className="form-label">
        {label}
        {required && (
          <span className="text-danger ms-1" aria-label="required">
            *
          </span>
        )}
      </label>
      <textarea
        id={textareaId}
        className={textareaClassName}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        aria-label={textareaAriaLabel}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={
          hasError
            ? `${textareaId}-error`
            : helpText
            ? `${textareaId}-help`
            : maxLength
            ? `${textareaId}-char-count`
            : undefined
        }
        {...register(name, {
          required: required ? `${label} is required.` : false,
          maxLength: maxLength
            ? {
                value: maxLength,
                message: `${label} must not exceed ${maxLength} characters.`,
              }
            : undefined,
          ...registerOptions,
        })}
        {...restTextareaProps}
      />
      {maxLength && (
        <p className="mt-1 mb-0" id={`${textareaId}-char-count`}>
          {currentLength} / {maxLength} Characters
          {currentLength >= maxLength && (
            <span className="text-danger ms-1">(Maximum reached)</span>
          )}
        </p>
      )}
      {showError && hasError && (
        <p
          id={`${textareaId}-error`}
          className="text-danger mt-1 mb-0 small"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
      {helpText && !hasError && (
        <span className="text-muted small mt-1" id={`${textareaId}-help`}>
          {helpText}
        </span>
      )}
    </div>
  );
};

Textarea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  registerOptions: PropTypes.object,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  showError: PropTypes.bool,
  helpText: PropTypes.string,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  textareaProps: PropTypes.object,
};

Textarea.defaultProps = {
  placeholder: undefined,
  required: false,
  className: "",
  registerOptions: {},
  id: undefined,
  ariaLabel: undefined,
  showError: true,
  helpText: undefined,
  rows: 5,
  maxLength: undefined,
  textareaProps: {},
};

export default Textarea;
