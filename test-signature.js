// Simple test script to verify signature embedding
import express from 'express';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

const app = express();

// Test signature embedding
async function testSignatureEmbedding() {
  try {
    // Create a simple PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont('Helvetica');
    
    page.drawText('Test Document', {
      x: 50,
      y: 350,
      size: 20,
      font: font,
    });

    // Create a simple test signature (red rectangle)
    const testSignatureBytes = Buffer.from(`iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==`, 'base64');
    
    try {
      const signatureImage = await pdfDoc.embedPng(testSignatureBytes);
      const signatureDims = signatureImage.scale(50);
      
      page.drawImage(signatureImage, {
        x: 100,
        y: 100,
        width: signatureDims.width,
        height: signatureDims.height,
      });
      
      console.log(' Signature embedding test PASSED');
    } catch (embedError) {
      console.log(' Signature embedding test FAILED:', embedError.message);
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('/Users/francojacobo/Documents/github/document_upload_soft/test-signature.pdf', pdfBytes);
    console.log('Test PDF saved to test-signature.pdf');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSignatureEmbedding();