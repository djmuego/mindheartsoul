import { Calendar } from 'lucide-react';
import { AppModule } from './types';
import { MySessionsScreen } from '../../components/screens/MySessionsScreen';

export const sessionsModule: AppModule = {
  id: 'sessions',
  // NAV REMOVED - Sessions accessible via Profile screen
  // Bottom nav limited to 4 items: Home, Mentors, Messages, Profile
  routes: [
    { path: 'sessions', element: <MySessionsScreen /> }
  ]
};
