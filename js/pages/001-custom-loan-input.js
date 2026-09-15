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

document.addEventListener("DOMContentLoaded", initLoanForm);

function initLoanForm() {
    const form = document.getElementById("loanForm");

    const tenureUnit = document.getElementById("tenureUnit");
    const tenureValue = document.getElementById("tenureValue");
    const repaymentFrequency = document.getElementById("repaymentFrequency");
    const numberOfInstallments = document.getElementById("numberOfInstallments");

    const processingFeeType = document.getElementById("processingFeeType");
    const processingFeeValue = document.getElementById("processingFeeValue");
    const processingFeeHelp = document.getElementById("processingFeeHelp");

    const insuranceFeeType = document.getElementById("insuranceFeeType");
    const insuranceFeeValue = document.getElementById("insuranceFeeValue");
    const insuranceFeeHelp = document.getElementById("insuranceFeeHelp");

    const applyTax = document.getElementById("applyTax");
    const taxRate = document.getElementById("taxRate");

    const disbursementDate = document.getElementById("disbursementDate");
    const firstRepaymentDate = document.getElementById("firstRepaymentDate");

    /* =========================================
        NUMBER OF INSTALLMENTS
       -----------------------------------------
       Each table entry is "installments per 1 unit of tenure" for a
       given frequency, based on averaged calendar lengths (30-day
       month, 90-day quarter). Because these are approximations, the
       raw result is frequently a fraction (e.g. a 30-day tenure paid
       weekly = 30 * (1/7) ≈ 4.29) — it's rounded to the nearest whole
       installment below, since you can't schedule a fractional one.
    ========================================= */

    function updateNumberOfInstallments() {

        const periods = {
            days: {
                weekly: 1 / 7,
                biweekly: 1 / 14,
                monthly: 1 / 30,
                quarterly: 1 / 90
            },

            weeks: {
                weekly: 1,
                biweekly: 1 / 2,
                monthly: 12 / 52,
                quarterly: 4 / 52
            },

            months: {
                weekly: 52 / 12,
                biweekly: 26 / 12,
                monthly: 1,
                quarterly: 1 / 3
            },

            years: {
                weekly: 52,
                biweekly: 26,
                monthly: 12,
                quarterly: 4
            }
        };

        const unit = tenureUnit.value;
        const value = Number(tenureValue.value);
        const frequency = repaymentFrequency.value;

        // If inputs are not complete, clear the result.
        if (!unit || !value || !frequency) {
            numberOfInstallments.value = "";
            return;
        }

        const rawInstallments = value * periods[unit][frequency];

        // FIX: round to a whole installment and never go below 1 —
        // the previous version stored the raw (often fractional)
        // result directly, e.g. "4.285714285714286".
        numberOfInstallments.value = Math.max(1, Math.round(rawInstallments));
    }

    tenureUnit.addEventListener("change", updateNumberOfInstallments);
    tenureValue.addEventListener("input", updateNumberOfInstallments);
    repaymentFrequency.addEventListener("change", updateNumberOfInstallments);

    /* =========================================
       PROCESSING FEE
    ========================================== */

    function updateProcessingFee() {
        if (processingFeeType.value === "percentage") {
            processingFeeValue.placeholder = "Enter percentage";
            processingFeeValue.max = "100";

            processingFeeHelp.textContent =
                "Enter the processing fee as a percentage of the principal.";
        } else if (processingFeeType.value === "flat") {
            processingFeeValue.placeholder = "Enter amount";
            processingFeeValue.removeAttribute("max");

            processingFeeHelp.textContent =
                "Enter the processing fee as a flat INR amount.";
        } else {
            processingFeeValue.placeholder = "Enter processing fee";
            processingFeeValue.removeAttribute("max");

            processingFeeHelp.textContent =
                "Select a fee type to determine how the fee is calculated.";
        }
    }

    processingFeeType.addEventListener("change", updateProcessingFee);

    /* =========================================
       INSURANCE FEE
    ========================================== */

    function updateInsuranceFee() {
        if (insuranceFeeType.value === "percentage") {
            insuranceFeeValue.placeholder = "Enter percentage";
            insuranceFeeValue.max = "100";

            insuranceFeeHelp.textContent =
                "Enter the insurance fee as a percentage of the principal.";
        } else if (insuranceFeeType.value === "flat") {
            insuranceFeeValue.placeholder = "Enter amount";
            insuranceFeeValue.removeAttribute("max");

            insuranceFeeHelp.textContent =
                "Enter the insurance fee as a flat INR amount.";
        } else {
            insuranceFeeValue.placeholder = "Enter amount";
            insuranceFeeValue.removeAttribute("max");

            insuranceFeeHelp.textContent =
                "Select a fee type to determine how the fee is calculated.";
        }
    }

    insuranceFeeType.addEventListener("change", updateInsuranceFee);

    /* =========================================
       TAX / GST
    ========================================== */

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

    applyTax.addEventListener("change", updateTaxField);

    /* =========================================
       DATE VALIDATION
    ========================================== */

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

    disbursementDate.addEventListener("change", validateRepaymentDate);
    firstRepaymentDate.addEventListener("change", validateRepaymentDate);

    /* =========================================
       RESET
       -----------------------------------------
       Checkbox/radio defaults (like the holiday weekday pills)
       are restored automatically by the browser's native reset
       behaviour, based on each checkbox's `checked` attribute in
       the HTML — no extra handling is needed for those here.
    ========================================== */

    form.addEventListener("reset", function () {
        setTimeout(function () {
            updateProcessingFee();
            updateInsuranceFee();
            updateTaxField();

            firstRepaymentDate.setCustomValidity("");
        }, 0);
    });

    /* =========================================
       FORM SUBMIT
    ========================================== */

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        validateRepaymentDate();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Collect form values. This object can later be sent to
        // your backend/API.
        const loanData = formDataToObject(new FormData(form));

        // Save data so the next HTML page can read it.
        localStorage.setItem("loanData", JSON.stringify(loanData));

        // Go to the next page.
        window.location.href = "./001-custom-loan-output.html";
    });

    /* =========================================
       INITIAL STATE
    ========================================== */

    updateProcessingFee();
    updateInsuranceFee();
    updateTaxField();
}

/**
 * Converts a FormData instance into a plain object.
 *
 * FIX: `Object.fromEntries(formData.entries())` — the previous
 * approach — silently keeps only the LAST value for any field name
 * that appears more than once. That's exactly what happens with a
 * group of same-named checkboxes (e.g. `holidayWeekdays`): checking
 * three weekday boxes would silently save just one of them. This
 * version detects repeated keys and collects them into an array
 * instead of dropping any of them, while leaving single-value fields
 * (text inputs, selects, etc.) as plain strings.
 *
 * @param {FormData} formData
 * @returns {Object<string, string | string[]>}
 */
function formDataToObject(formData) {
    const result = {};

    for (const [key, value] of formData.entries()) {
        if (!(key in result)) {
            result[key] = value;
        } else if (Array.isArray(result[key])) {
            result[key].push(value);
        } else {
            result[key] = [result[key], value];
        }
    }

    return result;
}