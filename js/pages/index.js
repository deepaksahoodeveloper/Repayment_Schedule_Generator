/**
 * Index.js
 * ---------------------------------------------------------
 * index.js
 * This file contains the JavaScript logic for the index.html page.
 * It handles the initialization of icons and the "+ Create Card" button
 * that takes the user to the loan-type selection page.
 *
 * Responsibilities:
 * 1. Initialize Lucide icons on the page.
 * 2. Set up the "+ Create Card" button to scroll to the
 * loan-type selection section when clicked.
 *
 * This file does not handle any loan calculations or data processing.
 * Those responsibilities are delegated to other modules.
 */


/* =========================================================
   INITIALIZE PAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeIcons();
    initializeCreateCardButton();

});


/* =========================================================
   ICONS
   ========================================================= */

/**
 * Initialize Lucide icons.
 */
function initializeIcons() {

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

}


/* =========================================================
   CREATE CARD BUTTON
   ========================================================= */

/**
 * The "+ Create Card" button takes the user
 * to the loan-type selection.
 */
function initializeCreateCardButton() {

    const createCardButton =
        document.getElementById("createCardButton");

    const loanTypes =
        document.getElementById("loanTypes");


    if (!createCardButton || !loanTypes) {
        return;
    }


    createCardButton.addEventListener("click", () => {

        loanTypes.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}