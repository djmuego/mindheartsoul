
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brand } from '../../constants';
import { ChevronLeft, Send, Lock } from 'lucide-react';
import { getConversationById, getMessages, sendMessage, Message, Conversation } from '../../services/chatService';
import { useSession } from '../../context/SessionContext';
import { useLanguage } from '../../context/LanguageContext';
import { useEntitlements } from '../../hooks/useEntitlements';
import { checkAiLimit } from '../../services/aiGuideService';

export const ChatThreadScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, birthProfile } = useSession();
  const { locale, t } = useLanguage();
  const { isPro } = useEntitlements();

  const [conversation, setConversation] = useState<Conversation | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLimitReached, setIsLimitReached] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const refreshChat = () => {
    if (id) {
       setConversation(getConversationById(id));
       setMessages(getMessages(id));
    }
  };

  useEffect(() => {
    refreshChat();
    // Check limits on load
    if (conversation?.type === 'ai' && user) {
      const { allowed } = checkAiLimit(user.id, isPro);
      setIsLimitReached(!allowed);
    }
    
    const interval = setInterval(refreshChat, 1000);
    return () => clearInterval(interval);
  }, [id, conversation?.type, isPro]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || !id) return;
    
    // Check limit again before sending
    if (conversation?.type === 'ai') {
      const { allowed } = checkAiLimit(user.id, isPro);
      if (!allowed) {
        setIsLimitReached(true);
        return;
      }
    }

    const text = inputText;
    setInputText('');
    
    try {
      await sendMessage(id, text, user, birthProfile, locale);
      // Re-check limit after send
      if (conversation?.type === 'ai') {
        const { allowed } = checkAiLimit(user.id, isPro);
        if (!allowed) setIsLimitReached(true);
      }
    } catch (e: any) {
      if (e.message === 'LIMIT_REACHED') setIsLimitReached(true);
    }
    
    refreshChat();
  };

  if (!conversation) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-3 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3 z-20">
        <button 
          onClick={() => navigate('/chat')} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <img 
          src={conversation.avatarUrl} 
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800" 
          alt={conversation.title} 
        />
        <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate flex-1">
          {conversation.title}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {messages.map(msg => {
           const isMe = msg.role === 'user';
           return (
             <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                 isMe 
                   ? `bg-${Brand.colors.primary} text-white rounded-tr-none` 
                   : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm'
               }`}>
                 {msg.text}
                 <p className={`text-[10px] mt-1 opacity-70 ${isMe ? 'text-indigo-100' : 'text-slate-400'}`}>
                   {new Date(msg.createdAtIso).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </p>
               </div>
             </div>
           );
         })}
         
         {isLimitReached && (
           <div className="flex justify-center my-4">
             <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-xl text-center max-w-xs shadow-inner">
               <Lock className="mx-auto mb-2 text-slate-500" size={20} />
               <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{t('ai.limitReached')}</p>
               <p className="text-xs text-slate-500 mb-3">{t('ai.upgradeToChat')}</p>
               <button 
                 onClick={() => navigate('/pro')}
                 className={`px-4 py-2 bg-gradient-to-r from-${Brand.colors.primary} to-${Brand.colors.secondary} text-white text-xs font-bold rounded-full`}
               >
                 {t('pro.upgrade')}
               </button>
             </div>
           </div>
         )}
         
         <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!isLimitReached && (
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 safe-area-pb">
           <div className="flex items-center space-x-2">
               <input
                 type="text"
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Type a message..."
                 className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-full focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
               />
               <button 
                 onClick={handleSend}
                 disabled={!inputText.trim()}
                 className={`p-3 bg-${Brand.colors.primary} text-white rounded-full disabled:opacity-50 hover:bg-indigo-700 transition-colors`}
               >
                 <Send size={20} />
               </button>
           </div>
        </div>
      )}
    </div>
  );
};
