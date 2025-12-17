
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit2, Trash2, Eye, Archive } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { 
  getCoursesByMentor, 
  createCourse, 
  deleteCourse,
  publishCourse,
  archiveCourse 
} from '../../services/coursesService';
import { Course } from '../../features/courses/types';

export const CourseManageScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const [courses, setCourses] = useState<Course[]>(() => 
    user ? getCoursesByMentor(user.id) : []
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!user || (user.role !== 'mentor' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Mentor or Admin role required</p>
        </div>
      </div>
    );
  }

  const refreshCourses = () => {
    setCourses(getCoursesByMentor(user.id));
  };

  const handleCreateCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createCourse({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as any,
      mentorId: user.id,
      mentorName: user.name,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400/250`,
      isProOnly: formData.get('isProOnly') === 'on',
    });

    setShowCreateModal(false);
    refreshCourses();
  };

  const handlePublish = (courseId: string) => {
    publishCourse(courseId);
    refreshCourses();
  };

  const handleArchive = (courseId: string) => {
    if (confirm('Archive this course? It will be hidden from users.')) {
      archiveCourse(courseId);
      refreshCourses();
    }
  };

  const handleDelete = (courseId: string) => {
    if (confirm('Delete this course permanently?')) {
      deleteCourse(courseId);
      refreshCourses();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Manage Courses</h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
        >
          <Plus size={18} />
          <span>New Course</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No courses yet. Create your first course!</p>
          </div>
        ) : (
          courses.map(course => (
            <div key={course.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.title}</h3>
                      {course.status === 'draft' && (
                        <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">Draft</span>
                      )}
                      {course.status === 'published' && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium rounded">Published</span>
                      )}
                      {course.status === 'archived' && (
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded">Archived</span>
                      )}
                      {course.isProOnly && (
                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-xs font-medium rounded">PRO</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{course.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{course.lessons.length} lessons</span>
                      <span>•</span>
                      <span>{course.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <button
                    onClick={() => navigate(`/courses/${course.id}/edit`)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>

                  {course.status !== 'published' ? (
                    <button
                      onClick={() => handlePublish(course.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg text-sm font-medium text-green-700 dark:text-green-300"
                    >
                      <Eye size={14} />
                      <span>Publish</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleArchive(course.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      <Archive size={14} />
                      <span>Archive</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(course.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg text-sm font-medium text-red-700 dark:text-red-300"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Astrology">Astrology</option>
                  <option value="Self-Care">Self-Care</option>
                  <option value="Spirituality">Spirituality</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isProOnly"
                  id="isProOnly"
                  className="rounded"
                />
                <label htmlFor="isProOnly" className="text-sm text-slate-700 dark:text-slate-300">Pro Members Only</label>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
