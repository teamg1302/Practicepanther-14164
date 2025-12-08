/**
 * API Select component for React Hook Form that fetches options from an API.
 * Supports dependent fields that watch other form fields.
 * @module feature-module/components/form-elements/api-select
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormContext, useWatch } from "react-hook-form";
import Select from "@/feature-module/components/form-elements/select";

/**
 * API Select component props.
 * @typedef {Object} ApiSelectProps
 * @property {string} name - Field name for React Hook Form registration
 * @property {string} label - Label text for the select
 * @property {Function} api - API function to fetch options
 * @property {boolean} [isDependent=false] - Whether this field depends on another field
 * @property {string} [dependentKey] - Name of the field to watch
 * @property {string} [dependentValue="value"] - Property to extract from dependent field value (e.g., "value", "id")
 * @property {boolean} [required=false] - Whether the field is required
 * @property {string} [className] - Additional CSS classes
 * @property {string} [placeholder] - Placeholder text
 */

/**
 * API Select component that fetches options dynamically from an API.
 * Can watch a dependent field and fetch options based on its value.
 *
 * @param {ApiSelectProps} props - Component props
 * @returns {JSX.Element} Select component with API-fetched options
 *
 * @example
 * // Basic API select
 * <ApiSelect
 *   name="state"
 *   label="State"
 *   api={getStatesByCountry}
 * />
 *
 * @example
 * // Dependent on country field
 * <ApiSelect
 *   name="state"
 *   label="State"
 *   api={getStatesByCountry}
 *   isDependent={true}
 *   dependentKey="country"
 *   dependentValue="value"
 * />
 */
const ApiSelect = ({
  name,
  label,
  api,
  isDependent = false,
  dependentKey,
  dependentValue = "value",
  required = false,
  className = "",
  placeholder,
  ...rest
}) => {
  const { control, setValue } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Watch the dependent field if isDependent is true
  const dependentFieldValue = useWatch({
    control,
    name: dependentKey,
    defaultValue: null,
  });

  useEffect(() => {
    // If field is dependent, wait for dependent field value
    if (isDependent && !dependentFieldValue) {
      setOptions([]);
      setValue(name, null); // Clear the field when dependent value is cleared
      return;
    }

    // Extract the value from dependent field if needed
    let apiParam = null;
    if (isDependent && dependentFieldValue) {
      // If dependentValue is "value", extract the value property
      // Otherwise, use the dependentFieldValue directly or extract the specified property
      if (dependentValue === "value") {
        apiParam =
          typeof dependentFieldValue === "object" &&
          dependentFieldValue !== null
            ? dependentFieldValue.value
            : dependentFieldValue;
      } else {
        apiParam =
          typeof dependentFieldValue === "object" &&
          dependentFieldValue !== null
            ? dependentFieldValue[dependentValue]
            : dependentFieldValue;
      }
    }

    // Fetch options from API
    const fetchOptions = async () => {
      if (!api) {
        setOptions([]);
        return;
      }

      setLoading(true);
      setError(null);
      setValue(name, null); // Clear the field when fetching new options

      try {
        const params = isDependent && apiParam ? { countryId: apiParam } : {};
        const response = await api(params);

        // Transform API response to match Select component format
        const formattedOptions = Array.isArray(response?.list)
          ? response.list.map((item) => ({
              label: item.name,
              value: item._id,
            }))
          : Array.isArray(response?.data)
          ? response.data.map((item) => ({
              label: item.name || item.label,
              value: item._id || item.value,
            }))
          : Array.isArray(response)
          ? response.map((item) => ({
              label: item.name || item.label,
              value: item._id || item.value,
            }))
          : [];

        setOptions(formattedOptions);
      } catch (err) {
        console.error("Error fetching options:", err);
        setError(err?.message || "Failed to fetch options");
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [
    api,
    isDependent,
    dependentKey,
    dependentFieldValue,
    dependentValue,
    name,
    setValue,
  ]);

  return (
    <Select
      name={name}
      label={label}
      options={options}
      required={required}
      className={className}
      placeholder={loading ? "Loading..." : placeholder}
      disabled={loading || (isDependent && !dependentFieldValue)}
      helpText={
        error
          ? `Error: ${error}`
          : isDependent && !dependentFieldValue
          ? `Please select ${dependentKey} first`
          : undefined
      }
      {...rest}
    />
  );
};

ApiSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  api: PropTypes.func.isRequired,
  isDependent: PropTypes.bool,
  dependentKey: PropTypes.string,
  dependentValue: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

ApiSelect.defaultProps = {
  isDependent: false,
  dependentKey: undefined,
  dependentValue: "value",
  required: false,
  className: "",
  placeholder: "Select...",
};

export default ApiSelect;
