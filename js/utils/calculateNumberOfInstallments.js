/**
 * calculateNumberOfInstallments.js
 * -----------------------------------------------------------------
 * Calculates the number of installments for a given value,
 * unit, and payment frequency.
 * 
 * unit: Value unit (days, weeks, months, or years)
 * value: The value of the unit (e.g., 12 for 12 months)
 * frequency: Payment frequency (weekly, biweekly, monthly, or quarterly)
 *
 * Usage: calculateNumberOfInstallments("months", 12, "monthly");
 */

// Import the periods object from the perids.js file
import { periods } from "../utils_helpers/perids.js";
/**
 * Calculates the number of installments for a given value,
 * unit, and payment frequency.
 *
 * @param {string} unit - Value unit: "days", "weeks", "months", or "years"
 * @param {number} value - The value of the unit (e.g., 12 for 12 months)
 * @param {string} frequency - Payment frequency: "daily", "weekly", "monthly", or "Quarterly"
 * @returns {number|string} The calculated number of installments, or an empty string for invalid input.
 */
export function calculateNumberOfInstallments(unit, value, frequency) {
    // Check if any required input is missing.
    // If so, return an empty string.
    if (!unit || !value || !frequency) {
        return "";
    }

    // Calculate the raw number of installments.
    // 'periods[unit][frequency]' gives the conversion factor
    // based on the selected unit and payment frequency.
    const rawInstallments = value * periods[unit][frequency];

    // Round the result to the nearest whole number.
    // Math.max() ensures the result is never less than 1.
    return Math.max(1, Math.round(rawInstallments));
}