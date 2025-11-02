/**
 * By Franco Gutierrez
 * Date: November, 2025
 */

import React, { useCallback, useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import type { PDFFile } from '../types';

interface PDFUploadProps {
  onFileSelect: (file: PDFFile) => void;
  disabled?: boolean;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({ onFileSelect, disabled = false }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    const pdfFile: PDFFile = {
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    };

    onFileSelect(pdfFile);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragOver && !disabled ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400 hover:bg-gray-50'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => {
          if (!disabled) {
            document.getElementById('pdf-input')?.click();
          }
        }}
      >
        <input
          id="pdf-input"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 mx-auto">
            <FileText className="w-full h-full text-gray-400" />
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">
              {dragOver ? 'Drop your PDF here' : 'Upload PDF Document'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-400">
              PDF files only, max 10MB
            </p>
          </div>
          
          {!disabled && (
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Choose File
            </button>
          )}
        </div>
      </div>
    </div>
  );
};