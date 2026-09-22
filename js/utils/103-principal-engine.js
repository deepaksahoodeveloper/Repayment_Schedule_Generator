import { Logger } from "../utils_helpers/logger.js";
import { calculateScheduledPrincipal } from "./calculateSchedulePrincipal.js"
import { calculateActualPrincipal } from "./calculateActualPrincipal.js"
import { calculateUnroundedInterest } from "./calculateUnroundedInterest.js"
import { roundValue } from "../utils_helpers/rounding.js";

export function generatePrincipalAmounts(LOAN_PARAMETERS, installmentDates, totalFlatInterest, emiAmount){

    const principalInterestAmount = [];
    let openingPrincipal = LOAN_PARAMETERS.principalAmount;
    let cumulativePrincipal = 0;
    let remainingPrincipal = LOAN_PARAMETERS.principalAmount;
    let closingPrincipal = LOAN_PARAMETERS.principalAmount;
    const normalizedPeriodicRate = LOAN_PARAMETERS.periodicRate / 100;

    // Generate due dates for each scheduled installment.
    for (
        let installmentNumber = 1;
        installmentNumber <= LOAN_PARAMETERS.numberOfInstallments;
        installmentNumber++
    ) {
        // Principal Engine
        openingPrincipal = (installmentNumber === 1) ? openingPrincipal : closingPrincipal;
        
        // Rounded Interest for reducing-emi
        const unroundedInterest = openingPrincipal * normalizedPeriodicRate;
        const roundedInterest = roundValue(
            unroundedInterest,
            LOAN_PARAMETERS.roundingRule,
            LOAN_PARAMETERS.roundingDecimalPlaces
        );

        const scheduledPrincipal = calculateScheduledPrincipal(
            LOAN_PARAMETERS.repaymentMethod,
            LOAN_PARAMETERS.principalAmount,
            LOAN_PARAMETERS.numberOfInstallments,
            emiAmount,
            roundedInterest
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