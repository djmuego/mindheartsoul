
import { AppModule } from './types';
import { AdminDashboardScreen } from '../../components/screens/AdminDashboardScreen';

export const adminModule: AppModule = {
  id: 'admin',
  roles: ['admin'],
  routes: [
    { path: 'admin', element: <AdminDashboardScreen /> }
  ]
};
