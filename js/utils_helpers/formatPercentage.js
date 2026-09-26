/**
 * Formats a number as a percentage, e.g. 12 -> "12.00%".
 * @param {string|number} rawValue
 */
function formatPercentage(rawValue) {
    const number = Number(rawValue);
 
    if (rawValue === undefined || rawValue === null || rawValue === "" || Number.isNaN(number)) {
        return "";
    }
 
    return number.toFixed(2) + "%";
}
 