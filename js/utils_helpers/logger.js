/**
 * 901-Logger.js
 * -----------------------------------------------------------------
 * Small logging wrapper so every message from this file is
 * consistently tagged and easy to filter/grep in devtools.
 *
 * Usage: Logger.info("readLoanData", "No data found");
 */
export const Logger = {
    info(prefix, step, message, data) {
        console.log(`[${prefix}] [${step}]`, message, data ?? "");
    },

    warn(prefix, step, message, data) {
        console.warn(`[${prefix}] [${step}]`, message, data ?? "");
    },

    error(prefix, step, message, data) {
        console.error(`[${prefix}] [${step}]`, message, data ?? "");
    }
};
