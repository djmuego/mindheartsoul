
import { Users } from 'lucide-react';
import { AppModule } from './types';
import { MentorsScreen } from '../../components/screens/MentorsScreen';
import { MentorProfileScreen } from '../../components/screens/MentorProfileScreen';
import { BookingScreen } from '../../components/screens/BookingScreen';
import { BookingConfirmScreen } from '../../components/screens/BookingConfirmScreen';
import { BookingDetailScreen } from '../../components/screens/BookingDetailScreen';
import { SessionJoinScreen } from '../../components/screens/SessionJoinScreen';

export const mentorsModule: AppModule = {
  id: 'mentors',
  nav: {
    placement: 'bottom',
    order: 20,
    icon: Users,
    path: '/mentors',
    labelKey: 'nav.mentors'
  },
  routes: [
    { path: 'mentors', element: <MentorsScreen /> },
    { path: 'mentors/:id', element: <MentorProfileScreen /> },
    { path: 'book/:mentorId', element: <BookingScreen /> },
    { path: 'book/confirm/:mentorId', element: <BookingConfirmScreen /> },
    { path: 'booking/:id', element: <BookingDetailScreen /> },
    { 
      path: 'sessions/:sessionId', 
      element: <SessionJoinScreen />,
      layout: 'fullscreen' // Video session is fullscreen
    }
  ]
};
