/**
 * script.js
 * -----------------------------------------------------------------
 * Behaviour for the "Loan Details" form:
 *   - Auto-calculates the number of installments from tenure + frequency.
 *   - Swaps help text (and validation limits) for the fee fields based
 *     on whether they're a percentage or a flat amount.
 *   - Enables/disables the tax rate field based on the "Apply Tax" choice.
 *   - Validates that the first repayment date isn't before disbursement.
 *   - On submit, saves the form data to localStorage and moves to the
 *     results page.
 */

import { calculateNumberOfInstallments } from "../utils/calculateNumberOfInstallments.js";
import { formDataToObject } from "../utils_helpers/formDataToObject.js"

// Where to send the user when submit the form
const OUTPUT_PAGE_URL = "./100-custom-loan-output.html";
const LOAN_DATA = "LOAN_DATA"

document.addEventListener("DOMContentLoaded", initLoanForm);

function initLoanForm() {
    const form = document.getElementById("loanForm");

    // 1 LOAN & BORROWER
    const borrowerName = document.getElementById("borrowerName");
    const borrowerId = document.getElementById("borrowerId");
    const loanId = document.getElementById("loanId");
    const productName = document.getElementById("productName");

    // 2 LOAN AMOUNT & DATES
    const principalAmount = document.getElementById("principalAmount");
    const currency = document.getElementById("currency"); // value: "INR"
    const disbursementDate = document.getElementById("disbursementDate");
    const firstRepaymentDate = document.getElementById("firstRepaymentDate");

    // 3. REPAYMENT
    const tenureUnit = document.getElementById("tenureUnit"); // Value: "days", "weeks", "months", or "years"
    const tenureValue = document.getElementById("tenureValue");
    const repaymentFrequency = document.getElementById("repaymentFrequency"); // Value: "daily", "weekly", "biweekly", "monthly", or "Quarterly" 
    const numberOfInstallments = document.getElementById("numberOfInstallments");
    const repaymentMethod = document.getElementById("repaymentMethod"); // Value: "flat-interest", reducing-emi, reducing-balance

    // 4. INTEREST
    const annualInterestRate = document.getElementById("annualInterestRate");
    const dayCountConvention = document.getElementById("dayCountConvention"); // Value: "actual365", "actual360", or "30_360"

    // 5. FEES & CHARGES
    const feeApplicationTiming = document.getElementById("feeApplicationTiming"); // Value: "upfront", "first-installment", or "spread"
    const processingFeeType = document.getElementById("processingFeeType"); // Value: "percentage" or "flat"
    const processingFeeValue = document.getElementById("processingFeeValue");
    const processingFeeHelp = document.getElementById("processingFeeHelp");
    const insuranceFeeType = document.getElementById("insuranceFeeType"); // Value: "percentage" or "flat"
    const insuranceFeeValue = document.getElementById("insuranceFeeValue");
    const insuranceFeeHelp = document.getElementById("insuranceFeeHelp");
    const serviceFee = document.getElementById("serviceFee");
    const otherCharges = document.getElementById("otherCharges");
    const applyTax = document.getElementById("applyTax"); // Value: "yes" or "no"
    const taxRate = document.getElementById("taxRate");

    // 6. ADVANCED SETTINGS
    const roundingDecimalPlaces = document.getElementById("roundingDecimalPlaces"); // Value: "2", "1", "0", "-1", or "-2"
    const roundingRule = document.getElementById("roundingRule"); // Value: "nearest", "up", or "down"
    const weekendHolidayHandling = document.getElementById("weekendHolidayHandling") // Value: "0", "-1", or "1"


    // 3. REPAYMENT - Update Number Of Installments
    // Updates the number of installments based on the selected tenure unit,
    // tenure value, and repayment frequency.
    function updateNumberOfInstallments() {
        const unit = tenureUnit.value; // "days", "weeks", "months", or "years"
        const value = Number(tenureValue.value); // Convert the input value to a number
        const frequency = repaymentFrequency.value; // "daily", "weekly", "monthly", or "quarterly"

        numberOfInstallments.value = calculateNumberOfInstallments(unit, value, frequency);
    }

    // Listen for changes to the tenure and repayment inputs and update
    // the number of installments accordingly.
    tenureUnit.addEventListener("change", updateNumberOfInstallments);
    tenureValue.addEventListener("input", updateNumberOfInstallments);
    repaymentFrequency.addEventListener("change", updateNumberOfInstallments);


    // 5. FEES & CHARGES - processingFeeHelp
    function updateProcessingFee() {
        if (processingFeeType.value === "percentage") {
            processingFeeValue.placeholder = "Enter percentage";
            processingFeeValue.max = "100";
            processingFeeHelp.textContent = "Enter the processing fee as a percentage of the principal.";
        } else if (processingFeeType.value === "flat") {
            processingFeeValue.placeholder = "Enter amount";
            processingFeeValue.removeAttribute("max");
            processingFeeHelp.textContent = "Enter the processing fee as a flat INR amount.";
        } else {
            processingFeeValue.placeholder = "Enter processing fee";
            processingFeeValue.removeAttribute("max");
            processingFeeHelp.textContent = "Select a fee type to determine how the fee is calculated.";
        }
    }

    // Listen for changes to the insuranceFeeType and update
    // the processingFeeHelp of installments accordingly.
    processingFeeType.addEventListener("change", updateProcessingFee);

    // 5. FEES & CHARGES - insuranceFeeHelp
    function updateInsuranceFee() {
        if (insuranceFeeType.value === "percentage") {
            insuranceFeeValue.placeholder = "Enter percentage";
            insuranceFeeValue.max = "100";
            insuranceFeeHelp.textContent = "Enter the insurance fee as a percentage of the principal.";
        } else if (insuranceFeeType.value === "flat") {
            insuranceFeeValue.placeholder = "Enter amount";
            insuranceFeeValue.removeAttribute("max");
            insuranceFeeHelp.textContent = "Enter the insurance fee as a flat INR amount.";
        } else {
            insuranceFeeValue.placeholder = "Enter amount";
            insuranceFeeValue.removeAttribute("max");
            insuranceFeeHelp.textContent = "Select a fee type to determine how the fee is calculated.";
        }
    }

    // Listen for changes to the insuranceFeeType and update
    // the processingFeeHelp of installments accordingly.
    insuranceFeeType.addEventListener("change", updateInsuranceFee);

    // 5. FEES & CHARGES - applyTax and taxRate
    function updateTaxField() {
        if (applyTax.value === "yes") {
            taxRate.disabled = false;
            taxRate.required = true;
            taxRate.placeholder = "Enter tax rate";
        } else {
            taxRate.disabled = true;
            taxRate.required = false;
            taxRate.value = "";
            taxRate.placeholder = "Tax disabled";
        }
    }

    // Listen for changes to the applyTax and update
    // the taxRate accordingly.
    applyTax.addEventListener("change", updateTaxField);

    // 2 LOAN AMOUNT & DATES - disbursementDate Vs firstRepaymentDate
    function validateRepaymentDate() {
        if (disbursementDate.value && firstRepaymentDate.value) {
            if (firstRepaymentDate.value < disbursementDate.value) {
                firstRepaymentDate.setCustomValidity(
                    "First repayment date must be on or after the disbursement date."
                );
            } else {
                firstRepaymentDate.setCustomValidity("");
            }
        } else {
            firstRepaymentDate.setCustomValidity("");
        }
    }

    // Listen for changes to the disbursementDate, firstRepaymentDate 
    // and update the setCustomValidity accordingly.
    disbursementDate.addEventListener("change", validateRepaymentDate);
    firstRepaymentDate.addEventListener("change", validateRepaymentDate);

    // ACTION RESET
    form.addEventListener("reset", function () {
        setTimeout(function () {
            updateProcessingFee();
            updateInsuranceFee();
            updateTaxField();

            firstRepaymentDate.setCustomValidity("");
        }, 0);
    });

    // ACTION FORM SUBMIT
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        validateRepaymentDate();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Collect form values. This object can later be sent to
        // backend/API.
        const loanData = formDataToObject(new FormData(form));

        // Save data so the next HTML page can read it.
        localStorage.setItem(LOAN_DATA, JSON.stringify(loanData));

        // Go to the next page.
        window.location.href = OUTPUT_PAGE_URL;
    });

    // INITIAL STATE
    updateProcessingFee();
    updateInsuranceFee();
    updateTaxField();
}