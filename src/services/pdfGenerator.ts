import { jsPDF } from 'jspdf';
import type { ScreenshotItem } from '../types';

function getImageSize(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 600, h: 400 });
    img.src = src;
  });
}

export async function generatePDF(
  screenshots: ScreenshotItem[]
): Promise<string> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 24;
  const gap = 10;
  const itemsPerRow = 4;
  const headerHeight = 52;

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const cellW = (pageWidth - margin * 2 - gap * (itemsPerRow - 1)) / itemsPerRow;
  const textAreaH = 28;
  const maxImgH = pageHeight - margin - headerHeight - textAreaH;

  const imageSizes = await Promise.all(screenshots.map((s) => getImageSize(s.uri)));

  for (let i = 0; i < screenshots.length; i++) {
    const col = i % itemsPerRow;

    if (col === 0) {
      if (i > 0) doc.addPage();

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

    const item = screenshots[i];
    const imgSize = imageSizes[i];
    const x = margin + col * (cellW + gap);
    const y = headerHeight;

    const stepNum = i + 1;
    const title = item.stepTitle || `Step ${stepNum}`;

    // Image dimensions preserving aspect ratio
    const aspect = imgSize.w / imgSize.h;
    let imgW = cellW - 12;
    let imgH = imgW / aspect;
    if (imgH > maxImgH) {
      imgH = maxImgH;
      imgW = imgH * aspect;
    }

    const cardH = textAreaH + imgH + 12;

    // Card
    doc.setDrawColor(224, 224, 224);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, cellW, cardH, 4, 4);

    // Text
    doc.setFontSize(9);
    doc.setTextColor(0, 122, 255);
    doc.text(`${stepNum}.`, x + 6, y + 12);
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 26);
    doc.text(title, x + 22, y + 12, { maxWidth: cellW - 34 });

    if (item.stepDescription) {
      doc.setFontSize(8);
      doc.setTextColor(102, 102, 102);
      doc.text(item.stepDescription, x + 6, y + 22, { maxWidth: cellW - 12 });
    }

    // Image — centered horizontally within the card
    const imgX = x + (cellW - imgW) / 2;
    const imgY = y + textAreaH + 4;

    try {
      doc.addImage(item.uri, 'JPEG', imgX, imgY, imgW, imgH);
    } catch {
      doc.setFontSize(10);
      doc.setTextColor(255, 59, 48);
      doc.text('Image unavailable', imgX, imgY + 20);
    }
  }

  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
}
