import { Calendar } from 'lucide-react';
import { AppModule } from './types';
import { MySessionsScreen } from '../../components/screens/MySessionsScreen';

export const sessionsModule: AppModule = {
  id: 'sessions',
  nav: {
    placement: 'bottom',
    order: 25, // Between Mentors(20) and Messages(30)
    icon: Calendar,
    path: '/sessions',
    labelKey: 'nav.sessions'
  },
  routes: [
    { path: 'sessions', element: <MySessionsScreen /> }
  ]
};
