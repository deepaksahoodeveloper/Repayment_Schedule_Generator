document
    .getElementById("downloadBtn")
    .addEventListener("click", function () {

        // =========================================
        // 1. Get PDF content
        // =========================================

        const element =
            document.getElementById("pdfContent");


        // =========================================
        // 2. Get Download button
        // =========================================

        const button =
            document.getElementById("downloadBtn");


        // =========================================
        // 3. Disable button
        // =========================================
        // Prevent the user from clicking the
        // button multiple times while PDF
        // is being generated.

        button.disabled = true;

        button.innerText = "Generating PDF...";


        // =========================================
        // 4. PDF options
        // =========================================

        const options = {

            /*
             * PDF margins
             *
             * Order:
             *
             * [top, left, bottom, right]
             *
             * Unit = mm
             */

            margin: [
                6,
                0,
                6,
                6
            ],


            /*
             * PDF file name
             */

            filename:
                "Repayment_Schedule.pdf",


            // =====================================
            // Image configuration
            // =====================================

            image: {

                /*
                 * JPEG gives smaller PDF files.
                 */

                type: "jpeg",

                /*
                 * 0.98 gives good quality without
                 * making the PDF unnecessarily large.
                 */

                quality: 0.98
            },


            // =====================================
            // html2canvas configuration
            // =====================================

            html2canvas: {

                /*
                 * Scale controls rendering quality.
                 *
                 * 2 = good quality
                 * 3 = higher quality but larger file
                 */

                scale: 2,


                /*
                 * Allow cross-origin images when
                 * the server provides CORS headers.
                 */

                useCORS: true,


                /*
                 * White PDF background.
                 */

                backgroundColor: "#ffffff",


                /*
                 * Start capture from the top-left.
                 */

                scrollX: 0,

                scrollY: 0
            },


            // =====================================
            // jsPDF configuration
            // =====================================

            jsPDF: {

                /*
                 * Use millimeters.
                 */

                unit: "mm",


                /*
                 * Standard A4 paper.
                 */

                format: "a4",


                /*
                 * Portrait:
                 *
                 * 210mm × 297mm
                 */

                orientation: "portrait"
            },


            // =====================================
            // Page break configuration
            // =====================================

            pagebreak: {

                /*
                 * "css"
                 *
                 * Respect CSS page-break rules.
                 *
                 * "legacy"
                 *
                 * Additional compatibility with
                 * older html2pdf page-break behavior.
                 */

                mode: [
                    "css",
                    "legacy"
                ],


                /*
                 * Try to avoid splitting these
                 * elements across pages.
                 */

                avoid: [
                    ".card",
                    ".info-item",
                    "tr"
                ]
            }
        };


        // =========================================
        // 5. Generate PDF
        // =========================================

        html2pdf()

            /*
             * Apply our options.
             */

            .set(options)


            /*
             * Tell html2pdf which element
             * should be converted.
             */

            .from(element)


            /*
             * Generate and download.
             */

            .save()


            // =====================================
            // 6. Success
            // =====================================

            .then(function () {

                /*
                 * Enable button again.
                 */

                button.disabled = false;


                /*
                 * Restore button text.
                 */

                button.innerText =
                    "Download PDF";
            })


            // =====================================
            // 7. Error handling
            // =====================================

            .catch(function (error) {

                console.error(
                    "PDF generation failed:",
                    error
                );


                /*
                 * Restore button even if
                 * something goes wrong.
                 */

                button.disabled = false;

                button.innerText =
                    "Download PDF";
            });

    });
