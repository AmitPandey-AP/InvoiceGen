import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export const generatePdfFromElement = async (
  element,
  filename = "invoice.pdf",
  returnBlob = false
) => {
  const canvas = await html2canvas(element, {
    // scale: -2,
    useCORS: true,
    backgroundColor: "#fff",
    scrollY: -window.scrollY,
  });
  const imageData = canvas.toDataURL("image/jpeg");
  const pdf = new jsPDF("p", "pt", "a4");
  const imgProps = pdf.getImageProperties(imageData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imageData, "JPEG", 0, 0, pdfWidth, pdfHeight);

  if (returnBlob) {
    return pdf.output("blob");
  } else {
    pdf.save(filename);
  }
};
