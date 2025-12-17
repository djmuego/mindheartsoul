
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brand } from '../../constants';
import { ChevronLeft, Bell, CheckCircle } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { useSession } from '../../context/SessionContext';
import { getNotifications, markAsRead } from '../../services/notificationsService';
import { NotificationItem } from '../../types';

export const NotificationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();
  const { user } = useSession();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (user) {
      setNotifications(getNotifications(user.id));
    }
  }, [user]);

  const handleRead = (n: NotificationItem) => {
    markAsRead(n.id);
    // Optimistic update
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, readAtIso: new Date().toISOString() } : item));
    
    // Navigate if payload exists
    if (n.type === 'booking_confirmed' && n.payload?.bookingId) {
      navigate(`/booking/${n.payload.bookingId}`);
    }
  };

  return (
    <div className="min-h-full bg-white dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('notifications.title')}</h1>
      </div>

      <div className="p-4 flex-1">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Bell size={48} className="mb-4 opacity-50" />
            <p>{t('notifications.empty')}</p>
          </div>
        )}

        <div className="space-y-3">
          {notifications.map(n => (
            <div 
              key={n.id}
              onClick={() => handleRead(n)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors flex items-start space-x-3
                ${n.readAtIso 
                  ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' 
                  : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800'
                }`}
            >
              <div className={`p-2 rounded-full flex-shrink-0 ${n.readAtIso ? 'bg-slate-100 text-slate-400' : `bg-${Brand.colors.primary} text-white`}`}>
                <CheckCircle size={16} />
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${n.readAtIso ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                  {t(n.titleKey)}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(n.createdAtIso).toLocaleString()}
                </p>
              </div>
              {!n.readAtIso && <div className={`w-2 h-2 rounded-full bg-${Brand.colors.secondary}`}></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
