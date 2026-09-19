/**
 * 101-loan-Parameters.js
 * --------------------------------------------------
 * Prepares loan data for use throughout the application.
 *
 * Responsibilities:
 * 1. Check raw loan data recived
 * 2. Parse and convert values into the required data types
 * 3. Calculate derived loan parameters
 * 4. Create the final LOAN_PARAMETERS object
 * 5. Return LOAN_PARAMETERS for use by other JS modules
 *
 * This file prepares the data only. Business calculations such as
 * interest, installments, and repayment schedules are handled by
 * separate modules.
 */

// Import the Logger utility for consistent logging.
import { Logger } from "../utils_helpers/logger.js";

// Reads, validates and prepares all loan parameters.
export function prepareLoanParameters(loanData) {

    // 1. BORROWER DETAILS
    const borrowerName = loanData.borrowerName;
    const borrowerId = loanData.borrowerId;
    const loanId = loanData.loanId;
    const productName = loanData.productName;
    Logger.info("101-loan-Parameters.js","prepareLoanParameters", "1. BORROWER DETAILS INITIALIZED");

    // 2. LOAN AMOUNT & DATES
    const principalAmount = Number(loanData.principalAmount);
    const currency = loanData.currency;
    const disbursementDate = loanData.disbursementDate;
    const firstRepaymentDate = loanData.firstRepaymentDate;
    Logger.info("101-loan-Parameters.js", "prepareLoanParameters", "2. LOAN AMOUNT AND DATES INITIALIZED");

    // 3. REPAYMENT
    const tenureUnit = loanData.tenureUnit;
    const tenureValue = Number(loanData.tenureValue);
    const repaymentFrequency = loanData.repaymentFrequency;
    const numberOfInstallments = Number(loanData.numberOfInstallments);
    const repaymentMethod = loanData.repaymentMethod;
    // Calculated value
    const lookupFrequencies = {daily: 365, weekly: 52, biweekly: 26, monthly: 12, quarterly: 4 };
    const periodsPerYear = lookupFrequencies[repaymentFrequency] || 0;
    // Prevent invalid frequency from causing division by zero.
    if (!periodsPerYear) {
        Logger.error("101-loan-Parameters.js","prepareLoanParameters", "Invalid repayment frequency.", repaymentFrequency);
        return null;
    }
    Logger.info("101-loan-Parameters.js", "prepareLoanParameters", "3. REPAYMENT PARAMETERS INITIALIZED");

    // 4. INTEREST
    const annualInterestRate = Number(loanData.annualInterestRate);
    const dayCountConvention = loanData.dayCountConvention;
    // Calculated value
    const periodicRate = annualInterestRate / periodsPerYear;
    const lookupDayCountDenominators = {actual365: 365, actual360: 360, "30_360": 360 };
    const dayCountDenominator = lookupDayCountDenominators[dayCountConvention] || 0;
    Logger.info("101-loan-Parameters.js", "prepareLoanParameters", "4. INTEREST PARAMETERS INITIALIZED");


    // 5. FEES & CHARGES
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
    Logger.info("101-loan-Parameters.js", "prepareLoanParameters", "5. FEES AND CHARGES INITIALIZED");

    // 6. TAX / GST
    const applyTax = loanData.applyTax;
    const taxRate = Number(loanData.taxRate) || 0;
    const taxAmount =
        applyTax === "yes"
            ? (taxRate / 100) * totalFeesAndCharges
            : 0;
    Logger.info("101-loan-Parameters.js", "prepareLoanParameters", "6. TAX / GST INITIALIZED");

    // 7. ADVANCED SETTINGS
    const roundingDecimalPlaces = Number(loanData.roundingDecimalPlaces);
    const roundingRule = loanData.roundingRule;
    const weekendHolidayHandling = Number(loanData.weekendHolidayHandling);
    const holidayList = loanData.holidayList || []; // Default to empty array if not provided.
    Logger.info("101-loan-Parameters.js", "prepareLoanParameters", "7. ADVANCED SETTINGS INITIALIZED");

    // 8. CREATE FINAL LOAN PARAMETERS
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
        weekendHolidayHandling,
        holidayList

    };
    Logger.info("101-loan-Parameters.js", "prepareLoanParameters", "8. FINAL LOAN PARAMETERS CREATED", LOAN_PARAMETERS);

    // 11. RETURN FINAL OBJECT
    return LOAN_PARAMETERS;
}