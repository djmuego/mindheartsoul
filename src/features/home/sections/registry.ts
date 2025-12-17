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
// CHAT CONSULTATIONS ONLY - Simplified home sections
// Removed sections for disabled modules (Community, Courses, Astrology/Birth Data)
export const HOME_SECTIONS: HomeSectionDef[] = [
  {
    id: 'upcoming_session',
    enabled: true,
    component: UpcomingSessionSection,
    priority: 10,
    // Show upcoming mentor sessions - core feature
  },
  {
    id: 'recommended_mentors',
    enabled: true,
    component: RecommendedMentorsSection,
    priority: 20,
    // Recommend mentors for consultation - core feature
    roles: ['user'],
  },
  {
    id: 'notifications_preview',
    enabled: true,
    component: NotificationsPreviewSection,
    priority: 30,
    // Latest notifications (booking confirmations, etc)
  },
  {
    id: 'daily_insight',
    enabled: true,
    component: DailyInsightSection,
    priority: 40,
    // Daily motivational insight - keeps UI friendly
  },
  // DISABLED for Chat Consultations product:
  // - cta_profile_birth_data (birth profile for Astrology/HD)
  // - continue_learning (Courses disabled)
  // - featured_content (content modules disabled)
  // - community_highlights (Community disabled)
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