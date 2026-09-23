
/**
 * 100-custom-loan-output.js
 * -----------------------------------------------------------------
 * Page 2 (loan-card.html) has two jobs:
 *   1. Read the loan data the user submitted on Page 1 (index.html)
 *      out of localStorage and use it to fill in the 6 info cards.
 *   2. Let the user download the filled-in card as a PDF (unchanged
 *      from before).
 *
 * NOTE: the repayment schedule table is NOT populated by this file
 * yet — that's a separate follow-up once the amortization logic is
 * ready. Its rows are still the placeholder sample data in result.html.
 */
import { Logger } from "../utils_helpers/logger.js";
import { getDateDifference } from "../utils_helpers/dateDifference.js";
import { calculateSimpleInterest } from "../utils_helpers/calculateSimpleInterest.js";
import { calculateEMI } from "../utils_helpers/calculateEMI.js";
import { getLoanData } from "../utils_helpers/getLoanData.js";
import { prepareLoanParameters } from "../utils/101-loan-parameters.js";
import { generateInstallmentDates } from "../utils/102-installment-dates.js";
import { generatePrincipalAmounts } from "../utils/103-principal-engine.js"
import { generateInterestAmounts } from "../utils/104-interest-engine.js"
import { generateInstallment } from "../utils/105-installment-engine.js"
import { generateSchedule } from "../utils/106-Schedule.js";

const RAW_DATA_KEY = "LOAN_DATA";
const FORM_PAGE_URL = "../index.html";

document.addEventListener("DOMContentLoaded", () => {
    const loanData = getLoanData(RAW_DATA_KEY);
    // If there is no valid loan data, return to the form.
    if (!loanData) {
        console.warn("No loan data found. Redirecting to form.");
        window.location.href = FORM_PAGE_URL;
        return;
    }

    // Get calculated/processed loan parameters.
    const loanParameters = prepareLoanParameters(loanData);

    // Generate installment dates using the prepared loan parameters.
    const installmentDates = generateInstallmentDates(loanParameters);
    
    // Total Tenure Days
    const lastInstallment = installmentDates[loanParameters.numberOfInstallments - 1].finalDueDateAdjusted;
    const totalTenureDays = getDateDifference(lastInstallment, loanParameters.disbursementDate);

    // Total Flat Interest
    const principal = loanParameters.principalAmount;
    const annualRate = loanParameters.annualInterestRate;
    const dayCountDenominator = loanParameters.dayCountDenominator;
    const totalFlatInterest = calculateSimpleInterest(principal, annualRate, totalTenureDays, dayCountDenominator)

    // Calculate periodic rate: 0.12 / 52 ≈ 0.0023076923
    const periodicRate = (annualRate / 100) / loanParameters.periodsPerYear; 
    const emiAmount = calculateEMI(principal, periodicRate, loanParameters.numberOfInstallments);

    // Generate principal and interest amount using the prepared loan parameters and installmentDates.
    const principalAmounts = generatePrincipalAmounts(loanParameters, installmentDates, totalFlatInterest, emiAmount);

    // Generate interest amount using the prepared loan parameters, installmentDates and principalAmounts.
    const interestAmounts = generateInterestAmounts(loanParameters, installmentDates, principalAmounts,  totalFlatInterest);

    // Generate installment
    const installment = generateInstallment(loanParameters, installmentDates, principalAmounts, interestAmounts);

    // Generate schedule
    const schedule = generateSchedule(loanParameters, installmentDates, principalAmounts, interestAmounts, installment);
    

    // These functions must exist in your project.
    populateLoanCard(loanData, loanParameters);
    initDownloadButton();
});
 
/* =========================================================
   LABEL LOOKUPS
   -----------------------------------------------------------
   index.html stores the raw <option value="..."> CODES (e.g.
   "percentage", "reducing-emi"), not the text a person reads on
   the form. These tables translate each code to its label for
   display, so the mapping lives in exactly one place.
========================================================= */
 
const LABELS = {
    currency: {
        INR: "INR - Indian Rupee",
    },
 
    tenureUnit: {
        days: "Days",
        weeks: "Weeks",
        months: "Months",
        years: "Years",
    },
 
    repaymentFrequency: {
        weekly: "Weekly",
        biweekly: "Bi-weekly",
        monthly: "Monthly",
        quarterly: "Quarterly",
    },
 
    repaymentMethod: {
        "flat-interest": "Flat Interest - Equal Installment",
        "reducing-emi": "Reducing Balance - EMI (Equal Installment)",
        "reducing-balance": "Reducing Balance - Equal Principal",
    },
 
    dayCountConvention: {
        actual365: "Actual/365",
        actual360: "Actual/360",
        "30_360": "30/360",
    },
 
    feeApplicationTiming: {
        upfront: "Upfront at Disbursement",
        "first-installment": "Added to First Installment",
        spread: "Spread Equally Across Installments",
    },
 
    // Shared by both processingFeeType and insuranceFeeType — they
    // use the same two option values on Page 1.
    feeType: {
        percentage: "% of Principal",
        flat: "Flat Amount",
    },
 
    applyTax: {
        yes: "Yes",
        no: "No",
    },
 
    roundingDecimalPlaces: {
        "2": "Nearest ₹100",
        "1": "Nearest ₹10",
        "0": "Nearest ₹1",
        "-1": "Nearest ₹0.1",
        "-2": "Nearest ₹0.01",
    },
 
    roundingRule: {
        nearest: "Nearest - Closest amount",
        up: "Round Up - Higher amount",
        down: "Round Down - Lower amount",
    },
};
 
/**
 * Looks up the display label for a stored option code.
 * Falls back to the raw code itself if it's not found, so a future
 * option value added on Page 1 without a matching label here still
 * shows *something* instead of going blank.
 * @param {string} group - key into LABELS (e.g. "tenureUnit")
 * @param {string} code - the raw stored value (e.g. "months")
 */
function lookupLabel(group, code) {
    if (!code) {
        return "";
    }
 
    const groupLabels = LABELS[group];
    return (groupLabels && groupLabels[code]) || code;
}
 
/* =========================================================
   FORMATTING HELPERS
========================================================= */
 
/**
 * Formats a number as INR currency, e.g. 100000 -> "₹100,000.00".
 * @param {string|number} rawValue
 * @param {{ fallbackToZero?: boolean }} [options] - when true,
 *   an empty/missing value renders as "₹0.00" instead of "—".
 *   Use this for optional amount fields (Service Fee, Other
 *   Charges) that are meant to default to zero, not "not entered".
 */
function formatCurrency(rawValue, options = {}) {
    const number = Number(rawValue);
 
    if (rawValue === undefined || rawValue === null || rawValue === "" || Number.isNaN(number)) {
        return options.fallbackToZero ? "₹0.00" : "";
    }
 
    return "₹" + number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
 
/**
 * Formats a number as a percentage, e.g. 12 -> "12.00%".
 * @param {string|number} rawValue
 */
function formatPercentage(rawValue) {
    const number = Number(rawValue);
 
    if (rawValue === undefined || rawValue === null || rawValue === "" || Number.isNaN(number)) {
        return "";
    }
 
    return number.toFixed(2) + "%";
}
 
/**
 * Formats a fee amount as either a percentage or currency,
 * depending on that fee's selected type — mirrors how
 * Processing/Insurance Fee Value are entered on Page 1.
 * @param {string|number} rawValue
 * @param {string} feeTypeCode - "percentage" or "flat"
 */
function formatFeeAmount(rawValue, feeTypeCode) {
    return feeTypeCode === "percentage"
        ? formatPercentage(rawValue)
        : formatCurrency(rawValue);
}
 
/**
 * Formats an ISO date string (from an <input type="date">, e.g.
 * "2026-10-01") as "01 October 2026".
 * @param {string} isoDateString
 */
function formatDate(isoDateString) {
    if (!isoDateString) {
        return "";
    }
 
    // Appending a fixed time avoids the date shifting by a day due
    // to the browser's local timezone offset.
    const date = new Date(isoDateString + "T00:00:00");
 
    if (Number.isNaN(date.getTime())) {
        return isoDateString;
    }
 
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}
 
/* =========================================================
   POPULATE THE CARDS
========================================================= */
 
/**
 * Sets the text content of a value element by id.
 * Missing/empty values fall back to an em dash rather than being
 * left blank, so a skipped optional field is visibly intentional
 * rather than looking like a bug.
 * @param {string} elementId
 * @param {string} value
 */
function setValueText(elementId, value) {
    const element = document.getElementById(elementId);
 
    if (!element) {
        console.warn(`loan-card.js: no element found with id "${elementId}".`);
        return;
    }
 
    element.textContent = (value === undefined || value === null || value === "") ? "—" : value;
}
 
/**
 * Fills in every info card (1 through 6) using the submitted loan
 * data. The repayment schedule table is deliberately not touched
 * here — see the note at the top of this file.
 * @param {Object} data - parsed loanData from localStorage
 */
function populateLoanCard(data) {
 
    // 1. Loan & Borrower
    setValueText("borrowerNameValue", data.borrowerName);
    setValueText("loanIdValue", data.loanId);
    setValueText("borrowerIdValue", data.borrowerId);
    setValueText("productNameValue", data.productName);
 
    // 2. Loan Amount & Dates
    setValueText("principalAmountValue", formatCurrency(data.principalAmount));
    setValueText("currencyValue", lookupLabel("currency", data.currency));
    setValueText("disbursementDateValue", formatDate(data.disbursementDate));
    setValueText("firstRepaymentDateValue", formatDate(data.firstRepaymentDate));
 
    // 3. Repayment
    setValueText("tenureUnitValue", lookupLabel("tenureUnit", data.tenureUnit));
    setValueText("tenureValueValue", data.tenureValue);
    setValueText("repaymentFrequencyValue", lookupLabel("repaymentFrequency", data.repaymentFrequency));
    setValueText("numberOfInstallmentsValue", data.numberOfInstallments);
    setValueText("repaymentMethodValue", lookupLabel("repaymentMethod", data.repaymentMethod));
 
    // 4. Interest
    setValueText("annualInterestRateValue", formatPercentage(data.annualInterestRate));
    setValueText("dayCountConventionValue", lookupLabel("dayCountConvention", data.dayCountConvention));
 
    // 5. Fees & Charges
    setValueText("feeApplicationTimingValue", lookupLabel("feeApplicationTiming", data.feeApplicationTiming));
    setValueText("processingFeeTypeValue", lookupLabel("feeType", data.processingFeeType));
    setValueText("processingFeeValueValue", formatFeeAmount(data.processingFeeValue, data.processingFeeType));
    setValueText("insuranceFeeTypeValue", lookupLabel("feeType", data.insuranceFeeType));
    setValueText("insuranceFeeValueValue", formatFeeAmount(data.insuranceFeeValue, data.insuranceFeeType));
    setValueText("serviceFeeValue", formatCurrency(data.serviceFee, { fallbackToZero: true }));
    setValueText("otherChargesValue", formatCurrency(data.otherCharges, { fallbackToZero: true }));
    setValueText("applyTaxValue", lookupLabel("applyTax", data.applyTax));
    setValueText(
        "taxRateValue",
        data.applyTax === "yes" ? formatPercentage(data.taxRate) : "Not Applied"
    );
 
    // 6. Advanced Calculation Settings
    setValueText("roundingDecimalPlacesValue", lookupLabel("roundingDecimalPlaces", data.roundingDecimalPlaces));
    setValueText("roundingRuleValue", lookupLabel("roundingRule", data.roundingRule));
}


/**
 * Wires up the "Download As PDF" button. Clicking it snapshots the
 * #pdfContent element and turns it into a downloadable A4 PDF using
 * the html2pdf.js library (loaded via <script> tag in loan-card.html).
 */

document.addEventListener("DOMContentLoaded", initDownloadButton);

/**
 * Finds the download button and, if present, attaches the click
 * handler that generates the PDF. Wrapping this in a function (run
 * on DOMContentLoaded) avoids relying on the button already being
 * in the DOM when the script tag executes.
 */
function initDownloadButton() {
    const button = document.getElementById("downloadBtn");

    if (!button) {
        console.error('loan-card.js: could not find a "#downloadBtn" element.');
        return;
    }

    button.addEventListener("click", handleDownloadClick);
}

/**
 * Click handler for the download button: generates and downloads
 * the repayment schedule as a PDF.
 */
async function handleDownloadClick() {
    const button = document.getElementById("downloadBtn");
    const content = document.getElementById("pdfContent");

    if (!content) {
        console.error('loan-card.js: could not find the "#pdfContent" element to export.');
        return;
    }

    // Guard against the CDN script failing to load (offline, ad
    // blocker, network issue, etc.) — without this check, clicking
    // the button would throw an unhandled "html2pdf is not defined".
    if (typeof html2pdf === "undefined") {
        console.error("loan-card.js: html2pdf.js did not load. Check your network connection.");
        alert("Sorry, the PDF library failed to load. Please check your connection and try again.");
        return;
    }

    setButtonBusyState(button, true);

    try {
        await html2pdf().set(buildPdfOptions()).from(content).save();
    } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Something went wrong while creating the PDF. Please try again.");
    } finally {
        // Always restore the button, whether the export succeeded or failed.
        setButtonBusyState(button, false);
    }
}

/**
 * Toggles the button's disabled/label state while a PDF is being
 * generated, so the user can't trigger multiple exports at once.
 * @param {HTMLButtonElement} button
 * @param {boolean} isBusy
 */
function setButtonBusyState(button, isBusy) {
    button.disabled = isBusy;
    button.innerText = isBusy ? "Generating PDF..." : "Download PDF";
}

/**
 * Builds the configuration object passed to html2pdf.js.
 * Kept as its own function so the options are easy to find and
 * tweak without touching the click-handling logic above.
 * @returns {object} html2pdf.js options
 */
function buildPdfOptions() {
    return {
        // Margins, in millimeters, in [top, left, bottom, right] order.
        margin: [6, 0, 6, 6],

        // Name of the file the browser will save.
        filename: "Repayment_Schedule.pdf",

        image: {
            // JPEG keeps the file size down compared to PNG.
            type: "jpeg",
            // 0.98 = high quality without an unnecessarily large file.
            quality: 0.98,
        },

        html2canvas: {
            // 2 = good quality; 3 = higher quality but a larger file.
            scale: 2,
            // Allow cross-origin images when the server sends CORS headers.
            useCORS: true,
            backgroundColor: "#ffffff",
            // Always capture from the very top-left of the element.
            scrollX: 0,
            scrollY: 0,
        },

        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
        },

        pagebreak: {
            // "css"    -> respect CSS break-inside/page-break rules.
            // "legacy" -> extra compatibility with older html2pdf behavior.
            mode: ["css", "legacy"],

            // Elements html2pdf.js should try not to split across pages.
            // Mirrors the `break-inside: avoid` rules in loan-card.css.
            avoid: [".card", ".info-item", "tr"],
        },
    };
}