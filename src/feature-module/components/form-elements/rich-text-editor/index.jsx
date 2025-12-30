/**
 * Reusable Rich Text Editor component for React Hook Form.
 * @module feature-module/components/form-elements/rich-text-editor
 *
 * Features:
 * - Integrated with React Hook Form (Controller)
 * - Automatic error handling and display
 * - Accessible rich text editor with ARIA attributes
 * - Character count display with max length support
 * - Configurable toolbar
 * - Responsive design
 * - Customizable styling
 *
 * @component
 */

import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/**
 * RichTextEditor component props.
 * @typedef {Object} RichTextEditorProps
 * @property {string} name - Field name for React Hook Form
 * @property {string} label - Label text
 * @property {boolean} [required=false] - Whether the field is required
 * @property {string} [className] - Additional wrapper CSS classes
 * @property {string} [id] - Editor ID (defaults to name)
 * @property {string} [ariaLabel] - Custom aria-label
 * @property {boolean} [showError=true] - Whether to display error messages
 * @property {string} [helpText] - Optional help text
 * @property {number} [maxLength] - Maximum character length
 * @property {Object} [editorProps] - Additional props for ReactQuill
 * @property {Object} [modules] - Custom toolbar modules
 */

/**
 * Reusable Rich Text Editor integrated with React Hook Form.
 *
 * @param {RichTextEditorProps} props
 * @returns {JSX.Element}
 */
// eslint-disable-next-line react/prop-types -- Using JSDoc for type documentation
const RichTextEditor = ({
  name,
  label,
  required = false,
  className = "",
  id = undefined,
  ariaLabel = undefined,
  showError = true,
  helpText = undefined,
  maxLength = undefined,
  editorProps = {},
  modules = undefined,
  rows = 5,
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  // Helper to get nested errors (arrays / dot notation)
  const getNestedError = (errorsObj, fieldName) => {
    if (!errorsObj || !fieldName) return undefined;

    if (fieldName.includes(".")) {
      const parts = fieldName.split(".");
      let current = errorsObj;

      for (const part of parts) {
        const index = parseInt(part, 10);
        if (!isNaN(index) && Array.isArray(current)) {
          current = current[index];
        } else if (current && typeof current === "object") {
          current = current[part];
        } else {
          return undefined;
        }
        if (current === undefined || current === null) return undefined;
      }
      return current;
    }

    return errorsObj[fieldName];
  };

  const editorId = id || name;
  const error = getNestedError(errors, name);
  const hasError = !!error;
  const errorMessage = error?.message;
  const editorAriaLabel = ariaLabel || label;
  const quillRef = useRef(null);

  // Character count (strip HTML)
  const rawValue = watch(name) || "";
  const plainText = rawValue.replace(/<[^>]+>/g, "");
  const currentLength = plainText.length;
  const ROW_HEIGHT = 24; // px (textarea equivalent)
  const minHeight = rows * ROW_HEIGHT;

  // Set minHeight on the editor content area and border color on error
  useEffect(() => {
    const setEditorStyles = () => {
      if (quillRef.current) {
        const editorElement = quillRef.current.querySelector(".ql-editor");
        const containerElement =
          quillRef.current.querySelector(".ql-container");
        const toolbarElement = quillRef.current.querySelector(".ql-toolbar");

        if (editorElement) {
          editorElement.style.minHeight = `${minHeight}px`;
        }

        const borderColor = hasError ? "#dc3545" : ""; // Bootstrap danger red

        if (containerElement) {
          containerElement.style.borderColor = borderColor;
        }

        if (toolbarElement) {
          toolbarElement.style.borderColor = borderColor;
        }
      }
    };

    // Try immediately
    setEditorStyles();

    // Also try after a short delay to handle async rendering
    const timer = setTimeout(setEditorStyles, 100);

    return () => clearTimeout(timer);
  }, [minHeight, hasError]);

  const defaultModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className={`input-blocks mb-3 ${className}`}>
      <label htmlFor={editorId} className="form-label">
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
          validate: maxLength
            ? (value) => {
                const text = value?.replace(/<[^>]+>/g, "") || "";
                return (
                  text.length <= maxLength ||
                  `${label} must not exceed ${maxLength} characters.`
                );
              }
            : undefined,
        }}
        render={({ field }) => (
          <div
            className={`rich-text-wrapper ${hasError ? "is-invalid" : ""}`}
            ref={quillRef}
          >
            <ReactQuill
              id={editorId}
              theme="snow"
              value={field.value || ""}
              onChange={field.onChange}
              modules={modules || defaultModules}
              aria-label={editorAriaLabel}
              aria-invalid={hasError}
              {...editorProps}
            />
          </div>
        )}
      />

      {maxLength && (
        <p className="mt-1 mb-0" id={`${editorId}-char-count`}>
          {currentLength} / {maxLength} Characters
          {currentLength >= maxLength && (
            <span className="text-danger ms-1">(Maximum reached)</span>
          )}
        </p>
      )}

      {showError && hasError && (
        <p
          id={`${editorId}-error`}
          className="text-danger mt-1 mb-0 small"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}

      {helpText && !hasError && (
        <span className="text-muted small mt-1" id={`${editorId}-help`}>
          {helpText}
        </span>
      )}
    </div>
  );
};

RichTextEditor.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  showError: PropTypes.bool,
  helpText: PropTypes.string,
  maxLength: PropTypes.number,
  editorProps: PropTypes.object,
  modules: PropTypes.object,
  rows: PropTypes.number,
};

export default RichTextEditor;
