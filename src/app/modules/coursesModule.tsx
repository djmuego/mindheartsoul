
import { AppModule } from './types';
import { CoursesScreen } from '../../components/screens/CoursesScreen';
import { CourseDetailScreen } from '../../components/screens/CourseDetailScreen';
import { LessonScreen } from '../../components/screens/LessonScreen';

export const coursesModule: AppModule = {
  id: 'courses',
  featureFlag: 'coursesEnabled',
  routes: [
    { path: 'courses', element: <CoursesScreen /> },
    { path: 'courses/:courseId', element: <CourseDetailScreen /> },
    { path: 'courses/:courseId/lessons/:lessonId', element: <LessonScreen /> }
  ]
};
