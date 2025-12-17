import React from 'react';

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
}