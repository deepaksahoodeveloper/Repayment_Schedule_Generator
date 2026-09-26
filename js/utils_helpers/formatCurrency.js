/**
 * Formats a number as INR currency, e.g. 100000 -> "₹100,000.00".
 * @param {string|number} rawValue
 * @param {{ fallbackToZero?: boolean }} [options] - when true,
 *   an empty/missing value renders as "₹0.00" instead of "—".
 *   Use this for optional amount fields (Service Fee, Other
 *   Charges) that are meant to default to zero, not "not entered".
 */
function formatCurrency(rawValue, options = {}) {
    const number = Number(rawValue);
 
    if (rawValue === undefined || rawValue === null || rawValue === "" || Number.isNaN(number)) {
        return options.fallbackToZero ? "₹0.00" : "";
    }
 
    return "₹" + number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
 