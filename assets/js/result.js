document.getElementById("downloadBtn").addEventListener("click", function () {

  const element = document.getElementById("pdfContent");

  // Hide button while creating PDF
  const button = document.getElementById("downloadBtn");
  button.style.display = "none";

  const options = {
    margin: 0,
    filename: "my-page.pdf",

    image: {
      type: "jpeg",
      quality: 1
    },

    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    },

    jsPDF: {
      unit: "px",
      format: [element.offsetWidth, element.offsetHeight],
      orientation: "landscape"
    }
  };

  html2pdf()
    .set(options)
    .from(element)
    .save()
    .then(function () {
      // Show button again
      button.style.display = "block";
    });

});