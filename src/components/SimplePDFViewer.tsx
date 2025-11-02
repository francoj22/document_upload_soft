/**
 * By Franco Gutierrez
 * Date: November, 2025
 */

import React, { useEffect } from 'react';
import { CheckCircle, ExternalLink, Download, X } from 'lucide-react';
import type { SignedDocument } from '../types';

interface SimplePDFViewerProps {
  document: SignedDocument;
  onClose: () => void;
}

export const SimplePDFViewer: React.FC<SimplePDFViewerProps> = ({ document, onClose }) => {
  useEffect(() => {
    // Automatically open PDF in new tab
    console.log('Opening PDF in new tab:', document.signedUrl);
    window.open(document.signedUrl, '_blank');
  }, [document.signedUrl]);

  const downloadPDF = () => {
    const link = window.document.createElement('a');
    link.href = document.signedUrl;
    link.download = `signed_${document.originalName}`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const openInNewTab = () => {
    window.open(document.signedUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-auto p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            PDF Opened Successfully!
          </h2>
          
          <p className="text-gray-600 mb-4">
            Your signed PDF has been opened in a new tab. If it didn't open automatically, 
            you can use the buttons below.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 font-medium mb-1">
              {document.originalName}
            </p>
            <p className="text-xs text-gray-500">
              Signed on {document.signedAt.toLocaleDateString()} at {document.signedAt.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={openInNewTab}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open PDF in New Tab
          </button>
          
          <button
            onClick={downloadPDF}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          Note: If the PDF doesn't display properly in the browser, try downloading it and opening with a PDF reader.
        </p>
      </div>
    </div>
  );
};