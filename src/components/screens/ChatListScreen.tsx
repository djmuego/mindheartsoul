
import React, { useEffect, useState } from 'react';
import { Brand } from '../../constants';
import { useT } from '../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import { seedChatIfEmpty, getConversationsByUser, Conversation } from '../../services/chatService';

export const ChatListScreen: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();
  const { user } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!user) return;
    
    console.log('[ChatList] Seeding chat for user:', user.id);
    seedChatIfEmpty(user.id, user.name);
    
    const loadConversations = () => {
      const convs = getConversationsByUser(user.id);
      console.log('[ChatList] Loaded conversations:', convs.length);
      setConversations(convs);
    };
    
    // Initial load
    loadConversations();
    
    // In a real app we'd subscribe to updates
    const interval = setInterval(loadConversations, 3000);
    
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h1 className={`text-2xl font-bold text-${Brand.colors.text} dark:text-white`}>{t('chat.title')}</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.map((convo) => {
          if (!user) return null;
          // Get the other participant's info
          const otherIndex = convo.participantIds[0] === user.id ? 1 : 0;
          const otherName = convo.participantNames[otherIndex];
          const otherAvatar = convo.participantAvatars?.[otherIndex] || `https://ui-avatars.com/api/?name=${otherName}&background=4f46e5&color=fff`;
          
          return (
            <div 
              key={convo.id} 
              onClick={() => navigate(`/chat/${convo.id}`)}
              className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800 cursor-pointer transition-colors"
            >
              <div className="relative">
                <img 
                  src={otherAvatar} 
                  alt={otherName} 
                  className="w-12 h-12 rounded-full object-cover bg-white dark:bg-slate-800"
                />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold truncate text-slate-900 dark:text-white">
                    {otherName}
                  </h3>
                  {convo.lastMessage && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                      {new Date(convo.lastMessage.createdAtIso).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  )}
                </div>
                <p className="text-sm truncate text-slate-500 dark:text-slate-400">
                  {convo.lastMessage?.text || 'Start chatting...'}
                </p>
              </div>
            </div>
          );
        })}
        
        {conversations.length === 0 && (
           <div className="p-8 text-center text-slate-400 dark:text-slate-600 mt-4">
            <p>{t('chat.noMessages')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
