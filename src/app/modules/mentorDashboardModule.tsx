
import { AppModule } from './types';
import { MentorDashboardScreen } from '../../components/screens/MentorDashboardScreen';
import { MentorAvailabilityScreen } from '../../components/screens/MentorAvailabilityScreen';
import { MentorBookingsScreen } from '../../components/screens/MentorBookingsScreen';

export const mentorDashboardModule: AppModule = {
  id: 'mentor-dashboard',
  roles: ['mentor'],
  routes: [
    { path: 'mentor', element: <MentorDashboardScreen /> },
    { path: 'mentor/availability', element: <MentorAvailabilityScreen /> },
    { path: 'mentor/bookings', element: <MentorBookingsScreen /> }
  ]
};
