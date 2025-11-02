/**
 * By Franco Gutierrez
 * Date: November, 2025
 */
import { useState, useCallback } from 'react';
import { FileText, CheckCircle, PenTool } from 'lucide-react';
import { PDFUpload } from './components/PDFUpload';
import { SimplePDFViewer } from './components/SimplePDFViewer';
import { LoadingIndicator } from './components/LoadingIndicator';
import { SignatureCanvas } from './components/SignatureCanvas';
import { pdfSigningService } from './services/pdfSigningService';
import type { PDFFile, SignedDocument, UploadStatus, SignatureData } from './types';

function App() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle' });
  const [pdfFile, setPDFFile] = useState<PDFFile | null>(null);
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
  const [signedDocument, setSignedDocument] = useState<SignedDocument | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [showSignatureCanvas, setShowSignatureCanvas] = useState(false);

  const handleFileSelect = useCallback(async (selectedFile: PDFFile) => {
    setPDFFile(selectedFile);
    setShowSignatureCanvas(true);
  }, []);

  const processDocumentWithSignature = useCallback(async (signature: SignatureData) => {
    if (!pdfFile) return;

    setUploadStatus({ status: 'uploading', progress: 0 });

    try {
      // Check if server is available
      const isServerAvailable = await pdfSigningService.checkServerHealth();
      
      let signedDoc: SignedDocument;
      
      if (isServerAvailable) {
        // Use real server with signature
        setUploadStatus({ status: 'uploading', progress: 50 });
        signedDoc = await pdfSigningService.signPDF(pdfFile.file, signature);
      } else {
        // Fallback to mock service
        console.warn('Server not available, using mock signing service');
        signedDoc = await pdfSigningService.mockSignPDF(pdfFile.file, signature);
      }

      setUploadStatus({ status: 'signing' });
      
      // Simulate final signing process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadStatus({ status: 'completed' });
      setSignedDocument(signedDoc);
      
      // Auto-open viewer after a brief delay
      setTimeout(() => setViewerOpen(true), 1500);
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      setUploadStatus({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to process PDF'
      });
    }
  }, [pdfFile]);

  const handleSignatureComplete = useCallback((signatureDataUrl: string) => {
    console.log('Signature received in App:', {
      length: signatureDataUrl.length,
      starts_with: signatureDataUrl.substring(0, 50),
      has_base64_prefix: signatureDataUrl.startsWith('data:image/png;base64,')
    });
    
    const signature: SignatureData = {
      dataURL: signatureDataUrl,
      timestamp: new Date()
    };
    setSignatureData(signature);
    setShowSignatureCanvas(false);
    processDocumentWithSignature(signature);
  }, [processDocumentWithSignature]);

  const handleSignatureClear = useCallback(() => {
    setShowSignatureCanvas(false);
    setPDFFile(null);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setViewerOpen(false);
  }, []);

  const handleStartOver = useCallback(() => {
    setUploadStatus({ status: 'idle' });
    setPDFFile(null);
    setSignatureData(null);
    setSignedDocument(null);
    setViewerOpen(false);
    setShowSignatureCanvas(false);
  }, []);

  const handleViewDocument = useCallback(() => {
    setViewerOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
             PDF Document Signer
          </h1>
          <p className="text-gray-600 text-center mt-2 text-sm md:text-base">
            Upload, Sign, and view your PDF documents on any device
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          {uploadStatus.status === 'idle' && !showSignatureCanvas && (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-4 text-blue-600">
                  <FileText className="w-full h-full" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Ready to Sign Your Document
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Upload your PDF document and we'll add a digital signature for you
                </p>
              </div>
              <PDFUpload onFileSelect={handleFileSelect} />
            </div>
          )}

          {/* Signature Canvas Section */}
          {showSignatureCanvas && pdfFile && (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-4 text-purple-600">
                  <PenTool className="w-full h-full" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Add Your Digital Signature
                </h2>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Draw your signature below for: <span className="font-medium">{pdfFile.name}</span>
                </p>
              </div>
              <SignatureCanvas
                onSignatureSave={handleSignatureComplete}
                onCancel={handleSignatureClear}
              />
            </div>
          )}

          {/* Loading States */}
          {(uploadStatus.status === 'uploading' || uploadStatus.status === 'signing') && (
            <div className="text-center">
              <LoadingIndicator status={uploadStatus} />
            </div>
          )}

          {/* Error State */}
          {uploadStatus.status === 'error' && (
            <div className="text-center">
              <LoadingIndicator status={uploadStatus} />
              <div className="mt-6">
                <button
                  onClick={handleStartOver}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadStatus.status === 'completed' && signedDocument && (
            <div className="text-center">
              <LoadingIndicator status={uploadStatus} />
              
              <div className="mt-8 bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 text-green-600">
                    <CheckCircle className="w-full h-full" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Document Signed Successfully!
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    {signedDocument.originalName}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Signed on {signedDocument.signedAt.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleViewDocument}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    View Signed Document
                  </button>
                  
                  <button
                    onClick={handleStartOver}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Sign Another Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">Mobile-optimized PDF signing experience</p>
            <div className="flex justify-center items-center space-x-4 text-xs">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Secure Processing
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                Mobile Responsive
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                Fast & Reliable
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* PDF Viewer Modal */}
      {viewerOpen && signedDocument && (
        <SimplePDFViewer
          document={signedDocument}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
}

export default App;
