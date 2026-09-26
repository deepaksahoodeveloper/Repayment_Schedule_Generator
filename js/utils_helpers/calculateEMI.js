/**
 * Calculates the Equated Monthly/Weekly Installment (EMI) amount.
 * 
 * @param {number} principal - The original loan amount (P)
 * @param {number} periodicRate - The interest rate per period (r) as a decimal (e.g., 0.002308)
 * @param {number} installmentCount - Total number of repayments (n)
 * @returns {number} The calculated EMI installment amount
 */
export function calculateEMI(principal, periodicRate, installmentCount) {
    // Excel Equivalent: IF(PeriodicRate=0, Principal/InstallmentCount, ...)
    if (periodicRate === 0) {
        return principal / installmentCount;
    }
    
    // Excel Equivalent: Principal*PeriodicRate*(1+PeriodicRate)^InstallmentCount/((1+PeriodicRate)^InstallmentCount-1)
    const compoundingFactor = Math.pow(1 + periodicRate, installmentCount);
    
    const numerator = principal * periodicRate * compoundingFactor;
    const denominator = compoundingFactor - 1;
    
    return numerator / denominator;
}