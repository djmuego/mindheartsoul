import React, { useEffect, useState } from 'react';
import { Brand } from '../../constants';
import { Heart, MessageCircle, Share2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import { useSession } from '../../context/SessionContext';
import { getPosts, hasUserLiked, toggleLike, seedCommunityIfEmpty } from '../../services/communityService';
import { CommunityPost } from '../../types';

export const CommunityFeedScreen: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'following'>('latest');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    seedCommunityIfEmpty();
    let loaded = getPosts();
    
    // Simple sorting/filtering logic
    if (activeTab === 'trending') {
      loaded = loaded.sort((a, b) => b.likeCount - a.likeCount);
    } else if (activeTab === 'following') {
      // Stub: just show latest for MVP, maybe filter by "no one" to simulate empty
      loaded = []; 
    }
    
    setPosts(loaded);
  }, [activeTab, refresh]);

  const handleLike = (e: React.MouseEvent, post: CommunityPost) => {
    e.stopPropagation();
    if (!user) return;
    toggleLike(post.id, user.id);
    setRefresh(r => r + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Stub
    alert("Link copied to clipboard!");
  };

  return (
    <div className="pb-6 bg-white dark:bg-slate-900 min-h-full transition-colors duration-200 relative">
      <div className="p-6 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10 border-b border-slate-100 dark:border-slate-800">
        <h1 className={`text-2xl font-bold text-${Brand.colors.text} dark:text-white`}>{t('community.title')}</h1>
        <div className="flex space-x-2 mt-4 overflow-x-auto no-scrollbar">
          {['latest', 'trending', 'following'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors whitespace-nowrap
                 ${activeTab === tab 
                   ? `bg-slate-900 dark:bg-white text-white dark:text-slate-900` 
                   : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                 }`}
             >
               {t(`community.${tab}`)}
             </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 pb-20">
        {posts.length === 0 && (
           <div className="p-12 text-center text-slate-400 dark:text-slate-500">
             {activeTab === 'following' ? "You aren't following anyone yet." : "No posts found."}
           </div>
        )}

        {posts.map((post) => {
          const isLiked = user ? hasUserLiked(post.id, user.id) : false;
          
          return (
            <div 
              key={post.id} 
              onClick={() => navigate(`/post/${post.id}`)}
              className="p-6 space-y-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={post.authorAvatarUrl || `https://ui-avatars.com/api/?name=${post.authorName}&background=random`} 
                  className="w-10 h-10 rounded-full object-cover" 
                  alt="User" 
                />
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{post.authorName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(post.createdAtIso).toLocaleDateString()}</p>
                </div>
              </div>
              
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed line-clamp-4">
                {post.text}
              </p>
              
              {post.imageUrl && (
                <div className="relative rounded-xl overflow-hidden w-full bg-slate-100 dark:bg-slate-800">
                  <img src={post.imageUrl} className="w-full h-auto max-h-64 object-cover" alt="Post content" />
                </div>
              )}

              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-2">
                <button 
                  onClick={(e) => handleLike(e, post)}
                  className={`flex items-center space-x-1 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                  <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                  <span className="text-sm">{post.likeCount}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                  <MessageCircle size={20} />
                  <span className="text-sm">{post.commentCount}</span>
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-1 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/community/new')}
        className={`fixed bottom-20 right-6 p-4 rounded-full bg-${Brand.colors.primary} text-white shadow-lg hover:bg-indigo-700 transition-all z-20`}
      >
        <Plus size={24} />
      </button>
    </div>
  );
};