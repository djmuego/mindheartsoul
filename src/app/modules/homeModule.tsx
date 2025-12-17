
import { Home } from 'lucide-react';
import { AppModule } from './types';
import { HomeScreen } from '../../components/screens/HomeScreen';

export const homeModule: AppModule = {
  id: 'home',
  nav: {
    placement: 'bottom',
    order: 10,
    icon: Home,
    path: '/home',
    labelKey: 'nav.home'
  },
  routes: [
    {
      path: 'home',
      element: <HomeScreen />,
      index: true
    }
  ]
};
