
import { AppModule } from './types';
import { AstrologyScreen } from '../../components/screens/AstrologyScreen';

export const astrologyModule: AppModule = {
  id: 'astrology',
  featureFlag: 'astrologyEnabled',
  routes: [
    { path: 'astrology', element: <AstrologyScreen /> }
  ]
};
