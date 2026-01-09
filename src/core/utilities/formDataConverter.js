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

  // Ensure fileFields is an array (handle null/undefined cases)
  const fileFieldsArray = Array.isArray(fileFields) ? fileFields : [];
  const processedKeys = new Set();

  // Append all form fields to FormData
  Object.keys(formData).forEach((key) => {
    processedKeys.add(key);
    let value = formData[key];
    const isFileField = fileFieldsArray.includes(key);

    // For file fields, try to get the actual File object from form state
    if (isFileField) {
      let fileValue = value;
      const originalValue = value; // Preserve original value from formData

      // If getValues is provided, use it to get the actual File object
      if (getValues) {
        fileValue = getValues(key);
      }

      // If getValues returns a File object, use it (new file upload)
      if (fileValue instanceof File) {
        value = fileValue;
      } else if (
        fileValue === null ||
        fileValue === undefined ||
        fileValue === ""
      ) {
        // If getValues returns null/empty, check if original value exists (existing file URL)
        if (
          originalValue &&
          typeof originalValue === "string" &&
          originalValue.trim() !== ""
        ) {
          // Keep the original value (existing file URL) - don't delete it
          value = originalValue;
        } else {
          // Both are empty - user deleted the file, append as empty string for deletion
          formDataToSubmit.append(key, "");
          return;
        }
      } else {
        // If it's a file field but not a File instance, use the original value if it exists
        if (
          originalValue &&
          typeof originalValue === "string" &&
          originalValue.trim() !== ""
        ) {
          value = originalValue;
        } else {
          // No valid value, append as empty string
          formDataToSubmit.append(key, "");
          return;
        }
      }
    }

    // Skip null, undefined, or empty string values (except for file fields which are handled above)
    if (
      skipEmpty &&
      !isFileField &&
      (value === null || value === undefined || value === "")
    ) {
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

  // Handle file fields that might not be in formData but should be checked via getValues
  if (getValues) {
    fileFieldsArray.forEach((key) => {
      if (!processedKeys.has(key)) {
        const fileValue = getValues(key);
        // If getValues returns a File object, use it (new file upload)
        if (fileValue instanceof File) {
          formDataToSubmit.append(key, fileValue);
        } else if (
          fileValue === null ||
          fileValue === undefined ||
          fileValue === ""
        ) {
          // Field not in formData and getValues returns empty - append as empty string for deletion
          formDataToSubmit.append(key, "");
        } else if (typeof fileValue === "string" && fileValue.trim() !== "") {
          // If it's a string (URL), append it
          formDataToSubmit.append(key, fileValue);
        } else {
          // No valid value, append as empty string
          formDataToSubmit.append(key, "");
        }
      }
    });
  }

  return formDataToSubmit;
};

/**
 * Default export for convenience.
 */
export default convertToFormData;
