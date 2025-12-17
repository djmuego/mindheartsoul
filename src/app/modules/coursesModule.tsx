
import { AppModule } from './types';
import { CoursesScreen } from '../../components/screens/CoursesScreen';
import { CourseDetailScreen } from '../../components/screens/CourseDetailScreen';
import { LessonScreen } from '../../components/screens/LessonScreen';
import { CourseManageScreen } from '../../components/screens/CourseManageScreen';
import { CourseEditScreen } from '../../components/screens/CourseEditScreen';

export const coursesModule: AppModule = {
  id: 'courses',
  featureFlag: 'coursesEnabled',
  routes: [
    { path: 'courses', element: <CoursesScreen /> },
    { path: 'courses/manage', element: <CourseManageScreen /> },
    { path: 'courses/:courseId', element: <CourseDetailScreen /> },
    { path: 'courses/:courseId/edit', element: <CourseEditScreen /> },
    { path: 'courses/:courseId/lessons/:lessonId', element: <LessonScreen /> }
  ]
};
