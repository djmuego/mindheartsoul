
import { AppModule } from './types';
import { ProScreen } from '../../components/screens/ProScreen';

export const proModule: AppModule = {
  id: 'pro',
  featureFlag: 'proEnabled',
  routes: [
    { path: 'pro', element: <ProScreen /> }
  ]
};
