// dropdown-options.js

export const CURRENCY_OPTIONS = [
    { value: "INR", label: "INR - Indian Rupee"}
];

export const TENURE_UNIT_OPTIONS = [
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks"},
    { value: "months", label: "Months"},
    { value: "years", label: "Years" }
];

export const REPAYMENT_FREQUENCY_OPTIONS = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" }
];

export const REPAYMENT_METHOD_OPTIONS = [
    { value: "flat-interest", label: "Flat Interest - Equal Installment" },
    { value: "reducing-emi", label: "Reducing Balance - EMI (Equal Installment)" },
    { value: "reducing-balance", label: "Reducing Balance - Equal Principal" }
];

export const DAY_COUNT_CONVENTION_OPTIONS = [
    { value: "actual365", label: "Actual/365" },
    { value: "actual360", label: "Actual/360" },
    { value: "30_360", label: "30/360" }
];

export const FEE_APPLICATION_TIMING_OPTIONS = [
    { value: "upfront", label: "Upfront at Disbursement" },
    { value: "first-installment", label: "Added to First Installment" },
    { value: "spread", label: "Spread Equally Across Installments" }
];

export const FEE_TYPE_OPTIONS = [
    { value: "percentage", label: "% of Principal" },
    { value: "flat", label: "Flat Amount" }
];

export const TAX_OPTIONS = [
    { value: "no", label: "No" },
    { value: "yes", label: "Yes" }
];

export const ROUNDING_DECIMAL_OPTIONS = [
    { value: "-2", label: "Nearest ₹100" },
    { value: "-1", label: "Nearest ₹10" },
    { value: "0", label: "Nearest ₹1" },
    { value: "1", label: "Nearest ₹0.1" },
    { value: "2", label: "Nearest ₹0.01" }
];

export const ROUNDING_RULE_OPTIONS = [
    { value: "nearest", label: "Nearest - Closest amount" },
    { value: "up", label: "Round Up - Higher amount" },
    { value: "down", label: "Round Down - Lower amount" }
];

export const WEEKEND_HOLIDAY_HANDLING_OPTIONS = [
    { value: "0", label: "No Adjustment" },
    { value: "1", label: "Move to Next Business Day" },
    { value: "-1", label: "Move to Previous Business Day" }
];
