
import { User } from 'lucide-react';
import { AppModule } from './types';
import { ProfileScreen } from '../../components/screens/ProfileScreen';

export const profileModule: AppModule = {
  id: 'profile',
  nav: {
    placement: 'bottom',
    order: 40, // Home(10) → Mentors(20) → Messages(30) → Profile(40)
    icon: User,
    path: '/profile',
    labelKey: 'nav.profile'
  },
  routes: [
    { path: 'profile', element: <ProfileScreen /> }
  ]
};
