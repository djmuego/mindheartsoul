
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppModule, GuardSpec } from '../modules/types';
import { useSession } from '../../context/SessionContext';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import { useEntitlements } from '../../hooks/useEntitlements';
import { pushNotification } from '../../services/notificationsService';
import { AccessDeniedScreen } from '../../components/screens/AccessDeniedScreen';

interface RouteGuardProps {
  module: AppModule;
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ module, children }) => {
  const { user } = useSession();
  const { flags } = useFeatureFlags();
  const { isPro } = useEntitlements();
  const location = useLocation();
  const [accessDenied, setAccessDenied] = useState<{ reason: 'auth' | 'role' | 'entitlement' | 'feature', message?: string } | null>(null);

  // Normalize guards from module definition
  const guards: GuardSpec[] = [
    ...(module.guards || []),
    // Map legacy props to guards
    ...(module.roles ? [{ type: 'role' as const, role: module.roles[0] } as GuardSpec] : []), 
    ...(module.minRole ? [{ type: 'role' as const, role: module.minRole } as GuardSpec] : []),
    ...(module.entitlements?.proOnly || module.requiresPro ? [{ type: 'entitlement' as const, entitlement: 'pro' } as GuardSpec] : []),
    ...(module.featureFlag ? [{ type: 'feature' as const, flag: module.featureFlag } as GuardSpec] : []),
  ];

  useEffect(() => {
    let denied = null;

    // 1. Feature Flag Check (explicit property)
    if (module.featureFlag && !flags[module.featureFlag]) {
      denied = { reason: 'feature', message: `Feature ${module.featureFlag} is disabled` };
    }

    // 2. Guards Check
    if (!denied && guards.length > 0) {
      for (const guard of guards) {
        if (guard.type === 'role') {
           // Allow if user matches the guard role (or any if array logic was simpler, here simple match)
           // If module has multiple roles, usually implies "one of". 
           // For simple guard, we check strict match or presence.
           if (!user || (guard.role && user.role !== guard.role)) {
             denied = { reason: 'role', message: `Required Role: ${guard.role}` };
             break;
           }
        }
        if (guard.type === 'entitlement' && guard.entitlement === 'pro' && !isPro) {
           denied = { reason: 'entitlement', message: 'Pro subscription required' };
           break;
        }
        if (guard.type === 'feature' && guard.flag && !flags[guard.flag]) {
           denied = { reason: 'feature', message: `Feature ${guard.flag} disabled` };
           break;
        }
      }
    }

    if (denied) {
      setAccessDenied(denied as any);
      // Only push notification if logged in (avoid spamming guests)
      if (user) {
        pushNotification(user.id, 'system_alert', 'Access Denied', { reason: denied.message, path: location.pathname });
      }
    } else {
      setAccessDenied(null);
    }
  }, [module, user, flags, isPro, location.pathname]);

  if (accessDenied) {
    return <AccessDeniedScreen reason={accessDenied.reason} message={accessDenied.message} />;
  }

  return <>{children}</>;
};
