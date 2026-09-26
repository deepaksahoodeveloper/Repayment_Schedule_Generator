
/**
 * File: calculateExpectedDueDate.js
 * --------------------------------------------------
 * Purpose:
 * Provide reusable date calculation functions for the
 * loan repayment schedule generator.
 *
 * Function:
 * calculateExpectedDueDate()
 *
 * Description:
 * Calculates the unadjusted expected due date for a
 * specific installment based on the repayment frequency
 * installment number and first repayment date.
 *
 * Supported frequencies:
 * - Daily
 * - Weekly
 * - Bi-weekly
 * - Monthly
 * - Quarterly
 *
 * Note:
 * This function calculates the expected due date only.
 * Weekend and holiday adjustments are handled separately.
 *
 * @param {string} frequency
 *   Repayment frequency.
 *
 * @param {string|Date} firstRepaymentDate
 *   Scheduled date of the first installment.
 *
 * @param {number} installmentNumber
 *   1-based installment number.
 *
 * @returns {Date|null}
 *   Calculated expected due date, or null if the
 *   input is invalid or the frequency is unsupported.
 */

import { Logger } from "../utils_helpers/logger.js";
export function calculateExpectedDueDate(
    frequency,
    firstRepaymentDate,
    installmentNumber
) {

    // Validate the installment number.
    // Installment numbering starts from 1.
    if (
        !Number.isInteger(installmentNumber) ||
        installmentNumber < 1
    ) {
        return null;
    }

    // Convert the supplied repayment date into a Date object.
    const date = new Date(firstRepaymentDate);

    // Ensure the supplied date is valid.
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    // Calculate the number of repayment periods to add.
    // The first installment is due on the first repayment date.
    // Example: installment 1 = 0 months/weeks/days added,
    // installment 2 = 1 period added, etc.
    const periodsToAdd = installmentNumber - 1;

    // Calculate the expected due date based on the frequency.
    switch (frequency) {

        case "daily":
            // Add one calendar day per repayment period.
            date.setDate(
                date.getDate() + periodsToAdd
            );
            break;

        case "weekly":
            // Add seven calendar days per repayment period.
            date.setDate(
                date.getDate() + periodsToAdd * 7
            );
            break;

        case "biweekly":
            // Add fourteen calendar days per repayment period.
            date.setDate(
                date.getDate() + periodsToAdd * 14
            );
            break;

        case "monthly":
            // Add one calendar month per repayment period.
            date.setMonth(
                date.getMonth() + periodsToAdd
            );
            break;

        case "quarterly":
            // Add three calendar months per repayment period.
            date.setMonth(
                date.getMonth() + periodsToAdd * 3
            );
            break;

        default:
            // Return null when the repayment frequency
            // is not supported.
            return null;
    }
    // Return the calculated unadjusted due date.
    return date;
}