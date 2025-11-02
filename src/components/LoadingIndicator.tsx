/**
 * By Franco Gutierrez
 * Date: November, 2025
 */

import React from 'react';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import type { UploadStatus } from '../types';

interface LoadingIndicatorProps {
  status: UploadStatus;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ status }) => {
  const getStatusMessage = () => {
    switch (status.status) {
      case 'uploading':
        return 'Uploading PDF...';
      case 'signing':
        return 'Signing document...';
      case 'completed':
        return 'Document signed successfully!';
      case 'error':
        return status.error || 'An error occurred';
      default:
        return '';
    }
  };

  const getProgressColor = () => {
    switch (status.status) {
      case 'uploading':
        return 'bg-blue-600';
      case 'signing':
        return 'bg-yellow-600';
      case 'completed':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (status.status === 'idle') {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            {status.status === 'error' ? (
              <div className="w-8 h-8 text-red-600">
                <AlertTriangle className="w-full h-full" />
              </div>
            ) : status.status === 'completed' ? (
              <div className="w-8 h-8 text-green-600">
                <CheckCircle className="w-full h-full" />
              </div>
            ) : (
              <div className="w-8 h-8">
                <Loader2 className="w-full h-full animate-spin text-blue-600" />
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="flex-1">
            <p className={`font-medium ${
              status.status === 'error' ? 'text-red-900' : 
              status.status === 'completed' ? 'text-green-900' : 
              'text-gray-900'
            }`}>
              {getStatusMessage()}
            </p>
            
            {/* Progress Bar */}
            {status.progress !== undefined && status.status !== 'completed' && status.status !== 'error' && (
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                    style={{ width: `${status.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{status.progress}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};