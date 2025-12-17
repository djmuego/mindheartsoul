
import { Home } from 'lucide-react';
import { AppModule } from './types';
import { HomeScreen } from '../../components/screens/HomeScreen';

export const homeModule: AppModule = {
  id: 'home',
  // nav: REMOVED - Home not in bottom nav for Chat Consultations product
  // Users land on /home but it's not in navigation tabs
  routes: [
    {
      path: 'home',
      element: <HomeScreen />,
      index: true
    }
  ]
};
