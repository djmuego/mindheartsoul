import React, { useMemo } from 'react';
import { useT } from '../../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../../context/SessionContext';
import { Bell, ArrowRight } from 'lucide-react';
import { getNotifications } from '../../../services/notificationsService';

export const NotificationsPreviewSection: React.FC = () => {
  const { user } = useSession();
  const t = useT();
  const navigate = useNavigate();

  const recentNotifications = useMemo(() => {
    if (!user) return [];
    const all = getNotifications(user.id);
    return all.slice(0, 3); // Show latest 3
  }, [user]);

  if (recentNotifications.length === 0) {
    // Empty state - no notifications yet
    return (
      <section>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          {t('notifications.title')}
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
          <Bell size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {t('home.noNotifications')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t('notifications.title')}
        </h2>
        <button
          onClick={() => navigate('/notifications')}
          className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
        >
          {t('home.viewAll')}
        </button>
      </div>

      <div className="space-y-2">
        {recentNotifications.map(notif => {
          const isRead = !!notif.readAtIso;
          return (
            <div
              key={notif.id}
              onClick={() => navigate('/notifications')}
              className={`bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border cursor-pointer hover:shadow-md transition-all ${
                isRead
                  ? 'border-slate-100 dark:border-slate-800'
                  : 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/10'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    isRead
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  <Bell size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                    {t(notif.titleKey)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {new Date(notif.createdAtIso).toLocaleDateString()} •{' '}
                    {new Date(notif.createdAtIso).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {!isRead && (
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/notifications')}
        className="w-full mt-3 text-indigo-600 dark:text-indigo-400 font-medium text-sm flex items-center justify-center space-x-1 hover:underline"
      >
        <span>{t('home.viewAll')}</span>
        <ArrowRight size={16} />
      </button>
    </section>
  );
};
