
import { AppModule } from './types';
import { AdminDashboardScreen } from '../../components/screens/AdminDashboardScreen';
import { AdminReportsScreen } from '../../components/screens/AdminReportsScreen';

export const adminModule: AppModule = {
  id: 'admin',
  roles: ['admin'],
  routes: [
    { path: 'admin', element: <AdminDashboardScreen /> },
    { path: 'admin/reports', element: <AdminReportsScreen /> }
  ]
};
