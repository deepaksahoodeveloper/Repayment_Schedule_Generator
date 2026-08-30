const form = document.getElementById("loanForm");

const disbursementDate =
    document.getElementById("disbursementDate");

const firstRepaymentDate =
    document.getElementById("firstRepaymentDate");


// Ensure first repayment date is not before disbursement date
disbursementDate.addEventListener("change", function () {

    firstRepaymentDate.min = this.value;

    if (
        firstRepaymentDate.value &&
        firstRepaymentDate.value < this.value
    ) {
        firstRepaymentDate.value = this.value;
    }
});


// Set initial minimum date
if (disbursementDate.value) {
    firstRepaymentDate.min = disbursementDate.value;
}


// Form submission
form.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);

    const loanData = Object.fromEntries(formData.entries());

    console.log("Loan Data:", loanData);

    alert("Wait for the V1.0 release to generate the repayment schedule. ETA 15 September 2026. Thank you for your patience!");
});
