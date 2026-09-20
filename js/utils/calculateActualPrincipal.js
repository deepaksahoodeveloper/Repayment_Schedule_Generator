/**
 * Calculates the Actual Principal for a specific row.
 * Mimics: =IF(HELPER_DATES!I3=FALSE(),0,IF(A3=InstallmentCount,B3,IF(RoundingRule="Round Up",ROUNDUP(C3,RoundDecimals),IF(RoundingRule="Round Down",ROUNDDOWN(C3,RoundDecimals),ROUND(C3,RoundDecimals)))))
 *
 * @param {number} currentInstallment - From A3 (The current installment number)
 * @param {number} totalInstallments - From InstallmentCount (Total planned installments)
 * @param {number} openingPrincipal - From B3 (Remaining balance left on the loan)
 * @param {number} scheduledPrincipal - From C3 (The raw, calculated monthly target)
 * @param {string} roundingRule - "Round Up", "Round Down", or "Round"
 * @param {number} roundDecimals - Number of decimal places (usually 2 for cents)
 * @returns {number} The finalized actual principal amount
 */
export function calculateActualPrincipal(
    currentInstallment, 
    totalInstallments, 
    openingPrincipal, 
    scheduledPrincipal, 
    roundingRule, 
    roundDecimals
) {
    // STEP 1: Is this the absolute last payment of the loan?
    // If yes, return everything left on the loan balance (Opening Principal) to clear it to 0.00
    if (currentInstallment === totalInstallments) {
        return openingPrincipal;
    }

    // STEP 2: For normal months, apply the configured Excel rounding math
    const factor = Math.pow(10, roundDecimals);

    if (roundingRule === "up") {
        // Replicates Excel's ROUNDUP
        return Math.ceil(scheduledPrincipal * factor) / factor;
    } 
    else if (roundingRule === "down") {
        // Replicates Excel's ROUNDDOWN
        return Math.floor(scheduledPrincipal * factor) / factor;
    } 
    else {
        // Replicates Excel's standard ROUND
        return Math.round(scheduledPrincipal * factor) / factor;
    }
}
