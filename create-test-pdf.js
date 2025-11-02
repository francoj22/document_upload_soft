// Create a simple test PDF for signature testing
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';

async function createTestPDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont('Helvetica');

  page.drawText('Test Document for Digital Signature', {
    x: 50,
    y: 750,
    size: 20,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText('This document will be used to test signature embedding.', {
    x: 50,
    y: 700,
    size: 12,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText('Please sign below:', {
    x: 50,
    y: 650,
    size: 14,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Add a signature line
  page.drawLine({
    start: { x: 50, y: 600 },
    end: { x: 300, y: 600 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('/Users/francojacobo/Documents/github/document_upload_soft/test-document.pdf', pdfBytes);
  console.log('Test PDF created: test-document.pdf');
}

createTestPDF().catch(console.error);