
/**
 * File: calculateFinalAdjustedDueDate.js
 * --------------------------------------------------
 * Function:
 * adjustDueDateForBusinessDay()
 *
 * Purpose:
 * Adjust an expected loan repayment due date when it falls
 * on a weekend or a configured public holiday.
 *
 * Adjustment rules:
 *   0  = No adjustment
 *   1  = Move forward to the next business day
 *  -1  = Move backward to the previous business day
 *
 * A business day is defined as a day that is neither
 * Saturday/Sunday nor included in the holiday list.
 *
 * Dependencies:
 * - formatDate()
 * - isBusinessDay()
 *
 * @param {string|Date} expectedDueDate
 *   Original scheduled due date.
 *
 * @param {number} adjustment
 *   Business-day adjustment rule: -1, 0, or 1.
 *
 * @param {Array<string|Date>} holidayList
 *   List of holidays to exclude from business days.
 *
 * @returns {Date}
 *   Final adjusted due date.
 *
 * @throws {Error}
 *   If the date or adjustment rule is invalid.
 */
import { formatDate } from "../utils_helpers/formatDate.js";
import { isBusinessDay } from "./isBusinessDay.js"

export function calculateFinalAdjustedDueDate(
    expectedDueDate,
    adjustment,
    holidayList = []
) {

    // Step 1: Validate the adjustment rule.
    // Only the supported values -1, 0, and 1 are accepted.
    if (![0, 1, -1].includes(adjustment)) {
        throw new Error(
            "Invalid adjustment rule. Use 0 (no adjustment), " +
            "1 (next business day), or -1 (previous business day)."
        );
    }

    // Step 2: Convert the expected due date into a Date object.
    const date = new Date(expectedDueDate);

    // Stop processing if the supplied date is invalid.
    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid expected due date.");
    }

    // Step 3: Normalize the holiday list into a Set.
    // This allows efficient holiday lookups during adjustment.
    const holidays = new Set(
        holidayList.map(formatDate)
    );

    // Step 4: Return the original date when no adjustment
    // is required.
    if (adjustment === 0) {
        return date;
    }

    // Step 5: Determine the direction of adjustment.
    // Positive = move forward; negative = move backward.
    const direction = adjustment;

    // Step 6: Move one calendar day at a time until the date
    // is a valid business day.
    while (!isBusinessDay(date, holidays)) {
        date.setDate(
            date.getDate() + direction
        );
    }

    // Step 7: Return the final adjusted business date.
    return date;
}