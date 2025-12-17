
import { Sparkles } from 'lucide-react';
import { AppModule } from './types';
import { NatalScreen } from '../../components/screens/NatalScreen';

export const natalModule: AppModule = {
  id: 'natal',
  nav: {
    placement: 'bottom',
    order: 30,
    icon: Sparkles,
    path: '/natal',
    labelKey: 'nav.natal'
  },
  routes: [
    { path: 'natal', element: <NatalScreen /> }
  ]
};
