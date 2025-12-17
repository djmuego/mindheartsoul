
import { Sparkles } from 'lucide-react';
import { AppModule } from './types';
import { NatalScreen } from '../../components/screens/NatalScreen';

export const natalModule: AppModule = {
  id: 'natal',
  // NAV REMOVED - Natal Chart Hub accessible via Home screen
  // Bottom nav limited to 4 items: Home, Mentors, Messages, Profile
  routes: [
    { path: 'natal', element: <NatalScreen /> }
  ]
};
