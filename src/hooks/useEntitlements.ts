
import { useSession } from '../context/SessionContext';
import { useFeatureFlags } from './useFeatureFlags';
import { getSubscription, isSubscriptionActive } from '../services/subscriptionService';

export const useEntitlements = () => {
  const { user } = useSession();
  const { flags } = useFeatureFlags();

  const subscription = user ? getSubscription(user.id) : undefined;
  
  // Check if subscription exists AND is not expired
  const isPro = subscription ? isSubscriptionActive(subscription) : false;

  return {
    isPro,
    subscription, // Expose subscription details (plan, expiry date)
    canUseAIGuideUnlimited: isPro,
    aiDailyLimit: isPro ? Infinity : 5,
    canAccessProCourses: isPro,
    features: flags
  };
};
