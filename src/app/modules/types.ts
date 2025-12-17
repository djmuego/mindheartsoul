
import React from 'react';
import { User, UserRole, FeatureFlagKey } from '../../types';

export type NavPlacement = 'bottom' | 'header' | 'none';

export interface RegistryContext {
  user: User | null;
  flags: Record<FeatureFlagKey, boolean>;
  isPro: boolean;
}

export interface GuardSpec {
  type: 'role' | 'entitlement' | 'feature';
  role?: UserRole;
  entitlement?: string;
  flag?: FeatureFlagKey;
}

export interface ModuleRoute {
  path: string;
  element: React.ReactNode;
  index?: boolean;
  layout?: 'scaffold' | 'fullscreen';
}

export interface ModuleNav {
  placement: NavPlacement;
  order: number;
  icon?: any; // React.ComponentType or LucideIcon
  path: string;
  labelKey?: string;
}

export interface ModuleHeaderAction {
  id: string;
  icon: any;
  path: string;
  order: number;
}

export interface AppModule {
  id: string;
  
  // Navigation
  nav?: ModuleNav;
  headerActions?: ModuleHeaderAction[];
  
  // Routing
  routes: ModuleRoute[];
  
  // Access Control / Gating
  requiresAuth?: boolean;
  minRole?: UserRole; // Legacy support
  requiresPro?: boolean; // Legacy support
  
  featureFlag?: FeatureFlagKey;
  roles?: UserRole[];
  entitlements?: { proOnly?: boolean };
  guards?: GuardSpec[];
}
