
import { NotificationItem, NotificationType } from '../types';
import { storage, STORAGE_KEYS } from './storage';

export const getNotifications = (userId: string): NotificationItem[] => {
  const all = storage.getJSON<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  return all
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime());
};

export const getUnreadCount = (userId: string): number => {
  const notifs = getNotifications(userId);
  return notifs.filter(n => !n.readAtIso).length;
};

export const markAsRead = (notificationId: string) => {
  const all = storage.getJSON<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const index = all.findIndex(n => n.id === notificationId);
  if (index >= 0) {
    all[index].readAtIso = new Date().toISOString();
    storage.setJSON(STORAGE_KEYS.NOTIFICATIONS, all);
  }
};

export const pushNotification = (
  userId: string, 
  type: NotificationType, 
  titleKey: string, 
  payload?: any
) => {
  const all = storage.getJSON<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  
  const newItem: NotificationItem = {
    id: `notif_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    titleKey,
    createdAtIso: new Date().toISOString(),
    payload
  };
  
  all.push(newItem);
  storage.setJSON(STORAGE_KEYS.NOTIFICATIONS, all);
};
