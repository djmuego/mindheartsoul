import { AppModule } from './types';
import { NumerologyScreen } from '../../components/screens/NumerologyScreen';

export const numerologyModule: AppModule = {
  id: 'numerology',
  // No nav item (accessed via Natal screen)
  routes: [
    { path: 'numerology', element: <NumerologyScreen /> }
  ]
};
