/**
 * Calculates the final adjusted due date based on the expected due date,
 * adjustment rule, weekends, and holidays.
 *
 * @param {string|Date} expectedDueDate - The original/expected due date
 * @param {number} adjustment - Adjustment rule:
 *   0  = No adjustment
 *   1  = Move to the next business day
 *  -1  = Move to the previous business day
 * @param {Array<string|Date>} holidayList - List of holidays
 * @returns {Date} Final adjusted due date
 * @throws {Error} If the adjustment value is not 0, 1, or -1
 */
function getFinalAdjustedDueDate(
  expectedDueDate,
  adjustment,
  holidayList = []
) {
  // Convert the expected due date into a Date object.
  const date = new Date(expectedDueDate);

  // Convert the holiday list into a Set of formatted date strings.
  // Using a Set makes it efficient to check whether a date is a holiday.
  const holidays = new Set(
    holidayList.map(formatDate)
  );

  // No adjustment is required.
  // Return the expected due date as it is.
  if (adjustment === 0) {
    return date;
  }

  // Next business day:
  // Keep moving the date forward until it is not a weekend
  // and is not included in the holiday list.
  if (adjustment === 1) {
    while (!isBusinessDay(date, holidays)) {
      date.setDate(date.getDate() + 1);
    }

    return date;
  }

  // Previous business day:
  // Keep moving the date backward until it is not a weekend
  // and is not included in the holiday list.
  if (adjustment === -1) {
    while (!isBusinessDay(date, holidays)) {
      date.setDate(date.getDate() - 1);
    }

    return date;
  }

  // Throw an error if an unsupported adjustment value is provided.
  throw new Error("Adjustment must be 1, -1, or 0");
}