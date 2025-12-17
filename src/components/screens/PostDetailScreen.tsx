import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { Brand } from '../../constants';
import { ChevronLeft, Heart, MessageCircle, Share2, Flag, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSession } from '../../context/SessionContext';
import { getPostById, getComments, addComment, hasUserLiked, toggleLike, reportPost } from '../../services/communityService';
import { CommunityPost, Comment } from '../../types';

export const PostDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useSession();

  const [post, setPost] = useState<CommunityPost | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  useEffect(() => {
    if (id) {
      setPost(getPostById(id));
      setComments(getComments(id));
    }
  }, [id]);

  if (!post) return <div className="p-8 text-center">Post not found</div>;

  const isLiked = user ? hasUserLiked(post.id, user.id) : false;

  const handleLike = () => {
    if (!user) return;
    toggleLike(post.id, user.id);
    setPost(getPostById(post.id)); // update local state
  };

  const handleSendComment = () => {
    if (!newComment.trim() || !user) return;
    addComment(post.id, user, newComment);
    setNewComment('');
    setComments(getComments(post.id));
    setPost(getPostById(post.id)); // update counts
  };

  const handleReport = (reason: 'spam' | 'abuse' | 'other') => {
    if (user) {
      reportPost(post.id, user.id, reason);
      setShowReportModal(false);
      alert(t('community.reported'));
    }
  };

  const handleShare = async () => {
    if (!post) return;
    const url = `${window.location.origin}/#/post/${post.id}`;
    const text = `${post.authorName}: ${post.text}\n${url}`;
    try {
        await navigator.clipboard.writeText(text);
        alert("Post link copied to clipboard!"); 
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Post</h1>
        <button 
          onClick={() => setShowReportModal(true)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <Flag size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
         {/* Post Content */}
         <div className="bg-white dark:bg-slate-900 p-6 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3 mb-4">
               <img 
                 src={post.authorAvatarUrl || `https://ui-avatars.com/api/?name=${post.authorName}&background=random`} 
                 className="w-10 h-10 rounded-full object-cover" 
                 alt="User" 
               />
               <div>
                 <p className="font-semibold text-slate-900 dark:text-white">{post.authorName}</p>
                 <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(post.createdAtIso).toLocaleString()}</p>
               </div>
            </div>
            
            <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed mb-4 whitespace-pre-wrap">
              {post.text}
            </p>

            {post.imageUrl && (
               <div className="relative rounded-xl overflow-hidden w-full bg-slate-100 dark:bg-slate-800 mb-4">
                 <img src={post.imageUrl} className="w-full h-auto" alt="Content" />
               </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
               {post.tags?.map(tag => (
                  <span key={tag} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">#{tag}</span>
               ))}
            </div>

            <div className="flex items-center space-x-6 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                  <Heart size={22} className={isLiked ? 'fill-current' : ''} />
                  <span className="font-medium">{post.likeCount}</span>
                </button>
                <div className="flex items-center space-x-2">
                  <MessageCircle size={22} />
                  <span className="font-medium">{post.commentCount}</span>
                </div>
                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-2 hover:text-indigo-500 dark:hover:text-indigo-400"
                >
                  <Share2 size={22} />
                </button>
            </div>
         </div>

         {/* Comments */}
         <div className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4">{t('community.comments')}</h3>
            
            <div className="space-y-6">
               {comments.length === 0 && <p className="text-slate-400 italic text-sm">No comments yet. Be the first!</p>}
               
               {comments.map(comment => (
                  <div key={comment.id} className="flex space-x-3">
                     <img 
                       src={comment.authorAvatarUrl || `https://ui-avatars.com/api/?name=${comment.authorName}&background=random`} 
                       className="w-8 h-8 rounded-full object-cover flex-shrink-0" 
                       alt="User" 
                     />
                     <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 rounded-tl-none">
                        <div className="flex justify-between items-baseline mb-1">
                           <span className="font-semibold text-sm text-slate-900 dark:text-white">{comment.authorName}</span>
                           <span className="text-[10px] text-slate-400">{new Date(comment.createdAtIso).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{comment.text}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Comment Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20 safe-area-pb">
         <div className="flex items-center space-x-2">
             <input
               type="text"
               value={newComment}
               onChange={(e) => setNewComment(e.target.value)}
               placeholder={t('community.addComment')}
               className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-full focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
               onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
             />
             <button 
               onClick={handleSendComment}
               disabled={!newComment.trim()}
               className="p-3 bg-indigo-600 text-white rounded-full disabled:opacity-50"
             >
               <Send size={20} />
             </button>
         </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-2xl p-6 shadow-xl">
               <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">{t('community.reportReason')}</h3>
               <div className="space-y-2">
                  <button onClick={() => handleReport('spam')} className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {t('community.reportSpam')}
                  </button>
                  <button onClick={() => handleReport('abuse')} className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {t('community.reportAbuse')}
                  </button>
                  <button onClick={() => handleReport('other')} className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {t('community.reportOther')}
                  </button>
               </div>
               <button 
                 onClick={() => setShowReportModal(false)}
                 className="mt-4 w-full py-2 text-slate-500 font-medium"
               >
                 Cancel
               </button>
            </div>
         </div>
      )}
    </div>
  );
};