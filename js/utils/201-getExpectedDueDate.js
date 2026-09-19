/**
 * Calculates the expected due date for a specific installment
 * based on the repayment frequency and first repayment date.
 *
 * @param {string} frequency - Repayment frequency
 *   Supported values: Monthly, Quarterly, Weekly, Bi-weekly, Daily
 * @param {string|Date} firstRepaymentDate - Date of the first repayment
 * @param {number} installmentNumber - Installment number (1-based)
 * @returns {Date|null} Expected due date, or null if the frequency is invalid
 */
function getExpectedDueDate(frequency, firstRepaymentDate, installmentNumber) {
    // Convert the first repayment date into a JavaScript Date object.
    const date = new Date(firstRepaymentDate);

    // Subtract 1 because installment #1 is due on the first repayment date.
    // Example: installment 1 = 0 months/weeks/days added,
    // installment 2 = 1 period added, etc.
    const n = installmentNumber - 1;

    switch (frequency) {
        // Monthly repayment:
        // Add one month for each subsequent installment.
        case "Monthly":
            date.setMonth(date.getMonth() + n);
            break;

        // Quarterly repayment:
        // Add 3 months for each subsequent installment.
        case "Quarterly":
            date.setMonth(date.getMonth() + n * 3);
            break;

        // Weekly repayment:
        // Add 7 days for each subsequent installment.
        case "Weekly":
            date.setDate(date.getDate() + n * 7);
            break;

        // Bi-weekly repayment:
        // Add 14 days for each subsequent installment.
        case "Bi-weekly":
            date.setDate(date.getDate() + n * 14);
            break;

        // Daily repayment:
        // Add 1 day for each subsequent installment.
        case "Daily":
            date.setDate(date.getDate() + n);
            break;

        // Return null for an unsupported or invalid frequency.
        // This is similar to returning #N/A in Excel.
        default:
            return null;
    }

    // Return the calculated expected due date.
    return date;
}
