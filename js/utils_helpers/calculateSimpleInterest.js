/**
 * Calculates simple interest based on standard day-count conventions.
 * 
 * @param {number} principal - The initial amount borrowed or invested.
 * @param {number} annualRate - The annual interest rate (e.g., 6.5 for 6.5%).
 * @param {number} totalTenureDays - The exact number of days for the loan/investment.
 * @param {number} [dayCountDenominator=365] - The day-count convention base (typically 365 or 360).
 * @returns {number} The calculated simple interest rounded to 2 decimal places.
 */
export function calculateSimpleInterest(principal, annualRate, totalTenureDays, dayCountDenominator = 365) {
    // 1. Convert percentage (e.g., 6.5) to decimal (e.g., 0.065)
    const rateAsDecimal = annualRate / 100;
    
    // 2. Apply the financial formula
    const interest = principal * rateAsDecimal * totalTenureDays / dayCountDenominator;
    
    // 3. Return the result rounded to 2 decimal places
    return Math.round(interest * 100) / 100;
}
