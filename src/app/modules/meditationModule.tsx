import { AppModule } from './types';
import { MeditationScreen } from '../../components/screens/MeditationScreen';
import { MeditationDetailScreen } from '../../components/screens/MeditationDetailScreen';

export const meditationModule: AppModule = {
  id: 'meditation',
  label: 'Meditation',
  i18nKey: 'meditation.title',
  
  // No nav item (accessed via Natal screen or direct link)
  nav: undefined,
  
  routes: [
    {
      path: '/meditation',
      element: <MeditationScreen />,
      layout: 'scaffold'
    },
    {
      path: '/meditation/:id',
      element: <MeditationDetailScreen />,
      layout: 'scaffold'
    }
  ],

  // Available to all users (free preview)
  requiresPro: false,
  roles: undefined,
  featureFlag: undefined
};
