
import { describe, it, expect, beforeEach } from 'vitest';
import { pushNotification, getNotifications, getUnreadCount, markAsRead } from '../services/notificationsService';
import { storage, STORAGE_KEYS } from '../services/storage';

describe('Notifications Service', () => {
  beforeEach(() => {
    storage.remove(STORAGE_KEYS.NOTIFICATIONS);
  });

  it('pushes notification correctly', () => {
    pushNotification('u1', 'booking_confirmed', 'Test Title');
    const notifs = getNotifications('u1');
    expect(notifs).toHaveLength(1);
    expect(notifs[0].titleKey).toBe('Test Title');
  });

  it('counts unread notifications', () => {
    pushNotification('u1', 'system_alert', 'Alert 1');
    pushNotification('u1', 'system_alert', 'Alert 2');
    expect(getUnreadCount('u1')).toBe(2);
  });

  it('marks notification as read', () => {
    pushNotification('u1', 'system_alert', 'Alert 1');
    const notifs = getNotifications('u1');
    const id = notifs[0].id;
    
    markAsRead(id);
    expect(getUnreadCount('u1')).toBe(0);
    expect(getNotifications('u1')[0].readAtIso).toBeDefined();
  });
});
