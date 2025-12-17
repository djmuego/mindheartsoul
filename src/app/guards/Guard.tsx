
import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole, FeatureFlagKey } from '../../types';
import { useSession } from '../../context/SessionContext';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import { useEntitlements } from '../../hooks/useEntitlements';

interface GuardProps {
  featureFlag?: FeatureFlagKey;
  roles?: UserRole[];
  entitlements?: { proOnly?: boolean };
  children: React.ReactNode;
}

export const Guard: React.FC<GuardProps> = ({ featureFlag, roles, entitlements, children }) => {
  const { user } = useSession();
  const { flags } = useFeatureFlags();
  const { isPro } = useEntitlements();

  // 1. Check Feature Flag
  if (featureFlag && !flags[featureFlag]) {
    // Ideally we would redirect to home or show a specific "Disabled" page
    // but redirecting to home is safe.
    return <Navigate to="/home" replace />;
  }

  // 2. Check Roles
  if (roles && roles.length > 0) {
    if (!user || !roles.includes(user.role)) {
      return <Navigate to="/home" replace />;
    }
  }

  // 3. Check Entitlements (e.g. Pro)
  if (entitlements?.proOnly && !isPro) {
    // Redirect to upgrade page instead of home
    return <Navigate to="/pro" replace />;
  }

  return <>{children}</>;
};
