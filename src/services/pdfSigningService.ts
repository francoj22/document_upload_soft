import type { SignedDocument, SignatureData } from '../types';

export class PdfSigningService {
  private getBaseUrl(): string {
    // For mobile access, use the same host as the current page but with server port
    const currentHost = window.location.hostname;
    return `http://${currentHost}:3002`;
  }

  async signPDF(file: File, signature?: SignatureData, onProgress?: (progress: number) => void): Promise<SignedDocument> {
    const formData = new FormData();
    formData.append('pdf', file);
    
    // Add signature data if provided
    if (signature) {
      console.log('Adding signature to form data:', {
        length: signature.dataURL.length,
        starts_with: signature.dataURL.substring(0, 50)
      });
      formData.append('signature', signature.dataURL);
      formData.append('signatureTimestamp', signature.timestamp.toISOString());
    }

    try {
      // Simulate upload progress
      if (onProgress) {
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          onProgress(i);
        }
      }

      const response = await fetch(`${this.getBaseUrl()}/api/sign-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Show warning if fallback was used
      if (result.warning) {
        console.warn('PDF signing warning:', result.warning);
        // You could also show this to the user via a toast notification
      }
      
      return {
        id: result.id,
        originalName: file.name,
        signedUrl: result.signedUrl,
        signedAt: new Date(result.signedAt),
      };
    } catch (error) {
      console.error('Error signing PDF:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to signing server. Please check your connection.');
        } else if (error.message.includes('400')) {
          throw new Error('Invalid PDF file. Please try a different file.');
        } else if (error.message.includes('413')) {
          throw new Error('File too large. Please use a PDF smaller than 10MB.');
        } else {
          throw new Error(error.message);
        }
      }
      
      throw new Error('Failed to sign PDF. Please try again.');
    }
  }

  // Fallback method for when the server is not available
  async mockSignPDF(file: File, signature?: SignatureData, onProgress?: (progress: number) => void): Promise<SignedDocument> {
    // Simulate upload progress
    if (onProgress) {
      for (let i = 0; i <= 50; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onProgress(i);
      }
    }

    // Simulate signing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (onProgress) {
      for (let i = 50; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onProgress(i);
      }
    }

    // Create a mock signed PDF (just return the original for demo)
    const signedUrl = URL.createObjectURL(file);
    
    return {
      id: `mock-${Date.now()}`,
      originalName: file.name,
      signedUrl,
      signedAt: new Date(),
    };
  }

  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      return response.ok;
    } catch (error) {
      console.warn('Server health check failed:', error);
      return false;
    }
  }
}

export const pdfSigningService = new PdfSigningService();