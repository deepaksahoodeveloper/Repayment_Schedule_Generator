/**
 * Reads and parses the loan data saved by index.html.
 * @returns {Object|null} the parsed loan data, or null if it's
 *                         missing or corrupted.
 */

export function getLoanData(RAW_DATA_KEY) {
    const raw = localStorage.getItem(RAW_DATA_KEY);
 
    if (!raw) {
        console.warn("getLoanData.js: no loan data found in localStorage.");
        return null;
    }
 
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error("getLoanData.js: stored loan data is not valid JSON.", error);
        return null;
    }
}