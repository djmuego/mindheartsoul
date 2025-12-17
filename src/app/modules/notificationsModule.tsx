
import { Bell } from 'lucide-react';
import { AppModule } from './types';
import { NotificationsScreen } from '../../components/screens/NotificationsScreen';

export const notificationsModule: AppModule = {
  id: 'notifications',
  headerActions: [
    {
      id: 'notifications-action',
      icon: Bell,
      path: '/notifications',
      order: 10
    }
  ],
  routes: [
    { path: 'notifications', element: <NotificationsScreen /> }
  ]
};
