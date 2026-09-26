/**
 * Calculates the difference between two dates.
 * @param {Date|string|number} date1 - The start date.
 * @param {Date|string|number} date2 - The end date.
 * @param {string} [unit='days'] - The unit to return ('days', 'hours', 'minutes', 'seconds').
 * @returns {number} The absolute difference in the specified unit, or NaN if dates are invalid.
 */
export function getDateDifference(date1, date2, unit = 'days') {
    const d1 = new Date(date1).getTime();
    const d2 = new Date(date2).getTime();

    // Return NaN if either date is invalid
    if (isNaN(d1) || isNaN(d2)) {
        console.error("getDateDifference: One or both date inputs are invalid.", { date1, date2 });
        return NaN;
    }

    // Calculate difference in milliseconds
    const diffInMs = Math.abs(d2 - d1);

    // Convert to the requested unit
    switch (unit.toLowerCase()) {
        case 'seconds':
            return Math.round(diffInMs / 1000);
        case 'minutes':
            return Math.round(diffInMs / (1000 * 60));
        case 'hours':
            return Math.round(diffInMs / (1000 * 60 * 60));
        case 'days':
        default:
            return Math.round(diffInMs / (1000 * 60 * 60 * 24));
    }
}