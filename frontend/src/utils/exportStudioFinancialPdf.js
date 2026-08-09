import { jsPDF } from 'jspdf';

/**
 * Generates and downloads an A4 daily studio financial summary report PDF.
 */
export function exportStudioFinancialPdf({
  studioName = 'SnapPass AI Partner Studio',
  date = new Date().toISOString().split('T')[0],
  photosPrepared = 0,
  sheetsPrinted = 0,
  grossRevenue = 0,
  totalExpense = 0,
  netProfit = 0,
  profitMargin = 0,
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text(studioName, 20, 25);

  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139);
  doc.text('Daily Business & Profit Summary Report', 20, 34);

  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 40, 190, 40);

  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');

  doc.text(`Report Date: ${date}`, 20, 52);
  doc.text(`Generated At: ${new Date().toLocaleTimeString()}`, 120, 52);

  doc.setFillColor(241, 245, 249);
  doc.rect(20, 62, 170, 45, 'F');

  doc.setFont('helvetica', 'bold');
  doc.text('Production Volume Summary', 25, 72);

  doc.setFont('helvetica', 'normal');
  doc.text(`Total Photos Prepared: ${photosPrepared}`, 25, 82);
  doc.text(`A4 Print Sheets Produced: ${sheetsPrinted}`, 25, 92);

  doc.setFillColor(236, 253, 245);
  doc.rect(20, 115, 170, 60, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 95, 70);
  doc.text('Financial & Margin Telemetry', 25, 127);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(`Gross Revenue: $${Number(grossRevenue).toFixed(2)}`, 25, 140);
  doc.text(`Consumable Expenses (Paper + Ink): $${Number(totalExpense).toFixed(2)}`, 25, 150);
  doc.text(`Net Studio Profit: $${Number(netProfit).toFixed(2)} (${profitMargin}% Margin)`, 25, 160);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('SnapPass AI Studio Analytics Module • Automated Financial Export', 20, 280);

  doc.save(`studio_financial_report_${date}.pdf`);
}
