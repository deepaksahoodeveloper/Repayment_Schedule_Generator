
/**
 * File: 102-installment-dates.js
 * --------------------------------------------------
 * Purpose:
 * Generate repayment due dates for all loan installments.
 *
 * Responsibilities:
 * 1. Generate the unadjusted expected due date.
 * 2. Adjust the due date based on weekend/holiday rules.
 * 3. Return the installment dates in a structured format.
 *
 * Dependencies:
 * - getExpectedDueDate()
 * - getFinalAdjustedDueDate()
 *
 * Input:
 * - LOAN_PARAMETERS: Object containing loan repayment
 *   configuration, including installment count, frequency,
 *   first repayment date, and holiday handling rules.
 *
 * Output:
 * - Array of installment date objects.
 */
import { Logger } from "../utils_helpers/logger.js";
import { calculateExpectedDueDate } from "./calculateExpectedDueDate.js";
import { calculateFinalAdjustedDueDate } from "./calculateFinalAdjustedDueDate.js";
import { isBusinessDay } from "./isBusinessDay.js";
import { getDateDifference } from "../utils_helpers/dateDifference.js" 

export function generateInstallmentDates(LOAN_PARAMETERS) {

    const installmentDates = [];
    let previousDueDate = new Date(LOAN_PARAMETERS.disbursementDate);
    let expectedDueDateUnadjusted = new Date(LOAN_PARAMETERS.disbursementDate);
    let finalDueDateAdjusted = new Date(LOAN_PARAMETERS.disbursementDate);

    // Generate due dates for each scheduled installment.
    for (
        let installmentNumber = 1;
        installmentNumber <= LOAN_PARAMETERS.numberOfInstallments;
        installmentNumber++
    ) {
        previousDueDate = (installmentNumber === 1) ? previousDueDate : finalDueDateAdjusted;
        // Step 1: Calculate the expected due date before
        // applying any weekend or holiday adjustments.
        expectedDueDateUnadjusted = calculateExpectedDueDate(
            LOAN_PARAMETERS.repaymentFrequency,
            LOAN_PARAMETERS.firstRepaymentDate,
            installmentNumber
        );
        const weekend = isBusinessDay(expectedDueDateUnadjusted);
        const holiday = isBusinessDay(expectedDueDateUnadjusted, LOAN_PARAMETERS.holidayList);
        // Step 2: Adjust the expected due date according
        // to the configured weekend and holiday rules.
        finalDueDateAdjusted = calculateFinalAdjustedDueDate(
            expectedDueDateUnadjusted,
            LOAN_PARAMETERS.weekendHolidayHandling,
            LOAN_PARAMETERS.holidayList
        );
        const daysFromPrevious = getDateDifference(finalDueDateAdjusted, previousDueDate)
        const daysFromDisbursement = getDateDifference(finalDueDateAdjusted, LOAN_PARAMETERS.disbursementDate)

        // Step 3: Store the installment number and both
        // the original and adjusted repayment due dates.
        installmentDates.push({
            installmentNumber,
            previousDueDate,
            expectedDueDateUnadjusted,
            weekend,
            holiday,
            finalDueDateAdjusted,
            daysFromPrevious,
            daysFromDisbursement
        });
    }

    Logger.info("102-installment-dates.js","generateInstallmentDates", installmentDates);
    // Return the complete list of installment due dates.
    return installmentDates;
    
}
