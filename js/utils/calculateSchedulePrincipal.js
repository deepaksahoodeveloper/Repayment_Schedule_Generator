/**
 * Calculates the Scheduled Principal for a specific loan installment row.
 * Mimics the logic of the financial engine Excel model formula.
 *
 * @param {string} methodology - The loan repayment type chosen
 * @param {number} principal - The starting total loan amount
 * @param {number} installmentCount - Total number of periods/installments for the loan
 * @param {number} emiAmount - Total fixed monthly payment (Principal + Interest)
 * @param {number} interestAmount - From HELPER_INTEREST!I3 (Interest calculated for this period)
 * @returns {number} The calculated scheduled principal amount for this row
 */
export function calculateScheduledPrincipal(methodology, principal, installmentCount, emiAmount, roundedInterest) {
    
    // 1. STRAIGHT-LINE PRINCIPAL REDUCTION METHODS
    // Applies to: "Flat Interest" and "Reducing Balance - Equal Principal"
    if (methodology === "flat-interest" || methodology === "reducing-balance") {
        // Prevent application crash/infinity if installment count is set to zero
        if (installmentCount === 0) return 0; 
        
        // Split the total principal evenly across all installments
        return Math.round((principal / installmentCount) * 100) / 100;
    }

    // 2. EQUATED MONTHLY INSTALLMENT (EMI) METHOD
    // Applies to standard amortizing loans where the total periodic payment is constant.
    if (methodology === "reducing-emi") {
        // Principal is the remainder of the fixed payment after covering this month's interest
        return emiAmount - roundedInterest;
    }

    // 4. THE FALLBACK (ERROR HANDLING)
    // If the methodology string does not match any allowed loan types, throw an error.
    // This replicates the Excel #N/A fallback behavior.
    throw new Error("#N/A: Invalid or unrecognized Methodology");
}
