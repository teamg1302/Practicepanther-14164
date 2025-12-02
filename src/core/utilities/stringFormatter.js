/**
 * Utility functions for string formatting and conversion.
 * @module core/utilities/stringFormatter
 *
 * Provides functions for converting strings between different formats,
 * such as snake_case to Title Case, camelCase, etc.
 */

/**
 * Converts a snake_case or lowercase string to Title Case.
 * Replaces underscores with spaces and capitalizes the first letter of each word.
 *
 * @param {string} str - The string to convert (e.g., "manage_contact_payments")
 * @returns {string} The formatted string in Title Case (e.g., "Manage Contact Payments")
 *
 * @example
 * formatToTitleCase("manage_contact_payments");
 * // Returns: "Manage Contact Payments"
 *
 * @example
 * formatToTitleCase("user_profile");
 * // Returns: "User Profile"
 *
 * @example
 * @example
 * formatToTitleCase("hello world");
 * // Returns: "Hello World"
 */
export const formatToTitleCase = (str) => {
  if (!str || typeof str !== "string") {
    return "";
  }

  return str
    .split("_")
    .map((word) => {
      // Capitalize first letter and lowercase the rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

/**
 * Default export for convenience.
 */
export default formatToTitleCase;

