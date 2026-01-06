/**
 * Firm service for managing firm information.
 * @module core/services/firmService
 *
 * Provides functions to:
 * - Get firm details by user firm ID
 * - Update firm details
 */

import api from "./api";

/**
 * Get firm details by user Firm Id
 * @param {string|number} userFirmId - User Firm ID to fetch firm details for
 * @returns {Promise} API response with firm details
 */
export const getFirmDetails = async (userFirmId) => {
  try {
    const response = await api.get(`/masters/firm/${userFirmId}`);
    // Handle nested response structure (e.g., response.data.data.firm)
    // Similar to getUserDetails pattern
    return response.data?.data?.firm || response.data?.firm || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update firm details by user Firm ID
 * Supports both JSON and FormData for file uploads
 * Automatically handles multipart/form-data when FormData is passed
 *
 * @param {string|number} userFirmId - User Firm ID to update
 * @param {FormData|Object} firmData - Firm data to update
 *   - FormData: For file uploads (multipart/form-data)
 *   - Object: For JSON requests
 *
 * @param {string} [firmData.accountOwner] - Account owner
 * @param {string} [firmData.legalBusinessName] - Legal business name
 * @param {string} [firmData.country] - Country
 * @param {string} [firmData.countrySpecify] - Country specification (when Other is selected)
 * @param {string} [firmData.address1] - Address line 1
 * @param {string} [firmData.address2] - Address line 2
 * @param {string} [firmData.city] - City
 * @param {string} [firmData.zipPostalCode] - ZIP/Postal code
 * @param {string} [firmData.phoneNumber] - Phone number
 * @param {string} [firmData.firmEmailAddress] - Firm email address
 * @param {string} [firmData.website] - Website URL
 * @param {string} [firmData.taxId] - Tax ID
 * @param {string} [firmData.primaryPracticeArea] - Primary practice area
 * @param {string} [firmData.numberOfAttorneys] - Number of attorneys
 * @param {string} [firmData.businessStructure] - Business structure
 * @param {Date|string} [firmData.formationDate] - Formation date
 * @param {string} [firmData.primaryOwnerEmail] - Primary owner email
 * @param {string} [firmData.ownerFirstName] - Owner first name
 * @param {string} [firmData.ownerLastName] - Owner last name
 * @param {string} [firmData.ownerPhoneNumber] - Owner phone number
 * @param {string} [firmData.barNumber] - Bar number
 * @param {File} [firmData.firmLogo] - Firm logo file (when using FormData)
 *
 * @returns {Promise} API response with updated firm details
 *
 * @example
 * // JSON request (no files)
 * await updateFirmDetails(userFirmId, { legalBusinessName: "ABC Law Firm", firmEmailAddress: "info@abclaw.com" });
 *
 * @example
 * // Multipart request (with files)
 * const formData = new FormData();
 * formData.append("legalBusinessName", "ABC Law Firm");
 * formData.append("firmLogo", file);
 * await updateFirmDetails(userFirmId, formData);
 */
export const updateFirmDetails = async (userFirmId, firmData) => {
  try {
    // Handles both FormData (multipart/form-data) and regular objects (JSON):
    //
    // For FormData (file uploads):
    // - The API interceptor automatically detects FormData
    // - Removes the default Content-Type header
    // - Browser sets Content-Type with boundary automatically
    // - Enables proper multipart/form-data handling for file uploads
    //
    // For regular objects (JSON):
    // - Uses default application/json Content-Type
    // - Standard JSON request

    const response = await api.patch(`/masters/firm/${userFirmId}`, firmData);

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
