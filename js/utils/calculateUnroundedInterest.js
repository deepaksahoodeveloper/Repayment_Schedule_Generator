/**
 * Supported repayment methodologies.
 *
 * Keeping these values in one place prevents typos and makes it easier
 * to add or remove repayment methodologies in the future.
 */
const REPAYMENT_METHODS = Object.freeze({
    FLAT_INTEREST: "FLAT-INTEREST",
    REDUCING_EMI: "REDUCING-EMI",
    REDUCING_BALANCE: "REDUCING-BALANCE",
});

/**
 * Calculates the unrounded interest amount for a repayment installment.
 *
 * IMPORTANT:
 * This function deliberately does NOT perform monetary rounding.
 * Rounding should be handled by the calling/scheduling layer so that
 * the calculation retains its full precision until the appropriate
 * point in the repayment schedule.
 *
 * Interest calculation rules:
 *
 * 1. FLAT-INTEREST
 *    Interest is distributed equally across all installments.
 *
 *    Interest per installment =
 *        Total Flat Interest / Number of Installments
 *
 * 2. REDUCING-EMI
 *    Interest is calculated on the opening principal using the
 *    periodic interest rate.
 *
 *    Interest =
 *        Opening Principal × Periodic Rate
 *
 * 3. REDUCING-BALANCE
 *    Interest is calculated on the opening principal using an
 *    annualized rate and the actual number of days in the period.
 *
 *    Interest =
 *        Opening Principal
 *        × Annual Interest Rate
 *        × Days in Period
 *        / Day Count Denominator
 *
 * @param {string} repaymentMethod
 * @param {number} totalFlatInterest
 * @param {number} numberOfInstallments
 * @param {number} openingPrincipal
 * @param {number} periodicRate - Periodic rate expressed as a percentage, e.g. 2.5 means 2.5%.
 * @param {number} annualInterestRate - Annual rate expressed as a percentage, e.g. 12 means 12%.
 * @param {number} daysFromPrevious - Number of days in the current interest period.
 * @param {number} dayCountDenominator - Day-count basis, e.g. 365 or 360.
 *
 * @returns {number} Unrounded interest amount.
 *
 * @throws {TypeError} If an input has an invalid type or value.
 */
export function calculateUnroundedInterest(
    repaymentMethod,
    totalFlatInterest,
    numberOfInstallments,
    openingPrincipal,
    periodicRate,
    annualInterestRate,
    daysFromPrevious,
    dayCountDenominator
) {
    // --------------------------------------------------
    // Step 1: Normalize and validate repayment method
    // --------------------------------------------------

    const normalizedRepaymentMethod = String(repaymentMethod)
        .trim()
        .toUpperCase();

    const validRepaymentMethods = Object.values(REPAYMENT_METHODS);

    if (!validRepaymentMethods.includes(normalizedRepaymentMethod)) {
        throw new TypeError(
            `Invalid repayment method: ${repaymentMethod}. ` +
            `Allowed methods are: ${validRepaymentMethods.join(", ")}.`
        );
    }

    // --------------------------------------------------
    // Step 2: Validate numeric inputs
    // --------------------------------------------------
    // Number.isFinite() is intentionally used instead of a simple
    // typeof check so that NaN, Infinity and -Infinity are rejected.

    if (!Number.isFinite(totalFlatInterest)) {
        throw new TypeError(
            "Total Flat Interest must be a finite number."
        );
    }

    if (!Number.isFinite(numberOfInstallments) || numberOfInstallments <= 0) {
        throw new TypeError(
            "Number Of Installments must be a finite number greater than zero."
        );
    }

    if (!Number.isFinite(openingPrincipal) || openingPrincipal < 0) {
        throw new TypeError(
            "Opening Principal must be a finite number greater than or equal to zero."
        );
    }

    if (!Number.isFinite(periodicRate) || periodicRate < 0) {
        throw new TypeError(
            "Periodic Rate must be a finite number greater than or equal to zero."
        );
    }

    if (!Number.isFinite(annualInterestRate) || annualInterestRate < 0) {
        throw new TypeError(
            "Annual Interest Rate must be a finite number greater than or equal to zero."
        );
    }

    if (!Number.isFinite(daysFromPrevious) || daysFromPrevious < 0) {
        throw new TypeError(
            "Days From Previous must be a finite number greater than or equal to zero."
        );
    }

    if (!Number.isFinite(dayCountDenominator) || dayCountDenominator <= 0) {
        throw new TypeError(
            "Day Count Denominator must be a finite number greater than zero."
        );
    }

    // --------------------------------------------------
    // Step 3: Normalize percentage rates
    // --------------------------------------------------
    // Input rates are expected as percentages:
    //   12    -> 12%
    //   2.5   -> 2.5%
    //
    // Mathematical calculations require decimal form:
    //   12    -> 0.12
    //   2.5   -> 0.025

    const normalizedPeriodicRate = periodicRate / 100;
    const normalizedAnnualRate = annualInterestRate / 100;

    // --------------------------------------------------
    // Step 4: Calculate unrounded interest
    // --------------------------------------------------

    switch (normalizedRepaymentMethod) {
        case REPAYMENT_METHODS.FLAT_INTEREST:
            /*
             * Flat-interest methodology:
             *
             * The interest does not depend on the outstanding
             * principal balance. The total flat interest is spread
             * equally across all installments.
             */
            return totalFlatInterest / numberOfInstallments;

        case REPAYMENT_METHODS.REDUCING_EMI:
            /*
             * Reducing-balance EMI methodology:
             *
             * Interest is calculated on the opening principal for
             * the current installment using the applicable periodic rate.
             *
             * Interest =
             *     Opening Principal × Periodic Rate
             */
            return openingPrincipal * normalizedPeriodicRate;

        case REPAYMENT_METHODS.REDUCING_BALANCE:
            /*
             * Equal-principal / reducing-balance methodology:
             *
             * Interest is calculated using the opening principal,
             * annual interest rate and the actual number of days
             * in the interest period.
             *
             * Interest =
             *     Opening Principal
             *     × Annual Rate
             *     × Days in Period
             *     / Day Count Denominator
             */
            return (
                openingPrincipal *
                normalizedAnnualRate *
                daysFromPrevious /
                dayCountDenominator
            );

        /*
         * This branch should technically be unreachable because the
         * repayment method was validated before entering the switch.
         *
         * Keeping an explicit default protects the function if a new
         * repayment method is added to REPAYMENT_METHODS but its
         * calculation is accidentally not implemented here.
         */
        default:
            throw new TypeError(
                `Unsupported repayment method: ${normalizedRepaymentMethod}.`
            );
    }
}