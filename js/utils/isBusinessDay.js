/**
 * Checks whether a given date is a business day.
 *
 * A business day is:
 * - Monday through Friday
 * - Not a holiday
 *
 * @param {Date} date - Date to check
 * @param {Set<string>} holidays - Set containing formatted holiday dates
 * @returns {boolean} True if the date is a business day, otherwise false
 */

import { formatDate } from "../utils_helpers/formatDate.js";
export function isBusinessDay(date, holidayList = new Set()) {
  // getDay() returns:
  // 0 = Sunday
  // 1 = Monday
  // ...
  // 6 = Saturday
  const day = date.getDay();

  // Check whether the date falls on Saturday or Sunday.
  const isWeekend = day === 0 || day === 6;

  // Convert to a Set if an array is passed, otherwise use as is
  const holidays = holidayList instanceof Set ? holidayList : new Set(holidayList);

  // Check whether the date exists in the holiday list.
  const isHoliday = holidays.has(formatDate(date));

  // A business day must be neither a weekend nor a holiday.
  return !isWeekend && !isHoliday;
}