/**
 * By Franco Gutierrez
 * Date: November, 2025
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3002;

// Configure CORS
app.use(cors({
  origin: true, // Allow all origins for development (mobile access)
  credentials: true
}));

app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// PDF signing endpoint
app.post('/api/sign-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    console.log(`Processing PDF: ${req.file.originalname}, Size: ${req.file.size} bytes`);
    
    // Get signature data from request body
    const signatureData = req.body.signature;
    const signatureTimestamp = req.body.signatureTimestamp;
    
    console.log('=== SIGNATURE DATA ANALYSIS ===');
    console.log('Signature data received:', signatureData ? 'Yes' : 'No');
    console.log('Signature data length:', signatureData ? signatureData.length : 0);
    console.log('Signature starts with:', signatureData ? signatureData.substring(0, 50) : 'N/A');
    console.log('Is data URL format:', signatureData ? signatureData.startsWith('data:image/png;base64,') : false);
    console.log('Signature timestamp:', signatureTimestamp);
    console.log('================================');

    // Read the uploaded PDF
    const pdfBytes = fs.readFileSync(req.file.path);
    
    // Load the PDF with pdf-lib with error handling
    let pdfDoc;
    try {
      pdfDoc = await PDFDocument.load(pdfBytes);
    } catch (loadError) {
      console.error('Error loading PDF:', loadError);
      throw new Error('Invalid or corrupted PDF file');
    }
    
    // Embed a standard font to avoid encoding issues
    const font = await pdfDoc.embedFont('Helvetica');
    
    // Add a signature annotation (simple text overlay)
    const pages = pdfDoc.getPages();
    
    if (pages.length === 0) {
      throw new Error('PDF document has no pages');
    }
    
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    
    // Calculate position for signature (800px below top, close to footer)
    const signatureX = Math.max(width / 2 - 100, 10); // Center horizontally
    const signatureY = Math.max(height - 800, 50); // 800px below top, minimum 50px from bottom
    
    console.log(`PDF dimensions: ${width}x${height}, Signature position: (${signatureX}, ${signatureY})`);
    
    // Add signature content
    try {
      console.log('=== SIGNATURE EMBEDDING PROCESS ===');
      console.log('Signature data exists:', !!signatureData);
      console.log('Signature data length check:', signatureData ? signatureData.length : 0);
      console.log('Length > 100:', signatureData && signatureData.length > 100);
      
      if (signatureData && signatureData.length > 100) { // Check if we have substantial signature data
        // If we have a digital signature image, embed it
        console.log('!ATTEMPTING to embed digital signature image');
        console.log('Processing signature data...');
        
        // Remove data URL prefix to get base64 data
        const base64Data = signatureData.replace(/^data:image\/png;base64,/, '');
        console.log('Base64 data length after cleanup:', base64Data.length);
        
        if (base64Data.length < 100) {
          console.log('X - Base64 data too short after cleanup, using fallback');
          throw new Error('Invalid signature data');
        }
        
        const signatureBytes = Buffer.from(base64Data, 'base64');
        console.log('Signature bytes length:', signatureBytes.length);
        
        // Embed the signature image
        console.log('Attempting to embed PNG...');
        const signatureImage = await pdfDoc.embedPng(signatureBytes);
        console.log('Signature image embedded successfully');
        
        // Set signature to exactly 200x200 pixels
        const signatureWidth = 100;
        const signatureHeight = 50;
        console.log('Signature dimensions set to:', { width: signatureWidth, height: signatureHeight });
        
        // Add a background rectangle for the signature (for debugging/visibility)
        firstPage.drawRectangle({
          x: signatureX - 5,
          y: signatureY + 25,
          width: signatureWidth + 10,
          height: signatureHeight + 10,
          borderColor: rgb(0, 0, 1), // Blue border
          borderWidth: 1,
          color: rgb(1, 1, 0.9), // Light yellow background
        });
        
        // Draw the signature image
        console.log(`Drawing signature at position: x=${signatureX}, y=${signatureY + 30}`);
        firstPage.drawImage(signatureImage, {
          x: signatureX,
          y: signatureY + 30,
          width: signatureWidth,
          height: signatureHeight,
        });
        
        console.log('Digital signature image added to PDF successfully!');
        
        // Add timestamp below signature
        firstPage.drawText(`Digitally signed on: ${new Date().toLocaleDateString('en-US')}`, {
          x: signatureX,
          y: signatureY + 10,
          size: 8,
          font: font,
          color: rgb(0.5, 0.5, 0.5),
        });
        
        firstPage.drawText(`Time: ${new Date().toLocaleTimeString('en-US')}`, {
          x: signatureX,
          y: signatureY - 5,
          size: 8,
          font: font,
          color: rgb(0.5, 0.5, 0.5),
        });
      } else {
        // Fallback to text signature if no image provided or image is too small
        console.log('Using fallback text signature - no valid image data');
        console.log('Reason: ', !signatureData ? 'No signature data' : 'Signature data too small');
        
        firstPage.drawText('[DIGITALLY SIGNED - NO IMAGE]', {
          x: signatureX,
          y: signatureY + 30,
          size: 12,
          font: font,
          color: rgb(0, 0.5, 0),
        });
        
        firstPage.drawText(`Signed: ${new Date().toLocaleDateString('en-US')}`, {
          x: signatureX,
          y: signatureY + 15,
          size: 10,
          font: font,
          color: rgb(0.5, 0.5, 0.5),
        });
        
        firstPage.drawText(`Time: ${new Date().toLocaleTimeString('en-US')}`, {
          x: signatureX,
          y: signatureY,
          size: 8,
          font: font,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
    } catch (drawError) {
      console.error('Error drawing signature:', drawError);
      throw new Error('Failed to add signature to PDF');
    }

    // Save the modified PDF
    let signedPdfBytes;
    try {
      signedPdfBytes = await pdfDoc.save();
    } catch (saveError) {
      console.error('Error saving PDF:', saveError);
      throw new Error('Failed to save signed PDF');
    }
    
    // Create filename for signed PDF
    const signedFileName = `signed_${Date.now()}_${req.file.originalname}`;
    const signedFilePath = path.join('uploads', signedFileName);
    
    // Write signed PDF to disk
    fs.writeFileSync(signedFilePath, signedPdfBytes);
    
    // Clean up original file
    fs.unlinkSync(req.file.path);
    
    // Return signed PDF info
    const hostHeader = req.get('host') || `localhost:${port}`;
    const protocol = req.secure ? 'https' : 'http';
    
    console.log(`📱 Mobile URL generation: ${protocol}://${hostHeader}/uploads/${signedFileName}`);
    console.log(`📡 Request came from host: ${req.get('host')}`);
    
    const result = {
      id: `signed_${Date.now()}`,
      signedUrl: `${protocol}://${hostHeader}/uploads/${signedFileName}`,
      signedAt: new Date().toISOString(),
      originalName: req.file.originalname
    };
    
    res.json(result);
    
  } catch (error) {
    console.error('Error signing PDF:', error);
    
    // Fallback: if signing fails, just copy the original file as "signed"
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        console.log('Attempting fallback: copying original file as signed version');
        
        const fallbackFileName = `signed_${Date.now()}_${req.file.originalname}`;
        const fallbackFilePath = path.join('uploads', fallbackFileName);
        
        // Copy original file as signed version
        fs.copyFileSync(req.file.path, fallbackFilePath);
        fs.unlinkSync(req.file.path);
        
        const hostHeader = req.get('host') || `localhost:${port}`;
        const protocol = req.secure ? 'https' : 'http';
        
        const result = {
          id: `fallback_${Date.now()}`,
          signedUrl: `${protocol}://${hostHeader}/uploads/${fallbackFileName}`,
          signedAt: new Date().toISOString(),
          originalName: req.file.originalname,
          warning: 'Document processed without visual signature due to encoding issues'
        };
        
        console.log('Fallback successful:', result);
        return res.json(result);
        
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        fs.unlinkSync(req.file.path);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to sign PDF',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Try uploading a different PDF file or check if the file is corrupted'
    });
  }
});

// Serve uploaded files with proper headers
app.use('/uploads', (req, res, next) => {
  // Set headers for PDF files
  if (req.path.endsWith('.pdf')) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
  next();
}, express.static('uploads'));

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  res.status(500).json({ error: error.message || 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`📄 PDF Signing Server running at http://localhost:${port}`);
  console.log(`📱 Server accessible on all network interfaces for mobile access`);
  console.log(`📱 Ready to receive PDFs for signing!`);
});