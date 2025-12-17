
import { useSession } from '../context/SessionContext';
import { useFeatureFlags } from './useFeatureFlags';
import { getSubscription } from '../services/subscriptionService';

export const useEntitlements = () => {
  const { user } = useSession();
  const { flags } = useFeatureFlags();

  const subscription = user ? getSubscription(user.id) : undefined;
  const isPro = !!subscription;

  return {
    isPro,
    canUseAIGuideUnlimited: isPro,
    aiDailyLimit: isPro ? Infinity : 5,
    canAccessProCourses: isPro,
    features: flags
  };
};
