
/**
 * rounding.js
 * --------------------------------------------------
 * Reusable utility for rounding numeric values.
 *
 * Supported rounding rules:
 * 1. UP    - Round away from zero.
 * 2. DOWN  - Round towards zero.
 * 3. ROUND - Round to the nearest value.
 *
 * @param {number} value          - Value to be rounded.
 * @param {string} rule           - Rounding rule: UP, DOWN, NEAREST.
 * @param {number} decimalPlaces  - Number of decimal places.
 *
 * @returns {number} Rounded numeric value.
 *
 * @throws {TypeError} If the value is not a finite number.
 * @throws {TypeError} If the rule is invalid.
 * @throws {RangeError} If decimalPlaces is invalid.
 */
export function roundValue(value, rule = "NEAREST", decimalPlaces = 2) {

    // --------------------------------------------------
    // 1. Validate input value
    // --------------------------------------------------

    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new TypeError(
            "Value must be a finite number."
        );
    }

    // --------------------------------------------------
    // 2. Validate rounding rule
    // --------------------------------------------------

    const roundingRule = String(rule).toUpperCase();

    const validRules = ["UP", "DOWN", "NEAREST"];

    if (!validRules.includes(roundingRule)) {
        throw new TypeError(
            `Invalid rounding rule: ${rule}. ` +
            "Allowed rules are UP, DOWN, or NEAREST."
        );
    }

    // --------------------------------------------------
    // 3. Validate decimal places
    // --------------------------------------------------

    if (
        !Number.isInteger(decimalPlaces) ||
        decimalPlaces < -2 ||
        decimalPlaces > 2
    ) {
        throw new RangeError(
            "Decimal places must be an integer between -2 and 2."
        );
    }

    // --------------------------------------------------
    // 4. Handle zero
    // --------------------------------------------------

    if (value === 0) {
        return 0;
    }

    // --------------------------------------------------
    // 5. Calculate rounding factor
    // --------------------------------------------------

    const factor = 10 ** decimalPlaces;

    // Work with the absolute value so UP and DOWN
    // behave consistently for positive and negative numbers.
    const absoluteValue = Math.abs(value);

    // --------------------------------------------------
    // 6. Apply the selected rounding rule
    // --------------------------------------------------

    let roundedValue;

    switch (roundingRule) {

        case "UP":
            // Always round away from zero.
            roundedValue = Math.ceil(
                absoluteValue * factor
            );
            break;

        case "DOWN":
            // Always round towards zero.
            roundedValue = Math.floor(
                absoluteValue * factor
            );
            break;

        case "NEAREST":
            // Round to nearest; exact halves go away from zero.
            roundedValue = Math.round(
                absoluteValue * factor
            );
            break;
    }

    // --------------------------------------------------
    // 7. Restore decimal position and original sign
    // --------------------------------------------------

    const result = (roundedValue / factor) *
        Math.sign(value);

    // Return a numeric value, not a formatted string.
    return Object.is(result, -0) ? 0 : result;
}