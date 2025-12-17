import { HomeSectionDef } from './types';
import { UpcomingSessionSection } from './UpcomingSessionSection';
import { DailyInsightSection } from './DailyInsightSection';
import { RecommendedMentorsSection } from './RecommendedMentorsSection';
import { FeaturedContentSection } from './FeaturedContentSection';
import { CommunityHighlightsSection } from './CommunityHighlightsSection';
import { CTAProfileBirthDataSection } from './CTAProfileBirthDataSection';

export const HOME_SECTIONS: HomeSectionDef[] = [
  {
    id: 'cta_profile_birth_data',
    enabled: true,
    component: CTAProfileBirthDataSection,
    priority: 10
  },
  {
    id: 'upcoming_session',
    enabled: true,
    component: UpcomingSessionSection,
    priority: 20
  },
  {
    id: 'daily_insight',
    enabled: true,
    component: DailyInsightSection,
    priority: 30
  },
  {
    id: 'featured_content',
    enabled: true,
    component: FeaturedContentSection,
    priority: 35
  },
  {
    id: 'recommended_mentors',
    enabled: true,
    component: RecommendedMentorsSection,
    priority: 40
  },
  {
    id: 'community_highlights',
    enabled: true,
    component: CommunityHighlightsSection,
    priority: 50
  }
];