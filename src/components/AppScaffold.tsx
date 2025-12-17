
import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Brand } from '../constants';
import { useT } from '../i18n/useT';
import { useSession } from '../context/SessionContext';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { useEntitlements } from '../hooks/useEntitlements';
import { getBottomNavModules, getHeaderActionModules } from '../app/modules/registry';
import { getUnreadCount } from '../services/notificationsService';

export const AppScaffold: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const t = useT();
  
  // Contexts
  const { user } = useSession();
  const { flags } = useFeatureFlags();
  const { isPro } = useEntitlements();

  const currentPath = location.pathname;
  const unreadCount = user ? getUnreadCount(user.id) : 0;

  // Compute Navigation Items based on Registry
  const { bottomNavItems, headerActions } = useMemo(() => {
    const ctx = { user, flags, isPro };
    return {
      bottomNavItems: getBottomNavModules(ctx),
      headerActions: getHeaderActionModules(ctx)
    };
  }, [user, flags, isPro]);

  return (
    <div className={`flex flex-col h-screen w-full bg-${Brand.colors.background} dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-200`}>
      {/* Top Navigation Bar */}
      <header className="flex-none h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-md mx-auto h-full flex items-center justify-between px-4">
          <button 
            onClick={() => navigate('/home')}
            className="focus:outline-none hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://www.genspark.ai/api/files/s/7S2sX1jN" 
              alt={Brand.name}
              className="h-8 object-contain"
            />
          </button>
          <div className="flex items-center space-x-2">
            {headerActions.map((item) => (
              <button 
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative
                  ${currentPath.includes(item.path) ? `text-${Brand.colors.primary} bg-indigo-50 dark:bg-indigo-900/20` : 'text-slate-600 dark:text-slate-300'}
                `}
              >
                {item.icon && <item.icon size={22} />}
                
                {/* Dynamic Badge Logic */}
                {item.id === 'notifications' && unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        <div className="max-w-md mx-auto min-h-full bg-white dark:bg-slate-900 shadow-xl overflow-hidden relative transition-colors duration-200">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 safe-area-pb transition-colors duration-200">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          {bottomNavItems.map((item) => {
            const isActive = currentPath.includes(item.path);
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200
                  ${isActive ? `text-${Brand.colors.primary} dark:text-indigo-400` : `text-${Brand.colors.textMuted} dark:text-slate-500`}
                  hover:bg-slate-50 dark:hover:bg-slate-800
                `}
              >
                {Icon && <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />}
                <span className="text-[10px] font-medium">{item.labelKey ? t(item.labelKey) : ''}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
