/**
 * Retrieves and parses loan data stored in localStorage.
 *
 * The function safely handles two failure scenarios:
 * 1. No data exists for the provided storage key.
 * 2. The stored value exists but is not valid JSON.
 *
 * @param {string} RAW_DATA_KEY
 *   The localStorage key used to retrieve the persisted loan data.
 *
 * @returns {Object|null}
 *   The parsed loan data when available and valid;
 *   otherwise, returns null.
 *
 * @example
 * const loanData = getLoanData("loanData");
 *
 * if (loanData) {
 *     // Use loan data
 * }
 */
export function getLoanData(RAW_DATA_KEY) {
    const raw = localStorage.getItem(RAW_DATA_KEY);

    // No data found for the requested key.
    if (!raw) {
        console.warn("getLoanData.js: no loan data found in localStorage.");
        return null;
    }

    try {
        // Parse the persisted JSON string into a JavaScript object.
        return JSON.parse(raw);
    } catch (error) {
        // Handle corrupted or manually modified localStorage data gracefully.
        console.error(
            "getLoanData.js: stored loan data is not valid JSON.",
            error
        );
        return null;
    }
}
