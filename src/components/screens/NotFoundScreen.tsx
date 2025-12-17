
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ArrowLeft } from 'lucide-react';
import { Brand } from '../../constants';

export const NotFoundScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-slate-50 dark:bg-slate-950">
      <div className="p-6 rounded-full bg-indigo-50 dark:bg-indigo-900/20 mb-6 text-indigo-400">
        <Map size={64} />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">404</h1>
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
        The path you are looking for does not exist in this realm.
      </p>
      
      <button
        onClick={() => navigate('/home')}
        className={`px-6 py-3 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center space-x-2`}
      >
        <ArrowLeft size={18} />
        <span>Return Home</span>
      </button>
    </div>
  );
};
