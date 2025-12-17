
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, Eye, Trash2, Ban, X } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { 
  getAllReports, 
  getPostById, 
  hidePost, 
  deletePost, 
  banUser, 
  dismissReport 
} from '../../services/communityService';
import { Report, CommunityPost } from '../../types';

export const AdminReportsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [posts, setPosts] = useState<Map<string, CommunityPost | undefined>>(new Map());

  useEffect(() => {
    // Admin-only access
    if (user?.role !== 'admin') {
      navigate('/home');
      return;
    }

    refreshReports();
  }, [user, navigate]);

  const refreshReports = () => {
    const allReports = getAllReports();
    setReports(allReports);

    // Fetch associated posts
    const postsMap = new Map<string, CommunityPost | undefined>();
    allReports.forEach(report => {
      if (!postsMap.has(report.postId)) {
        postsMap.set(report.postId, getPostById(report.postId));
      }
    });
    setPosts(postsMap);
  };

  const handleHidePost = (postId: string) => {
    if (confirm('Hide this post? It will remain in database but be marked as hidden.')) {
      hidePost(postId);
      refreshReports();
    }
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Permanently delete this post and all its comments?')) {
      deletePost(postId);
      refreshReports();
    }
  };

  const handleBanUser = (userId: string, userName: string) => {
    if (confirm(`Ban user "${userName}"? All their posts will be hidden.`)) {
      banUser(userId);
      refreshReports();
    }
  };

  const handleDismiss = (reportId: string) => {
    dismissReport(reportId);
    refreshReports();
  };

  const getReasonLabel = (reason: Report['reason']) => {
    switch (reason) {
      case 'spam': return 'Spam';
      case 'abuse': return 'Abuse';
      case 'other': return 'Other';
    }
  };

  const getReasonColor = (reason: Report['reason']) => {
    switch (reason) {
      case 'spam': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'abuse': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'other': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate('/admin')} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center space-x-2">
          <AlertTriangle size={24} className="text-red-500" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Community Reports
          </h1>
        </div>
      </div>

      {/* Reports List */}
      <div className="p-6 space-y-4 flex-1 overflow-y-auto pb-24">
        {reports.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              No reports at the moment
            </p>
          </div>
        )}

        {reports.map(report => {
          const post = posts.get(report.postId);
          
          return (
            <div 
              key={report.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800"
            >
              {/* Report Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReasonColor(report.reason)}`}>
                    {getReasonLabel(report.reason)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(report.createdAtIso).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleDismiss(report.id)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Dismiss report"
                >
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              {/* Report Note */}
              {report.note && (
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    "{report.note}"
                  </p>
                </div>
              )}

              {/* Reported Post */}
              {post ? (
                <div className="mb-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                  <div className="flex items-start space-x-3 mb-2">
                    {post.authorAvatarUrl && (
                      <img 
                        src={post.authorAvatarUrl} 
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {post.authorName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(post.createdAtIso).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">
                    {post.text}
                  </p>
                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt="Post"
                      className="mt-3 rounded-lg max-h-48 w-full object-cover"
                    />
                  )}
                </div>
              ) : (
                <div className="mb-4 p-4 border border-red-200 dark:border-red-900/30 rounded-lg bg-red-50 dark:bg-red-900/10">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    ⚠️ Post not found (may have been deleted)
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {post && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleHidePost(post.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-lg font-medium text-sm transition-colors"
                  >
                    <Eye size={16} />
                    <span>Hide Post</span>
                  </button>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg font-medium text-sm transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete Post</span>
                  </button>

                  <button
                    onClick={() => handleBanUser(post.authorId, post.authorName)}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 rounded-lg font-medium text-sm transition-colors"
                  >
                    <Ban size={16} />
                    <span>Ban User</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
