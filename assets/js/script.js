document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loanForm");

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
       PROCESSING FEE
    ========================================== */

    function updateProcessingFee() {
        if (processingFeeType.value === "percentage") {
            processingFeeValue.placeholder = "Enter percentage";

            processingFeeHelp.textContent =
                "Enter the processing fee as a percentage of the principal.";
        } else if (processingFeeType.value === "flat") {
            processingFeeValue.placeholder = "Enter amount";

            processingFeeHelp.textContent =
                "Enter the processing fee as a flat INR amount.";
        } else {
            processingFeeValue.placeholder = "Enter processing fee";

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

            insuranceFeeHelp.textContent =
                "Enter the insurance fee as a percentage of the principal.";
        } else if (insuranceFeeType.value === "flat") {
            insuranceFeeValue.placeholder = "Enter amount";

            insuranceFeeHelp.textContent =
                "Enter the insurance fee as a flat INR amount.";
        } else {
            insuranceFeeValue.placeholder = "Enter amount";

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

        /*
         * Collect form values.
         * This object can later be sent to your backend/API.
         */

        const formData = new FormData(form);

        const loanData = Object.fromEntries(formData.entries());

        /*
         * Holiday weekdays are multiple values,
         * so collect them separately.
         */

        loanData.holidayWeekdays =
            formData.getAll("holidayWeekdays[]");

        console.log("Loan Data:", loanData);

        alert(
            "Loan details are valid and ready to create the repayment schedule."
        );
    });

    /* =========================================
       INITIAL STATE
    ========================================== */

    updateProcessingFee();
    updateInsuranceFee();
    updateTaxField();
});
