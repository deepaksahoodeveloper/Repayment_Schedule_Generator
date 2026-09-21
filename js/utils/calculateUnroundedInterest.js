import { Logger } from "../utils_helpers/logger.js";

export function calculateUnroundedInterest(
    methodology,
    totalFlatInterest,
    installmentCount,
    openingPrincipal,
    periodicRate,
    annualRate,
    daysInPeriod,
    dayCountDenominator) {
    // A zero denominator would result in an invalid day-based
    // interest calculation. Fail explicitly rather than returning
    // Infinity or NaN.
    if (dayCountDenominator === 0) {
        throw new RangeError("dayCountDenominator must be greater than zero.");
    }

    switch (methodology) {
        case "flat-interest":
            // Flat interest is independent of the outstanding principal.
            // The total flat interest is distributed equally across
            // all installments without rounding at this stage.
            return totalFlatInterest / installmentCount;

        case "reducing-emi":
            // For EMI schedules, interest is calculated on the opening
            // principal balance using the rate applicable to the period.
            // Rounding should be handled by the caller, if required.
            return openingPrincipal * periodicRate;

        case "reducing-balance":
            // For equal-principal schedules, interest is calculated on
            // the opening principal using a day-based annualized rate.
            //
            // Formula:
            // Interest = Opening Principal × Annual Rate
            //            × Days in Period / Day-Count Denominator
            return (
                openingPrincipal *
                annualRate *
                daysInPeriod /
                dayCountDenominator
            );

        default:
            // An unsupported methodology indicates a configuration or
            // data issue. Return NaN to preserve the existing contract
            // and avoid silently applying an unintended calculation rule.
            return "default";
    }
}