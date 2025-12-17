import { HomeSectionDef } from './types';
import { UpcomingSessionSection } from './UpcomingSessionSection';
import { DailyInsightSection } from './DailyInsightSection';
import { RecommendedMentorsSection } from './RecommendedMentorsSection';
import { FeaturedContentSection } from './FeaturedContentSection';
import { CommunityHighlightsSection } from './CommunityHighlightsSection';
import { CTAProfileBirthDataSection } from './CTAProfileBirthDataSection';
import { ContinueLearningSection } from './ContinueLearningSection';
import { NotificationsPreviewSection } from './NotificationsPreviewSection';

/**
 * Home Sections Registry
 * 
 * Centralized configuration for all Home screen sections.
 * Sections are automatically filtered by:
 * - enabled flag
 * - user role (if roles specified)
 * - feature flags (if featureFlag specified)
 * - pro status (if requiresPro is true)
 * 
 * Sections are sorted by priority (lower number = higher priority)
 */
export const HOME_SECTIONS: HomeSectionDef[] = [
  {
    id: 'cta_profile_birth_data',
    enabled: true,
    component: CTAProfileBirthDataSection,
    priority: 10,
    // CTA for profile setup - show to all users
  },
  {
    id: 'continue_learning',
    enabled: true,
    component: ContinueLearningSection,
    priority: 15,
    // Continue learning - show last active course
  },
  {
    id: 'upcoming_session',
    enabled: true,
    component: UpcomingSessionSection,
    priority: 20,
    // Show upcoming sessions - for all authenticated users
  },
  {
    id: 'notifications_preview',
    enabled: true,
    component: NotificationsPreviewSection,
    priority: 25,
    // Latest notifications preview - for all users
  },
  {
    id: 'daily_insight',
    enabled: true,
    component: DailyInsightSection,
    priority: 30,
    // Daily insight - for all users
  },
  {
    id: 'featured_content',
    enabled: true,
    component: FeaturedContentSection,
    priority: 35,
    // Featured content - for all users
  },
  {
    id: 'recommended_mentors',
    enabled: true,
    component: RecommendedMentorsSection,
    priority: 40,
    // Recommended mentors - only for regular users
    roles: ['user'],
  },
  {
    id: 'community_highlights',
    enabled: true,
    component: CommunityHighlightsSection,
    priority: 50,
    // Community highlights - for all users
  }
];

/**
 * Helper function to filter sections based on user context
 * 
 * @param sections - Array of section definitions
 * @param userRole - Current user's role
 * @param featureFlags - Object with feature flag states
 * @param isPro - Whether user has Pro subscription
 * @returns Filtered and sorted array of sections
 */
export const getVisibleSections = (
  sections: HomeSectionDef[],
  userRole: string | undefined,
  featureFlags: Record<string, boolean>,
  isPro: boolean
): HomeSectionDef[] => {
  return sections
    .filter(section => {
      // Check if section is enabled
      if (!section.enabled) return false;

      // Check role requirement
      if (section.roles && section.roles.length > 0) {
        if (!userRole || !section.roles.includes(userRole as any)) {
          return false;
        }
      }

      // Check feature flag requirement
      if (section.featureFlag) {
        if (!featureFlags[section.featureFlag]) {
          return false;
        }
      }

      // Check Pro requirement
      if (section.requiresPro && !isPro) {
        return false;
      }

      return true;
    })
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));
};