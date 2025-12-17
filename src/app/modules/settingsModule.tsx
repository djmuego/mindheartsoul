
import { AppModule } from './types';
import { SettingsScreen } from '../../components/screens/SettingsScreen';

export const settingsModule: AppModule = {
  id: 'settings',
  routes: [
    { path: 'settings', element: <SettingsScreen /> }
  ]
};
