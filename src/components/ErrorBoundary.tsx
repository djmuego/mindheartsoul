import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Copy, Check } from 'lucide-react';
import { useT } from '../i18n/useT';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

/**
 * Global Error Boundary
 * 
 * Catches unhandled errors in component tree and displays user-friendly fallback.
 * Provides "Reload" CTA and optional "Copy error details" for debugging.
 * 
 * Usage:
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console for development
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleCopyError = () => {
    const { error, errorInfo } = this.state;
    const errorText = `Error: ${error?.message}\n\nStack: ${error?.stack}\n\nComponent Stack: ${errorInfo?.componentStack}`;
    
    navigator.clipboard.writeText(errorText).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback 
        error={this.state.error}
        onReload={this.handleReload}
        onCopy={this.handleCopyError}
        copied={this.state.copied}
      />;
    }

    return this.props.children;
  }
}

/**
 * Error Fallback UI Component
 */
function ErrorFallback({ 
  error, 
  onReload, 
  onCopy, 
  copied 
}: { 
  error: Error | null;
  onReload: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  const t = useT();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle size={48} className="text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
            {t('error.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
            {t('error.message')}
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm font-mono text-red-800 dark:text-red-300 break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onReload}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              <RefreshCw size={20} />
              <span>{t('error.reload')}</span>
            </button>

            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={onCopy}
                className="w-full flex items-center justify-center space-x-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={20} />
                    <span>{t('error.copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    <span>{t('error.copyDetails')}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Help Text */}
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-6">
            {t('error.helpText')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
