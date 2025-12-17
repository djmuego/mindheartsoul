import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ApiKeyWarningProps {
  serviceName?: string;
}

/**
 * Warning banner shown when API keys are missing or invalid.
 * Helps developers identify configuration issues without exposing keys.
 */
export const ApiKeyWarning: React.FC<ApiKeyWarningProps> = ({ 
  serviceName = 'AI' 
}) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Only show in development and if key is missing/placeholder
  if (import.meta.env.PROD) return null;
  if (apiKey && apiKey !== 'PLACEHOLDER_API_KEY') return null;

  return (
    <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start space-x-3">
      <AlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
          {serviceName} service unavailable
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
          Set <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">VITE_GEMINI_API_KEY</code> in <code>.env.local</code> to enable AI features.
        </p>
      </div>
    </div>
  );
};
