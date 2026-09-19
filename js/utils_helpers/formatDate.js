/**
 * Converts a date into a standard YYYY-MM-DD format.
 *
 * Example:
 * Date -> 2026-09-17
 *
 * This format is used to compare dates consistently,
 * especially when checking whether a date is a holiday.
 *
 * @param {string|Date} date - Date to format
 * @returns {string} Date in YYYY-MM-DD format
 */
export function formatDate(date) {
  // Convert the input into a Date object.
  const d = new Date(date);

  // Return the date in YYYY-MM-DD format.
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}