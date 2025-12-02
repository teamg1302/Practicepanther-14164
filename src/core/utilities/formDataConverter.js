/**
 * Utility functions for converting form data to FormData.
 * @module core/utilities/formDataConverter
 *
 * Handles conversion of form data objects to FormData for file uploads and API submissions.
 * Supports:
 * - File objects (appended as binary)
 * - Boolean values (converted to strings)
 * - Objects and arrays (JSON stringified)
 * - Primitive values (strings, numbers, etc.)
 * - Optional getValues function for retrieving File objects from form state
 */

/**
 * Converts a form data object to FormData for API submission.
 *
 * @param {Object} formData - Form data object from React Hook Form
 * @param {Object} [options={}] - Optional configuration
 * @param {Function} [options.getValues] - Function to get values from form state (useful for File objects)
 * @param {Array<string>} [options.fileFields=[]] - Array of field names that should be treated as files
 * @param {boolean} [options.skipEmpty=true] - Whether to skip null, undefined, or empty string values
 * @returns {FormData} FormData object ready for API submission
 *
 * @example
 * // Basic usage
 * const formData = { name: "John", age: 30, profileImage: fileObject };
 * const formDataToSubmit = convertToFormData(formData);
 *
 * @example
 * // With getValues for File objects
 * const { getValues } = useFormContext();
 * const formDataToSubmit = convertToFormData(formData, { getValues });
 *
 * @example
 * // With specific file fields
 * const formDataToSubmit = convertToFormData(formData, {
 *   fileFields: ["profileImage", "logo"]
 * });
 */
export const convertToFormData = (formData, options = {}) => {
  const { getValues = null, fileFields = [], skipEmpty = true } = options;

  const formDataToSubmit = new FormData();

  // Append all form fields to FormData
  Object.keys(formData).forEach((key) => {
    let value = formData[key];

    // For file fields, try to get the actual File object from form state
    if (fileFields.includes(key) && getValues) {
      const fileValue = getValues(key);
      if (fileValue instanceof File) {
        value = fileValue;
      }
    }

    // Skip null, undefined, or empty string values
    if (skipEmpty && (value === null || value === undefined || value === "")) {
      return;
    }

    // Handle file uploads - single File object (append as binary)
    if (value instanceof File) {
      formDataToSubmit.append(key, value);
      return;
    }

    // Convert boolean to string for FormData
    if (typeof value === "boolean") {
      formDataToSubmit.append(key, value.toString());
      return;
    }

    // Handle arrays and objects (convert to JSON string if needed)
    if (typeof value === "object" && !(value instanceof File)) {
      formDataToSubmit.append(key, JSON.stringify(value));
      return;
    }

    // Handle primitive values (strings, numbers, etc.)
    formDataToSubmit.append(key, value);
  });

  return formDataToSubmit;
};

/**
 * Default export for convenience.
 */
export default convertToFormData;
