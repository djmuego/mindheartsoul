
import { AppModule } from './types';
import { HumanDesignScreen } from '../../components/screens/HumanDesignScreen';

export const humanDesignModule: AppModule = {
  id: 'human-design',
  featureFlag: 'humanDesignEnabled',
  routes: [
    { path: 'human-design', element: <HumanDesignScreen /> }
  ]
};
