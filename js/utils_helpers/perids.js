/**
 * periods.js
 * -----------------------------------------------------------------
 * Conversion factors used to calculate the number of installments
 * for a given tenure and payment frequency.
 *
 * The top-level keys (days, weeks, months, years) represent the
 * tenure unit. The nested keys (daily, weekly, biweekly, monthly,
 * quarterly) represent the payment frequency.
 *
 * Each value converts the tenure into the equivalent number of
 * payment periods.
 *
 * Examples:
 *   30 days × monthly (1 / 30) = 1 monthly installment
 *   12 months × quarterly (1 / 3) = 4 quarterly installments
 *   2 years × monthly (12) = 24 monthly installments
 *
 * Note:
 * Month and quarter conversions use approximate durations:
 *   1 month     ≈ 30 days
 *   1 quarter   ≈ 90 days
 *   1 year      = 365 days
 *   1 year      = 52 weeks
 */
export const periods = {
    days: {
        daily: 1, // 1 daily payment period per day
        weekly: 1 / 7, // 1 weekly payment period every 7 days
        biweekly: 1 / 14, // 1 biweekly payment period every 14 days
        monthly: 1 / 30, // 1 monthly payment period every 30 days
        quarterly: 1 / 90 // 1 quarterly payment period every 90 days
    },

    weeks: {
        daily: 7, // 7 daily payment periods per week
        weekly: 1, // 1 weekly payment period per week
        biweekly: 1 / 2, // 1 biweekly payment period every 2 weeks
        monthly: 12 / 52, // Approximately 1 monthly period per 4.33 weeks
        quarterly: 4 / 52 // Approximately 1 quarterly period per 13 weeks
    },

    months: {
        daily: 30, // Approximately 30 daily payment periods per month
        weekly: 52 / 12, // Approximately 4.33 weekly payment periods per month
        biweekly: 26 / 12, // Approximately 2.17 biweekly payment periods per month
        monthly: 1, // 1 monthly payment period per month
        quarterly: 1 / 3 // 1 quarterly payment period every 3 months
    },

    years: {
        daily: 365, // 365 daily payment periods per year
        weekly: 52, // 52 weekly payment periods per year
        biweekly: 26, // 26 biweekly payment periods per year
        monthly: 12, // 12 monthly payment periods per year
        quarterly: 4 // 4 quarterly payment periods per year
    }
};
