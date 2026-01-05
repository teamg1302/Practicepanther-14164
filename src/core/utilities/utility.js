/**
 * Utility functions for common operations.
 * @module core/utilities/utility
 */

import { useSelector } from "react-redux";

/**
 * Checks if the given user is the owner of their firm.
 * This is a pure function that can be called from anywhere.
 *
 * @param {Object} user - User object from Redux state (state.auth.user)
 * @returns {boolean} True if user is the firm owner, false otherwise
 * @example
 * const user = useSelector((state) => state.auth?.user);
 * if (isOwner(user)) {
 *   // User is the owner
 * }
 */
export const isOwner = (user) => {
  if (!user || !user.firmId || !user.id) {
    return false;
  }
  return user.firmId.ownerId === user.id;
};

/**
 * Custom hook to check if the current authenticated user is the firm owner.
 * This hook automatically gets the user from Redux store.
 *
 * @returns {boolean} True if current user is the firm owner, false otherwise
 * @example
 * function MyComponent() {
 *   const owner = useIsOwner();
 *   if (owner) {
 *     return <div>You are the owner</div>;
 *   }
 *   return <div>You are not the owner</div>;
 * }
 */
export const useIsOwner = () => {
  const user = useSelector((state) => state.auth?.user);
  return isOwner(user);
};

/**
 * Generates an array of hour options (00-23) for time selection.
 *
 * @returns {Array<{label: string, value: string}>} Array of hour options with label and value
 * @example
 * const hours = getHours();
 * // Returns: [{ label: '00', value: '00' }, { label: '01', value: '01' }, ...]
 */
export const getHours = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    label: String(i).padStart(2, "0"),
    value: String(i).padStart(2, "0"),
  }));
};

/**
 * Generates an array of minute options (00, 05, 10, ..., 55) for time selection.
 *
 * @returns {Array<{label: string, value: string}>} Array of minute options with label and value
 * @example
 * const minutes = getMinutes();
 * // Returns: [{ label: '00', value: '00' }, { label: '05', value: '05' }, ...]
 */
export const getMinutes = () => {
  return [
    "00",
    "05",
    "10",
    "15",
    "20",
    "25",
    "30",
    "35",
    "40",
    "45",
    "50",
    "55",
  ].map((m) => ({
    label: m,
    value: m,
  }));
};
