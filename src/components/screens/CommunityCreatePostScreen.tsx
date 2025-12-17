import React, { useState } from 'react';
import { Brand } from '../../constants';
import { ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useSession } from '../../context/SessionContext';
import { createPost } from '../../services/communityService';
import { LANGUAGES, Locale } from '../../i18n';

export const CommunityCreatePostScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const { user } = useSession();
  
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [postLang, setPostLang] = useState<Locale>(locale);

  const handlePublish = () => {
    if (!text.trim() || !user) return;
    createPost(user, text, imageUrl || undefined, postLang);
    navigate(-1);
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('community.create')}</h1>
        </div>
        
        <button
          onClick={handlePublish}
          disabled={!text.trim()}
          className={`px-4 py-2 rounded-full bg-${Brand.colors.primary} text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {t('common.publish')}
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col space-y-4">
         <div className="flex items-start space-x-3">
            <img 
               src={user?.avatarDataUrl || "https://picsum.photos/seed/me/200/200"} 
               className="w-10 h-10 rounded-full object-cover" 
               alt="User" 
             />
             <textarea
               value={text}
               onChange={(e) => setText(e.target.value)}
               placeholder={t('community.placeholder')}
               className="flex-1 bg-transparent text-lg text-slate-900 dark:text-white placeholder-slate-400 outline-none resize-none min-h-[200px]"
             />
         </div>

         {imageUrl && (
            <div className="relative w-full rounded-xl overflow-hidden mt-4">
              <img src={imageUrl} className="w-full h-auto" alt="Preview" />
              <button 
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full text-xs"
              >
                Remove
              </button>
            </div>
         )}

         <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                {t('community.imageUrl')}
              </label>
              <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                <ImageIcon size={20} className="text-slate-400 mr-3" />
                <input 
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div>
               <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Language
               </label>
               <select
                  value={postLang}
                  onChange={(e) => setPostLang(e.target.value as Locale)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
               >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
               </select>
            </div>
         </div>
      </div>
    </div>
  );
};