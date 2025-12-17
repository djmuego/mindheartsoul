import { AppModule } from './types';
import { NumerologyScreen } from '../../components/screens/NumerologyScreen';

export const numerologyModule: AppModule = {
  id: 'numerology',
  label: 'Numerology',
  i18nKey: 'numerology.title',
  
  // No nav item (accessed via Natal screen)
  nav: undefined,
  
  routes: [
    {
      path: '/numerology',
      element: <NumerologyScreen />,
      layout: 'scaffold'
    }
  ],

  // Available to all users (free preview, full content may be Pro)
  requiresPro: false,
  roles: undefined,
  featureFlag: undefined
};
