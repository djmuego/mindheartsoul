
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { 
  getCourseById, 
  updateCourse,
  createLesson,
  updateLesson,
  deleteLesson 
} from '../../services/coursesService';
import { Course, Lesson } from '../../features/courses/types';

export const CourseEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(() => 
    courseId ? getCourseById(courseId) || null : null
  );
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  if (!course) {
    return <div className="p-8 text-center">Course not found</div>;
  }

  if (!user || (user.role !== 'mentor' && user.role !== 'admin')) {
    return <div className="p-8 text-center">Access Denied</div>;
  }

  const refreshCourse = () => {
    if (courseId) {
      const updated = getCourseById(courseId);
      if (updated) setCourse(updated);
    }
  };

  const handleUpdateCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    updateCourse(course.id, {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as any,
      isProOnly: formData.get('isProOnly') === 'on',
    });

    refreshCourse();
  };

  const handleSaveLesson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (editingLesson) {
      updateLesson(course.id, editingLesson.id, {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        durationMin: parseInt(formData.get('durationMin') as string),
      });
    } else {
      createLesson(course.id, {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        durationMin: parseInt(formData.get('durationMin') as string),
      });
    }

    setShowLessonModal(false);
    setEditingLesson(null);
    refreshCourse();
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (confirm('Delete this lesson?')) {
      deleteLesson(course.id, lessonId);
      refreshCourse();
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowLessonModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate('/courses/manage')} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Edit Course</h1>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Course Details */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Course Details</h2>
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input
                name="title"
                type="text"
                defaultValue={course.title}
                required
                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea
                name="description"
                defaultValue={course.description}
                required
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                name="category"
                defaultValue={course.category}
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
                defaultChecked={course.isProOnly}
                className="rounded"
              />
              <label htmlFor="isProOnly" className="text-sm text-slate-700 dark:text-slate-300">Pro Members Only</label>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Lessons */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lessons ({course.lessons.length})</h2>
            <button
              onClick={() => {
                setEditingLesson(null);
                setShowLessonModal(true);
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
            >
              <Plus size={16} />
              <span>Add Lesson</span>
            </button>
          </div>

          {course.lessons.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">No lessons yet. Add your first lesson!</p>
          ) : (
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <GripVertical size={18} className="text-slate-400 cursor-move" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">{index + 1}. {lesson.title}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{lesson.durationMin} min</div>
                  </div>
                  <button
                    onClick={() => handleEditLesson(lesson)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <Edit2 size={16} className="text-slate-600 dark:text-slate-300" />
                  </button>
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                  >
                    <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
            </h2>
            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  name="title"
                  type="text"
                  defaultValue={editingLesson?.title}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (minutes)</label>
                <input
                  name="durationMin"
                  type="number"
                  defaultValue={editingLesson?.durationMin || 10}
                  required
                  min="1"
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content (Markdown supported)</label>
                <textarea
                  name="content"
                  defaultValue={editingLesson?.content}
                  required
                  rows={10}
                  placeholder="# Lesson Title&#10;&#10;Your content here...&#10;&#10;## Key Points&#10;* Point 1&#10;* Point 2"
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowLessonModal(false);
                    setEditingLesson(null);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                >
                  {editingLesson ? 'Save Changes' : 'Add Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
