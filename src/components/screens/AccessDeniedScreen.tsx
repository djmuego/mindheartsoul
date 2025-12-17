
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, Sparkles, Lock } from 'lucide-react';
import { Brand } from '../../constants';

interface AccessDeniedScreenProps {
  reason: 'auth' | 'role' | 'entitlement' | 'feature';
  message?: string;
}

export const AccessDeniedScreen: React.FC<AccessDeniedScreenProps> = ({ reason, message }) => {
  const navigate = useNavigate();

  const getContent = () => {
    switch (reason) {
      case 'entitlement':
        return {
          icon: Sparkles,
          title: 'Pro Feature Locked',
          desc: 'This feature is available exclusively to Pro members.',
          action: 'Upgrade to Pro',
          onAction: () => navigate('/pro'),
          color: 'text-yellow-500'
        };
      case 'role':
        return {
          icon: ShieldAlert,
          title: 'Access Denied',
          desc: message || 'You do not have permission to view this page.',
          action: 'Go Home',
          onAction: () => navigate('/home'),
          color: 'text-red-500'
        };
      case 'feature':
        return {
          icon: Lock,
          title: 'Feature Unavailable',
          desc: 'This feature is currently disabled or under maintenance.',
          action: 'Go Home',
          onAction: () => navigate('/home'),
          color: 'text-slate-500'
        };
      default:
        return {
          icon: ShieldAlert,
          title: 'Access Denied',
          desc: 'You are not authorized to access this page.',
          action: 'Go Home',
          onAction: () => navigate('/home'),
          color: 'text-red-500'
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className={`p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-6 ${content.color}`}>
        <Icon size={48} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{content.title}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">
        {content.desc}
      </p>
      
      <button
        onClick={content.onAction}
        className={`px-8 py-3 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all transform hover:scale-105`}
      >
        {content.action}
      </button>
      
      {reason !== 'role' && (
        <button 
          onClick={() => navigate('/home')}
          className="mt-4 flex items-center space-x-2 text-slate-400 hover:text-slate-600 text-sm font-medium"
        >
          <Home size={14} />
          <span>Back to Home</span>
        </button>
      )}
    </div>
  );
};
