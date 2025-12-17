
import { AppModule } from './types';
import { CommunityFeedScreen } from '../../components/screens/CommunityFeedScreen';
import { CommunityCreatePostScreen } from '../../components/screens/CommunityCreatePostScreen';
import { PostDetailScreen } from '../../components/screens/PostDetailScreen';

export const communityModule: AppModule = {
  id: 'community',
  featureFlag: 'communityEnabled', // Disabled by default (not in feature flags)
  // NAV REMOVED - Community is placeholder, not in bottom nav
  // Bottom nav limited to 4 items: Home, Mentors, Messages, Profile
  routes: [
    { path: 'community', element: <CommunityFeedScreen /> },
    { path: 'community/new', element: <CommunityCreatePostScreen /> },
    { path: 'post/:id', element: <PostDetailScreen /> }
  ]
};
