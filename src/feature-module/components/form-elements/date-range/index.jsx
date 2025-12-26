/**
 * Reusable Date Range Picker component for React Hook Form.
 * @module feature-module/components/form-elements/date-range-input
 *
 * Features:
 * - Integrated with React Hook Form (Controller)
 * - MUI X DateRangePicker
 * - Shortcut presets support
 * - Error handling & accessibility
 * - Default null values
 * - Customizable slotProps
 */

import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import FullCalendar from "@fullcalendar/react";

/** Default shortcut items */
const defaultShortcuts = [
  {
    label: "This Week",
    getValue: () => {
      const today = dayjs();
      return [today.startOf("week"), today.endOf("week")];
    },
  },
  {
    label: "Last Week",
    getValue: () => {
      const today = dayjs().subtract(7, "day");
      return [today.startOf("week"), today.endOf("week")];
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => [dayjs().subtract(7, "day"), dayjs()],
  },
  {
    label: "Current Month",
    getValue: () => {
      const today = dayjs();
      return [today.startOf("month"), today.endOf("month")];
    },
  },
  {
    label: "Next Month",
    getValue: () => {
      const start = dayjs().endOf("month").add(1, "day");
      return [start, start.endOf("month")];
    },
  },
  { label: "Reset", getValue: () => [null, null] },
];

const DateRangeInput = ({
  name,
  label,
  required = false,
  className = "",
  shortcuts = defaultShortcuts,
  size = "small",
  showError = true,
}) => {
  const {
    control,
    formState: { errors },
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

  const error = getNestedError(errors, name);
  const hasError = !!error;

  return (
    <div className={`mb-3 ${className}`}>
      <label className="form-label">
        {label}
        {required && (
          <span className="text-danger ms-1" aria-label="required">
            *
          </span>
        )}
      </label>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          defaultValue={[null, null]}
          rules={{
            required: required ? `${label} is required.` : false,
          }}
          render={({ field }) => (
            <DateRangePicker
              {...field}
              value={field.value || [null, null]}
              onChange={(newValue) => field.onChange(newValue)}
              slotProps={{
                textField: {
                  size,
                  fullWidth: true,
                  error: hasError,
                },
                shortcuts: {
                  items: shortcuts,
                },
                actionBar: {
                  actions: [], // enable OK & Cancel
                },
              }}
              className={`custom-date-range ${hasError ? "mui-error" : ""}`}
            />
          )}
        />
      </LocalizationProvider>

      {showError && hasError && (
        <p className="text-danger mt-1 mb-0 small" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

DateRangeInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
  shortcuts: PropTypes.array,
  size: PropTypes.oneOf(["small", "medium"]),
  showError: PropTypes.bool,
};

export default DateRangeInput;
