/**
 * helper_params.js
 * --------------------------------------------------
 * Prepares loan data for use throughout the application.
 *
 * Responsibilities:
 * 1. Read raw loan data from localStorage
 * 2. Parse and convert values into the required data types
 * 3. Calculate derived loan parameters
 * 4. Create the final LOAN_PARAMETERS object
 * 5. Return LOAN_PARAMETERS for use by other JS modules
 *
 * This file prepares the data only. Business calculations such as
 * interest, installments, and repayment schedules are handled by
 * separate modules.
 */

/**
 * Small logging wrapper so every message from this file is
 * consistently tagged and easy to filter/grep in devtools.
 *
 * Usage: Logger.info("readLoanData", "No data found");
 */
const Logger = {
    _prefix: "[helper_params]",
 
    info(step, message, data) {
        console.log(`${this._prefix} [${step}]`, message, data ?? "");
    },
 
    warn(step, message, data) {
        console.warn(`${this._prefix} [${step}]`, message, data ?? "");
    },
 
    error(step, message, data) {
        console.error(`${this._prefix} [${step}]`, message, data ?? "");
    }
};


// Reads, validates and prepares all loan parameters.
function prepareLoanParameters() {

    // 1. READ SAVED LOAN DATA
    const rawData = localStorage.getItem("loanData");
    // No data found.
    if (!rawData) {
        Logger.warn("prepareLoanParameters", "No loan data found in localStorage.");
        return null;
    }
    Logger.info("prepareLoanParameters", "1. READ SAVED LOAN DATA SUCCESSFUL");

    // 2. PARSE JSON
    let loanData;
    try {
        loanData = JSON.parse(rawData);
        Logger.info("prepareLoanParameters", "2. PARSE JSON SUCCESSFUL", loanData);

    } catch (error) {
        Logger.error("prepareLoanParameters", "Loan data is not valid JSON.", error);
        return null;
    }

    // 3. BORROWER DETAILS
    const borrowerName = loanData.borrowerName;
    const borrowerId = loanData.borrowerId;
    const loanId = loanData.loanId;
    const productName = loanData.productName;
    Logger.info("prepareLoanParameters", "3. BORROWER DETAILS INITIALIZED");

    // 4. LOAN AMOUNT & DATES
    const principalAmount = Number(loanData.principalAmount);
    const currency = loanData.currency;
    const disbursementDate = loanData.disbursementDate;
    const firstRepaymentDate = loanData.firstRepaymentDate;
    Logger.info("prepareLoanParameters", "4. LOAN AMOUNT AND DATES INITIALIZED");

    // 5. REPAYMENT
    const tenureUnit = loanData.tenureUnit;
    const tenureValue = Number(loanData.tenureValue);
    const repaymentFrequency = loanData.repaymentFrequency;
    const numberOfInstallments = Number(loanData.numberOfInstallments);
    const repaymentMethod = loanData.repaymentMethod;
    // Calculated value
    const lookupFrequencies = {weekly: 52, biweekly: 26, monthly: 12, quarterly: 4 };
    const periodsPerYear = lookupFrequencies[repaymentFrequency] || 0;
    // Prevent invalid frequency from causing division by zero.
    if (!periodsPerYear) {
        Logger.error("prepareLoanParameters", "Invalid repayment frequency.", repaymentFrequency);
        return null;
    }
    Logger.info("prepareLoanParameters", "5. REPAYMENT PARAMETERS INITIALIZED");

    // 6. INTEREST
    const annualInterestRate = Number(loanData.annualInterestRate);
    const dayCountConvention = loanData.dayCountConvention;
    // Calculated value
    const periodicRate = annualInterestRate / periodsPerYear;
    const lookupDayCountDenominators = {actual365: 365, actual360: 360, "30_360": 360 };
    const dayCountDenominator = lookupDayCountDenominators[dayCountConvention] || 0;
    Logger.info("prepareLoanParameters", "6. INTEREST PARAMETERS INITIALIZED");


    // 7. FEES & CHARGES
    const feeApplicationTiming = loanData.feeApplicationTiming;
    const processingFeeType = loanData.processingFeeType;
    const processingFeeValue = Number(loanData.processingFeeValue);
    const insuranceFeeType = loanData.insuranceFeeType;
    const insuranceFeeValue = Number(loanData.insuranceFeeValue);
    const serviceFee = Number(loanData.serviceFee) || 0; // Default to 0 if not provided.
    const otherCharges = Number(loanData.otherCharges) || 0; // Default to 0 if not provided.
        // Calculate processing fee.
    const processingFeeAmount =
        processingFeeType === "percentage"
            ? (processingFeeValue / 100) * principalAmount
            : processingFeeValue;
        // Calculate insurance fee.
    const insuranceFeeAmount =
        insuranceFeeType === "percentage"
            ? (insuranceFeeValue / 100) * principalAmount
            : insuranceFeeValue;
        // Calculate total fees and charges.
    const totalFeesAndCharges =
        processingFeeAmount +
        insuranceFeeAmount +
        serviceFee +
        otherCharges;
    Logger.info("prepareLoanParameters", "7. FEES AND CHARGES INITIALIZED");

    // 8. TAX / GST
    const applyTax = loanData.applyTax;
    const taxRate = Number(loanData.taxRate) || 0;
    const taxAmount =
        applyTax === "yes"
            ? (taxRate / 100) * totalFeesAndCharges
            : 0;
    Logger.info("prepareLoanParameters", "8. TAX / GST INITIALIZED", { applyTax, taxRate, taxAmount });

    // 9. ADVANCED SETTINGS
    const roundingDecimalPlaces = Number(loanData.roundingDecimalPlaces);
    const roundingRule = loanData.roundingRule;
    const weekendHolidayHandling = loanData.weekendHolidayHandling;
    Logger.info("prepareLoanParameters", "9. ADVANCED SETTINGS INITIALIZED");

    // 10. CREATE FINAL LOAN PARAMETERS
    const LOAN_PARAMETERS = {

        // Borrower details
        borrowerName,
        borrowerId,
        loanId,
        productName,

        // Loan amount & dates
        principalAmount,
        currency,
        disbursementDate,
        firstRepaymentDate,

        // Repayment
        tenureUnit,
        tenureValue,
        repaymentFrequency,
        numberOfInstallments,
        repaymentMethod,
        periodsPerYear,

        // Interest
        annualInterestRate,
        dayCountConvention,
        periodicRate,
        dayCountDenominator,

        // Fees & charges
        feeApplicationTiming,
        processingFeeType,
        processingFeeValue,
        insuranceFeeType,
        insuranceFeeValue,
        serviceFee,
        otherCharges,
        processingFeeAmount,
        insuranceFeeAmount,
        totalFeesAndCharges,

        // Tax / GST
        applyTax,
        taxRate,
        taxAmount,

        // Advanced settings
        roundingDecimalPlaces,
        roundingRule,

        // Weekend / holiday handling
        weekendHolidayHandling
    };
    Logger.info("prepareLoanParameters", "10. FINAL LOAN PARAMETERS CREATED", LOAN_PARAMETERS);

    // 12. RETURN FINAL OBJECT
    return LOAN_PARAMETERS;
}