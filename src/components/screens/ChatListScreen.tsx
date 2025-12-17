
import React, { useEffect, useState } from 'react';
import { Brand } from '../../constants';
import { useT } from '../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { seedChatsIfEmpty, getConversations, Conversation } from '../../services/chatService';

export const ChatListScreen: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    seedChatsIfEmpty();
    // In a real app we'd subscribe to updates
    const interval = setInterval(() => {
       setConversations(getConversations());
    }, 1000);
    setConversations(getConversations());
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h1 className={`text-2xl font-bold text-${Brand.colors.text} dark:text-white`}>{t('chat.title')}</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.map((convo) => (
          <div 
            key={convo.id} 
            onClick={() => navigate(`/chat/${convo.id}`)}
            className={`flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800 cursor-pointer transition-colors ${convo.type === 'ai' ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
          >
            <div className="relative">
              <img 
                src={convo.avatarUrl} 
                alt={convo.title} 
                className="w-12 h-12 rounded-full object-cover bg-white dark:bg-slate-800"
              />
              {convo.unreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                   {convo.unreadCount}
                 </span>
              )}
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className={`font-semibold truncate ${convo.type === 'ai' ? `text-${Brand.colors.primary} dark:text-indigo-400` : 'text-slate-900 dark:text-white'}`}>
                  {convo.title}
                </h3>
                <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                  {new Date(convo.lastMessageAtIso).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className={`text-sm truncate ${convo.unreadCount > 0 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                {convo.lastMessageText}
              </p>
            </div>
          </div>
        ))}
        
        {conversations.length === 0 && (
           <div className="p-8 text-center text-slate-400 dark:text-slate-600 mt-4">
            <p>{t('chat.noMessages')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
