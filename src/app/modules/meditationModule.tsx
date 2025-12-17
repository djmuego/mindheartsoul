import { AppModule } from './types';
import { MeditationScreen } from '../../components/screens/MeditationScreen';
import { MeditationDetailScreen } from '../../components/screens/MeditationDetailScreen';

export const meditationModule: AppModule = {
  id: 'meditation',
  // No nav item (accessed via Natal screen)
  
  routes: [
    { path: 'meditation', element: <MeditationScreen /> },
    { path: 'meditation/:id', element: <MeditationDetailScreen /> }
  ]
};
