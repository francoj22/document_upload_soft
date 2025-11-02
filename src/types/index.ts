/**
 * By Franco Gutierrez
 * Date: November, 2025
 */

export interface UploadStatus {
  status: 'idle' | 'uploading' | 'signing' | 'completed' | 'error';
  progress?: number;
  error?: string;
}

export interface SignedDocument {
  id: string;
  originalName: string;
  signedUrl: string;
  signedAt: Date;
}

export interface PDFFile {
  file: File;
  name: string;
  size: number;
  url: string;
}

export interface SignatureData {
  dataURL: string;
  timestamp: Date;
}