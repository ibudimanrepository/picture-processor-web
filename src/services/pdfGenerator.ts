import { jsPDF } from 'jspdf';
import type { ScreenshotItem } from '../types';

export async function generatePDF(
  screenshots: ScreenshotItem[]
): Promise<string> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 30;

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  for (let i = 0; i < screenshots.length; i++) {
    const item = screenshots[i];
    const col = i % 2;
    const row = Math.floor((i % 4) / 2);
    // New page for each group of 4
    if (i % 4 === 0) {
      if (i > 0) doc.addPage();

      // Header
      doc.setFontSize(16);
      doc.setTextColor(0, 122, 255);
      doc.text('QA Testing Report', margin, 30);
      doc.setFontSize(10);
      doc.setTextColor(136, 136, 136);
      doc.text(`Generated: ${dateStr}`, margin, 42);
      doc.setDrawColor(0, 122, 255);
      doc.setLineWidth(1.5);
      doc.line(margin, 48, pageWidth - margin, 48);
    }

    const cellW = (pageWidth - margin * 2 - 12) / 2;
    const cellH = (pageHeight - 70 - 20) / 2;
    const x = margin + col * (cellW + 12);
    const y = 58 + row * (cellH + 12);

    const stepNum = i + 1;
    const title = item.stepTitle || `Step ${stepNum}`;

    // Card border
    doc.setDrawColor(224, 224, 224);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, cellW, cellH, 4, 4);

    // Step number & title
    doc.setFontSize(10);
    doc.setTextColor(0, 122, 255);
    doc.text(`${stepNum}.`, x + 6, y + 16);
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    doc.text(title, x + 30, y + 16);

    // Description
    if (item.stepDescription) {
      doc.setFontSize(9);
      doc.setTextColor(102, 102, 102);
      doc.text(item.stepDescription, x + 6, y + 28, {
        maxWidth: cellW - 12,
      });
    }

    // Image
    const imgY = item.stepDescription ? y + 40 : y + 24;
    const imgH = cellH - (item.stepDescription ? 48 : 32);
    try {
      doc.addImage(item.uri, 'JPEG', x + 6, imgY, cellW - 12, imgH);
    } catch {
      doc.setFontSize(10);
      doc.setTextColor(255, 59, 48);
      doc.text('Image unavailable', x + 6, imgY + 20);
    }
  }

  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
}
