
import { SubscriptionRecord, SubscriptionPlan } from '../types';
import { storage, STORAGE_KEYS } from './storage';

/**
 * Get active subscription for user
 */
export const getSubscription = (userId: string): SubscriptionRecord | undefined => {
  const subs = storage.getJSON<SubscriptionRecord[]>(STORAGE_KEYS.SUBSCRIPTION, []);
  return subs.find(s => s.userId === userId && s.status === 'active');
};

/**
 * Check if subscription is active (not expired)
 */
export const isSubscriptionActive = (subscription: SubscriptionRecord): boolean => {
  if (subscription.status !== 'active') return false;
  
  const now = Date.now();
  const expiryTime = new Date(subscription.expiresAtIso).getTime();
  
  // If expired, mark as expired
  if (now > expiryTime) {
    expireSubscription(subscription.userId);
    return false;
  }
  
  return true;
};

/**
 * Calculate expiry date based on plan
 */
const calculateExpiryDate = (plan: SubscriptionPlan, startDate: Date = new Date()): string => {
  const expiry = new Date(startDate);
  
  if (plan === 'pro_monthly') {
    // Add 1 month
    expiry.setMonth(expiry.getMonth() + 1);
  } else if (plan === 'pro_yearly') {
    // Add 1 year
    expiry.setFullYear(expiry.getFullYear() + 1);
  }
  
  return expiry.toISOString();
};

/**
 * Activate Pro subscription with plan
 */
export const activatePro = (
  userId: string, 
  plan: SubscriptionPlan = 'pro_monthly',
  paymentId?: string
): SubscriptionRecord => {
  const subs = storage.getJSON<SubscriptionRecord[]>(STORAGE_KEYS.SUBSCRIPTION, []);
  
  // Remove existing active sub if any
  const cleanSubs = subs.filter(s => s.userId !== userId || s.status !== 'active');
  
  const startDate = new Date();
  const newSub: SubscriptionRecord = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    plan,
    status: 'active',
    startedAtIso: startDate.toISOString(),
    expiresAtIso: calculateExpiryDate(plan, startDate),
    autoRenew: false, // Manual renewal for now
    renewalPaymentId: paymentId
  };
  
  cleanSubs.push(newSub);
  storage.setJSON(STORAGE_KEYS.SUBSCRIPTION, cleanSubs);
  return newSub;
};

/**
 * Renew existing subscription (extends expiry date)
 */
export const renewSubscription = (
  userId: string,
  paymentId?: string
): SubscriptionRecord | null => {
  const subs = storage.getJSON<SubscriptionRecord[]>(STORAGE_KEYS.SUBSCRIPTION, []);
  const index = subs.findIndex(s => s.userId === userId && s.status === 'active');
  
  if (index === -1) return null;
  
  const currentSub = subs[index];
  const currentExpiry = new Date(currentSub.expiresAtIso);
  
  // Extend from current expiry date (or now if already expired)
  const extendFrom = currentExpiry > new Date() ? currentExpiry : new Date();
  
  subs[index] = {
    ...currentSub,
    expiresAtIso: calculateExpiryDate(currentSub.plan, extendFrom),
    renewalPaymentId: paymentId
  };
  
  storage.setJSON(STORAGE_KEYS.SUBSCRIPTION, subs);
  return subs[index];
};

/**
 * Mark subscription as expired
 */
export const expireSubscription = (userId: string): void => {
  const subs = storage.getJSON<SubscriptionRecord[]>(STORAGE_KEYS.SUBSCRIPTION, []);
  const index = subs.findIndex(s => s.userId === userId && s.status === 'active');
  
  if (index >= 0) {
    subs[index].status = 'expired';
    storage.setJSON(STORAGE_KEYS.SUBSCRIPTION, subs);
  }
};

/**
 * Cancel Pro subscription (stops at expiry)
 */
export const cancelPro = (userId: string): void => {
  const subs = storage.getJSON<SubscriptionRecord[]>(STORAGE_KEYS.SUBSCRIPTION, []);
  const index = subs.findIndex(s => s.userId === userId && s.status === 'active');
  
  if (index >= 0) {
    subs[index].status = 'canceled';
    subs[index].autoRenew = false;
    storage.setJSON(STORAGE_KEYS.SUBSCRIPTION, subs);
  }
};

/**
 * Get subscription plan details (price, duration)
 */
export const getSubscriptionPlanDetails = (plan: SubscriptionPlan) => {
  const plans = {
    pro_monthly: {
      name: 'Monthly Pro',
      price: 9.99,
      duration: '1 month',
      durationDays: 30,
      savings: 0
    },
    pro_yearly: {
      name: 'Yearly Pro',
      price: 99.99,
      duration: '1 year',
      durationDays: 365,
      savings: 17 // 17% discount vs monthly
    }
  };
  
  return plans[plan];
};
