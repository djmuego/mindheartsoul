
import { SubscriptionRecord } from '../types';
import { storage, STORAGE_KEYS } from './storage';

export const getSubscription = (userId: string): SubscriptionRecord | undefined => {
  const subs = storage.getJSON<SubscriptionRecord[]>(STORAGE_KEYS.SUBSCRIPTION, []);
  return subs.find(s => s.userId === userId && s.status === 'active');
};

export const activatePro = (userId: string): SubscriptionRecord => {
  const subs = storage.getJSON<SubscriptionRecord[]>(STORAGE_KEYS.SUBSCRIPTION, []);
  
  // Remove existing active sub if any
  const cleanSubs = subs.filter(s => s.userId !== userId || s.status !== 'active');
  
  const newSub: SubscriptionRecord = {
    id: `sub_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    plan: 'pro',
    status: 'active',
    startedAtIso: new Date().toISOString()
  };
  
  cleanSubs.push(newSub);
  storage.setJSON(STORAGE_KEYS.SUBSCRIPTION, cleanSubs);
  return newSub;
};

export const cancelPro = (userId: string): void => {
  const subs = storage.getJSON<SubscriptionRecord[]>(STORAGE_KEYS.SUBSCRIPTION, []);
  const index = subs.findIndex(s => s.userId === userId && s.status === 'active');
  
  if (index >= 0) {
    subs[index].status = 'canceled';
    subs[index].expiresAtIso = new Date().toISOString();
    storage.setJSON(STORAGE_KEYS.SUBSCRIPTION, subs);
  }
};
