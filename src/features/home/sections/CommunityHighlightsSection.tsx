import React, { useEffect, useState } from 'react';
import { useT } from '../../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { getPosts, seedCommunityIfEmpty } from '../../../services/communityService';
import { CommunityPost } from '../../../types';

export const CommunityHighlightsSection: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();
  const [latestPosts, setLatestPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    seedCommunityIfEmpty();
    setLatestPosts(getPosts().slice(0, 2));
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center mb-3">
         <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('community.title')}</h2>
         <button onClick={() => navigate('/community')} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{t('community.latest')}</button>
      </div>
      <div className="space-y-3">
        {latestPosts.map(post => (
           <div 
             key={post.id} 
             onClick={() => navigate(`/post/${post.id}`)}
             className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer"
           >
              <div className="flex items-center space-x-2 mb-2">
                 <img src={post.authorAvatarUrl || `https://ui-avatars.com/api/?name=${post.authorName}&background=random`} className="w-6 h-6 rounded-full" alt="User" />
                 <span className="text-xs font-semibold text-slate-900 dark:text-white">{post.authorName}</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-2">{post.text}</p>
              <div className="flex items-center text-xs text-slate-400 space-x-3">
                 <span className="flex items-center space-x-1"><MessageCircle size={14} /> <span>{post.commentCount}</span></span>
                 {post.tags?.[0] && <span className="text-indigo-500">#{post.tags[0]}</span>}
              </div>
           </div>
        ))}
      </div>
    </section>
  );
};