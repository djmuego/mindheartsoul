
import { User } from 'lucide-react';
import { AppModule } from './types';
import { ProfileScreen } from '../../components/screens/ProfileScreen';

export const profileModule: AppModule = {
  id: 'profile',
  nav: {
    placement: 'bottom',
    order: 50,
    icon: User,
    path: '/profile',
    labelKey: 'nav.profile'
  },
  routes: [
    { path: 'profile', element: <ProfileScreen /> }
  ]
};
