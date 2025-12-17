import React from 'react';
import { UserRole } from '../../../types';

export type HomeSectionId = 
  | 'upcoming_session'
  | 'daily_insight'
  | 'recommended_mentors'
  | 'featured_content'
  | 'community_highlights'
  | 'cta_profile_birth_data';

export interface HomeSectionDef {
  id: HomeSectionId;
  titleKey?: string;
  enabled: boolean;
  component: React.FC;
  priority?: number;
  // Optional role-based access control
  roles?: UserRole[]; // If specified, only these roles can see this section
  // Optional feature flag requirement
  featureFlag?: string; // If specified, this feature flag must be enabled
  // Optional Pro requirement
  requiresPro?: boolean; // If true, only Pro users can see this section
}