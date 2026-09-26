
/**
 * generateInterestAmounts.js
 * --------------------------------------------------
 * Generates interest amounts for each loan installment.
 *
 * Responsibilities:
 * 1. Read the required loan parameters.
 * 2. Retrieve installment-specific dates and opening principal.
 * 3. Calculate unrounded interest using the configured
 *    repayment method.
 * 4. Apply the configured rounding rule.
 * 5. Calculate cumulative rounded interest.
 * 6. Return the interest details for each installment.
 *
 * Note:
 * This function assumes that the input arrays contain
 * valid data for all scheduled installments.
 */


import { Logger } from "../utils_helpers/logger.js";
import { calculateUnroundedInterest } from "./calculateUnroundedInterest.js";
import { roundValue } from "../utils_helpers/rounding.js";


/**
 * Generates installment-wise interest amounts.
 *
 * @param {Object} LOAN_PARAMETERS
 *        Loan configuration containing installment count,
 *        interest rate, repayment method, and rounding rules.
 *
 * @param {Array<Object>} installmentDates
 *        Scheduled installment dates, including the number
 *        of days from the previous installment.
 *
 * @param {Array<Object>} principalAmounts
 *        Principal calculation results for each installment,
 *        including the opening principal balance.
 *
 * @param {number} totalFlatInterest
 *        Total interest calculated for the loan when using
 *        the flat interest method.
 *
 * @returns {Array<Object>}
 *          An array containing the calculated interest
 *          details for each installment.
 */
export function generateInterestAmounts(
    LOAN_PARAMETERS,
    installmentDates,
    principalAmounts,
    totalFlatInterest
) {

    // Stores the interest calculation results for all installments.
    const interestAmounts = [];

    // Tracks the cumulative rounded interest across installments.
    let cumulativeInterest = 0;


    // --------------------------------------------------
    // STEP 1: Extract loan-level parameters
    // --------------------------------------------------
    // These values remain constant throughout the calculation.
    // Reading them once avoids repeatedly accessing the
    // LOAN_PARAMETERS object inside the loop.

    const numberOfInstallments =
        LOAN_PARAMETERS.numberOfInstallments;

    const annualInterestRate =
        LOAN_PARAMETERS.annualInterestRate;

    const dayCountDenominator =
        LOAN_PARAMETERS.dayCountDenominator;

    const periodicRate =
        LOAN_PARAMETERS.periodicRate;

    const repaymentMethod =
        LOAN_PARAMETERS.repaymentMethod;

    const roundingRule =
        LOAN_PARAMETERS.roundingRule;

    const roundingDecimalPlaces =
        LOAN_PARAMETERS.roundingDecimalPlaces;


    // --------------------------------------------------
    // STEP 2: Process each scheduled installment
    // --------------------------------------------------
    // Each iteration calculates and stores the interest
    // for one installment.

    for (
        let installmentNumber = 1;
        installmentNumber <= numberOfInstallments;
        installmentNumber++
    ) {

        // Convert the installment number (1-based) into
        // the corresponding array index (0-based).
        const index = installmentNumber - 1;


        // --------------------------------------------------
        // STEP 2.1: Retrieve installment-specific values
        // --------------------------------------------------

        // Number of days between the previous installment
        // date and the current installment due date.
        const daysFromPrevious =
            installmentDates[index].daysFromPrevious;

        // Outstanding principal balance at the beginning
        // of the current installment period.
        const openingPrincipal =
            principalAmounts[index].openingPrincipal;


        // --------------------------------------------------
        // STEP 2.2: Calculate unrounded interest
        // --------------------------------------------------
        // Delegates the interest calculation to the
        // dedicated calculation function.
        //
        // The repayment method determines how interest
        // is calculated for the installment.

        const unroundedInterest = calculateUnroundedInterest(
            repaymentMethod,
            totalFlatInterest,
            numberOfInstallments,
            openingPrincipal,
            periodicRate,
            annualInterestRate,
            daysFromPrevious,
            dayCountDenominator
        );


        // --------------------------------------------------
        // STEP 2.3: Apply the configured rounding rule
        // --------------------------------------------------
        // Rounds the calculated interest according to
        // the loan's rounding configuration.

        const roundedInterest = roundValue(
            unroundedInterest,
            roundingRule,
            roundingDecimalPlaces
        );


        // --------------------------------------------------
        // STEP 2.4: Update cumulative interest
        // --------------------------------------------------
        // Accumulates the rounded interest amount.
        // This ensures the cumulative value reflects
        // the actual installment interest amounts stored.

        cumulativeInterest += roundedInterest;


        // --------------------------------------------------
        // STEP 2.5: Store installment interest results
        // --------------------------------------------------
        // Stores the calculation inputs and outputs
        // required for the repayment schedule.

        interestAmounts.push({

            installmentNumber,

            openingPrincipal,

            annualInterestRate,

            daysFromPrevious,

            dayCountDenominator,

            periodicRate,

            repaymentMethod,

            unroundedInterest,

            roundedInterest,

            cumulativeInterest

        });

    }


    // --------------------------------------------------
    // STEP 3: Return the completed interest results
    // --------------------------------------------------
    // Returns one result object per scheduled installment.
    Logger.info("104-interest-engine.js","generateInterestAmounts", interestAmounts);
    return interestAmounts;

}