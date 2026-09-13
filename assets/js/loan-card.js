/**
 * loan-card.js
 * -----------------------------------------------------------------
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