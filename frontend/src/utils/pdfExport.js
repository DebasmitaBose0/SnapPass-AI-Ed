import { jsPDF } from 'jspdf';

/**
 * Exports a passport sheet image blob to a PDF with exact dimensions.
 * @param {Blob} imageBlob - The generated sheet image blob
 * @param {string} filename - Output filename (default: passport-sheet.pdf)
 * @param {number[]} dimensions - Dimensions in inches [width, height] (default: [4, 6])
 */
export const exportSheetToPDF = async (imageBlob, filename = 'passport-sheet.pdf', dimensions = [4, 6]) => {
  const pdf = new jsPDF({
    orientation: dimensions[0] > dimensions[1] ? 'landscape' : 'portrait',
    unit: 'in',
    format: dimensions
  });

  const imageUrl = URL.createObjectURL(imageBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      pdf.addImage(img, 'PNG', 0, 0, dimensions[0], dimensions[1]);
      pdf.save(filename);
      URL.revokeObjectURL(imageUrl);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('Failed to load image for PDF export'));
    };
    img.src = imageUrl;
  });
};
