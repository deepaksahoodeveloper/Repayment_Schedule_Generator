/**
 * Calculates the fee amount due for a specific installment period.
 * 
 * @param {string} feeTiming - Timing of the fee ("Upfront at Disbursement", "Added to First Installment", or amortized)
 *                             Value: "upfront", "first-installment", or "spread"
 * @param {number} currentPeriod - The current installment number/period (e.g., 1, 2, 3...)
 * @param {number} feeAmount - The total amount of the fee to be distributed
 * @param {number} totalPeriods - The total number of installments/periods
 * @returns {number} The fee amount due for the current period 
 */

import { Logger } from "./logger.js";

export function calculateInstallmentFee(feeTiming, currentPeriod, feeAmount, totalPeriods) {
    
    // 1. Guard against edge cases (division by zero or invalid inputs)
    if (!feeAmount || feeAmount <= 0) return 0;

    // 2. Evaluate based on timing configuration
    switch (feeTiming) {
        case "upfront":
            return 0;

        case "first-installment":
            return currentPeriod === 1 ? feeAmount : 0;

        default:
            // Amortized / split across all installments
            if (!totalPeriods || totalPeriods <= 0) return 0;
            
            // Standard division (highly precise math floating points)
            const calculatedFee = feeAmount / totalPeriods;
            
            // Optional: Round to 2 decimal places to prevent JS floating-point issues (e.g., 0.1 + 0.2 = 0.300000004)
            return Math.round((calculatedFee + Number.EPSILON) * 100) / 100;
    }
}
