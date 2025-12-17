
import { Heart } from 'lucide-react';
import { AppModule } from './types';
import { CommunityFeedScreen } from '../../components/screens/CommunityFeedScreen';
import { CommunityCreatePostScreen } from '../../components/screens/CommunityCreatePostScreen';
import { PostDetailScreen } from '../../components/screens/PostDetailScreen';

export const communityModule: AppModule = {
  id: 'community',
  featureFlag: 'communityEnabled',
  nav: {
    placement: 'bottom',
    order: 40,
    icon: Heart,
    path: '/community',
    labelKey: 'nav.community'
  },
  routes: [
    { path: 'community', element: <CommunityFeedScreen /> },
    { path: 'community/new', element: <CommunityCreatePostScreen /> },
    { path: 'post/:id', element: <PostDetailScreen /> }
  ]
};
