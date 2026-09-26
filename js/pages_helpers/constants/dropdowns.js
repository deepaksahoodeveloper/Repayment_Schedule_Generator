// dropdown-options.js

export const CURRENCY_OPTIONS = [
    { value: "INR", label: "Indian Rupee (INR)" }
];

export const TENURE_UNIT_OPTIONS = [
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" },
    { value: "years", label: "Years" }
];

export const REPAYMENT_FREQUENCY_OPTIONS = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Every 2 weeks" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Every 3 months" }
];

export const REPAYMENT_METHOD_OPTIONS = [
    {
        value: "flat-interest",
        label: "Flat Interest — Equal Payments"
    },
    {
        value: "reducing-emi",
        label: "Reducing Balance — Equal EMI"
    },
    {
        value: "reducing-balance",
        label: "Reducing Balance — Equal Principal"
    }
];

export const DAY_COUNT_CONVENTION_OPTIONS = [
    { value: "actual365", label: "Actual/365" },
    { value: "actual360", label: "Actual/360" },
    { value: "30_360", label: "30/360" }
];

export const FEE_APPLICATION_TIMING_OPTIONS = [
    {
        value: "upfront",
        label: "Deduct from Disbursement"
    },
    {
        value: "first-installment",
        label: "Add to First Payment"
    },
    {
        value: "spread",
        label: "Spread Across All Payments"
    }
];

export const FEE_TYPE_OPTIONS = [
    { value: "percentage", label: "Percentage of Principal" },
    { value: "flat", label: "Fixed Amount" }
];

export const TAX_OPTIONS = [
    { value: "no", label: "No Tax" },
    { value: "yes", label: "Apply Tax" }
];

export const ROUNDING_DECIMAL_OPTIONS = [
    { value: "-2", label: "Nearest ₹100" },
    { value: "-1", label: "Nearest ₹10" },
    { value: "0", label: "Nearest ₹1" },
    { value: "1", label: "Nearest ₹0.10" },
    { value: "2", label: "Nearest ₹0.01" }
];

export const ROUNDING_RULE_OPTIONS = [
    { value: "nearest", label: "Nearest — Round to closest" },
    { value: "up", label: "Round Up — Use higher amount" },
    { value: "down", label: "Round Down — Use lower amount" }
];

export const WEEKEND_HOLIDAY_HANDLING_OPTIONS = [
    { value: "0", label: "No Adjustment" },
    { value: "1", label: "Move to Next Business Day" },
    { value: "-1", label: "Move to Previous Business Day" }
];
