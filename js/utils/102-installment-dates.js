
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

export function generateInstallmentDates(LOAN_PARAMETERS) {

    const installmentDates = [];

    // Generate due dates for each scheduled installment.
    for (
        let installmentNumber = 1;
        installmentNumber <= LOAN_PARAMETERS.numberOfInstallments;
        installmentNumber++
    ) {
        // Step 1: Calculate the expected due date before
        // applying any weekend or holiday adjustments.
        const expectedDueDateUnadjusted = calculateExpectedDueDate(
            LOAN_PARAMETERS.repaymentFrequency,
            LOAN_PARAMETERS.firstRepaymentDate,
            installmentNumber
        );

        // Step 2: Adjust the expected due date according
        // to the configured weekend and holiday rules.
        const finalDueDateAdjusted = calculateFinalAdjustedDueDate(
            expectedDueDateUnadjusted,
            LOAN_PARAMETERS.weekendHolidayHandling,
            LOAN_PARAMETERS.holidayList
        );

        // Step 3: Store the installment number and both
        // the original and adjusted repayment due dates.
        installmentDates.push({
            installmentNumber,
            expectedDueDateUnadjusted,
            finalDueDateAdjusted,
        });
    }

    Logger.info("102-installment-dates.js","generateInstallmentDates", installmentDates);
    // Return the complete list of installment due dates.
    return installmentDates;
    
}
