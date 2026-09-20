/**
 * 
 */

import { Logger } from "../utils_helpers/logger.js";
import { calculateScheduledPrincipal } from "./calculateSchedulePrincipal.js"
import { calculateActualPrincipal } from "./calculateActualPrincipal.js"

export function generatePrincipalInterestAmount(LOAN_PARAMETERS){

    const principalInterestAmount = [];
    let openingPrincipal = LOAN_PARAMETERS.principalAmount;
    let cumulativePrincipal = 0;
    let remainingPrincipal = LOAN_PARAMETERS.principalAmount;
    let closingPrincipal = LOAN_PARAMETERS.principalAmount;

    // Generate due dates for each scheduled installment.
    for (
        let installmentNumber = 1;
        installmentNumber <= LOAN_PARAMETERS.numberOfInstallments;
        installmentNumber++
    ) {
        openingPrincipal = (installmentNumber === 1) ? openingPrincipal : closingPrincipal;
        const scheduledPrincipal = calculateScheduledPrincipal(
            LOAN_PARAMETERS.repaymentMethod,
            LOAN_PARAMETERS.principalAmount,
            LOAN_PARAMETERS.numberOfInstallments
        );
        const actualPrincipal = calculateActualPrincipal(
            installmentNumber,
            LOAN_PARAMETERS.numberOfInstallments,
            openingPrincipal,
            scheduledPrincipal,
            LOAN_PARAMETERS.roundingRule,
            LOAN_PARAMETERS.roundingDecimalPlaces
        );
        cumulativePrincipal = cumulativePrincipal + actualPrincipal;
        remainingPrincipal = remainingPrincipal - actualPrincipal;
        closingPrincipal = closingPrincipal - actualPrincipal;

        //const openingPrincipal = 10000;
        const annualRate = LOAN_PARAMETERS.annualInterestRate;
        const daysInPeriod = 2;
        const dayCountDenom = 2;
        const periodicRate = 2;
        const Methodology = 2;
        const unroundedInterest = 2;
        const roundedInterest = 2;
        const cumulativeInterest = 2;

        // Step 3: Store the Principal Amount
        principalInterestAmount.push({
            installmentNumber,
            openingPrincipal,
            scheduledPrincipal,
            actualPrincipal,
            cumulativePrincipal,
            remainingPrincipal,
            closingPrincipal
        });
        
    }

    Logger.info("103-principal-interest-engine.js","generatePrincipalInterestAmount", principalInterestAmount);
    // Return the complete list of installment due dates.
    return principalInterestAmount;
    
}