/**
 * Reusable Select component for React Hook Form using react-select.
 * Supports Add/Create button inside dropdown (non-selectable).
 */

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PlusCircle } from "feather-icons-react/build/IconComponents";
import ReactSelect, { components } from "react-select";

/* -------------------- Custom MenuList -------------------- */
const CustomMenuList = (props) => {
  const { children } = props;
  const { onAddClick, addButtonLabel } = props.selectProps || {};

  return (
    <components.MenuList {...props}>
      {onAddClick && (
        <div className="d-flex align-items-center justify-content-center p-2">
          <Link
            to="#"
            onClick={(e) => {
              e.stopPropagation(); // prevent select behavior
              onAddClick();
            }}
          >
            <PlusCircle size={16} className="me-2" />
            {addButtonLabel || "+ Add New"}
          </Link>
        </div>
      )}
      {children}
    </components.MenuList>
  );
};

/* -------------------- Component -------------------- */
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

  /* ---------- Helpers ---------- */
  const getNestedError = (errorsObj, fieldName) => {
    if (!errorsObj || !fieldName) return undefined;

    if (fieldName.includes(".")) {
      return fieldName.split(".").reduce((acc, key) => acc?.[key], errorsObj);
    }
    return errorsObj[fieldName];
  };

  const selectId = id || name;
  const error = getNestedError(errors, name);
  const hasError = !!error;
  const errorMessage = error?.message;
  const selectAriaLabel = ariaLabel || label;
  const defaultPlaceholder =
    placeholder || t("formElements.select.placeholder");

  /* ---------- Styles ---------- */
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      borderColor: hasError
        ? "#dc3545"
        : state.isFocused
        ? "#86b7fe"
        : "#dee2e6",
      boxShadow: hasError
        ? "0 0 0 0.25rem rgba(220,53,69,.25)"
        : state.isFocused
        ? "0 0 0 0.25rem rgba(13,110,253,.25)"
        : "none",
      "&:hover": {
        borderColor: hasError ? "#dc3545" : "#86b7fe",
      },
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
        {required && <span className="text-danger ms-1">*</span>}
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
            styles={customStyles}
            classNamePrefix="react-select"
            className={hasError ? "is-invalid" : ""}
            components={{ MenuList: CustomMenuList }}
            onChange={(selected) => {
              if (isMulti) {
                field.onChange(selected ? selected.map((i) => i.value) : []);
              } else {
                field.onChange(selected ? selected.value : null);
              }
            }}
            value={
              isMulti
                ? options.filter((o) => (field.value || []).includes(o.value))
                : options.find((o) => o.value === field.value) || null
            }
            {...selectProps}
          />
        )}
      />

      {showError && hasError && (
        <p className="text-danger mt-1 mb-0 small">{errorMessage}</p>
      )}

      {helpText && <span className="text-muted small">{helpText}</span>}
    </div>
  );
};

/* -------------------- PropTypes -------------------- */
FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array,
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
  selectProps: PropTypes.shape({
    onAddClick: PropTypes.func,
    addButtonLabel: PropTypes.string,
  }),
};

export default FormSelect;
