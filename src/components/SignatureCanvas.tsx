/**
 * By Franco Gutierrez
 * Date: November, 2025
 */

import React, { useRef, useState, useCallback } from 'react';
import { Save, RotateCcw, Pen } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureSave: (signature: string) => void;
  onCancel: () => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSignatureSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize canvas when component mounts
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mobile debugging
    console.log('Mobile Debug Info:', {
      userAgent: navigator.userAgent,
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
      screen: { width: screen.width, height: screen.height },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      devicePixelRatio: window.devicePixelRatio
    });

    // Set up canvas for crisp drawing
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Set drawing properties
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e40af';
    
    // Clear with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    console.log('Canvas initialized:', { width: canvas.width, height: canvas.height });
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    console.log('Start drawing:', { 
      type: e.type, 
      isTouchEvent: 'touches' in e,
      touchCount: 'touches' in e ? e.touches.length : 0
    });
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width) / window.devicePixelRatio;
    const y = (clientY - rect.top) * (canvas.height / rect.height) / window.devicePixelRatio;

    console.log('Start position:', { clientX, clientY, x, y, rect });

    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width) / window.devicePixelRatio;
    const y = (clientY - rect.top) * (canvas.height / rect.height) / window.devicePixelRatio;

    ctx.lineTo(x, y);
    ctx.stroke();
    
    if (!hasSignature) {
      console.log('First signature stroke detected');
      setHasSignature(true);
    }
  }, [isDrawing, hasSignature]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  }, []);

  const saveSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) {
      console.log('Cannot save signature:', { canvas: !!canvas, hasSignature });
      alert('Please draw your signature first!');
      return;
    }

    // Create a new canvas with the display size for clean output
    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) return;

    // Set output canvas to display size
    const rect = canvas.getBoundingClientRect();
    outputCanvas.width = rect.width;
    outputCanvas.height = rect.height;

    // Fill with white background
    outputCtx.fillStyle = 'white';
    outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

    // Scale and draw the original canvas
    outputCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, outputCanvas.width, outputCanvas.height);

    const dataURL = outputCanvas.toDataURL('image/png', 1.0);
    console.log(' Signature saved successfully:', {
      length: dataURL.length,
      starts_with: dataURL.substring(0, 50),
      canvas_size: { width: outputCanvas.width, height: outputCanvas.height },
      has_data_prefix: dataURL.startsWith('data:image/png;base64,'),
      is_valid_length: dataURL.length > 1000 // Should be substantial if there's a real signature
    });
    
    // Show confirmation that signature was captured
    alert(`Signature captured! Data length: ${dataURL.length} characters`);
    
    onSignatureSave(dataURL);
  }, [hasSignature, onSignatureSave]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Add Your Digital Signature
        </h2>
        
        <div className="mb-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <canvas
              ref={canvasRef}
              className="w-full h-48 bg-white rounded border cursor-crosshair touch-none"
              style={{ 
                width: '100%', 
                height: '12rem', 
                maxWidth: '600px',
                touchAction: 'none',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                KhtmlUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none'
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            <Pen className="w-4 h-4 inline mr-1" />
            Draw your signature above using mouse or touch
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={clearSignature}
            disabled={!hasSignature}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
          
          <button
            onClick={saveSignature}
            disabled={!hasSignature}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Signature
          </button>
          
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};