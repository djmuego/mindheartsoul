
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brand } from '../../constants';
import { ChevronLeft, Send, Lock } from 'lucide-react';
import { getConversationById, getMessagesByConversation, sendMessage, Message, Conversation } from '../../services/chatService';
import { getSubscription, isSubscriptionActive } from '../../services/subscriptionService';
import { useSession } from '../../context/SessionContext';
import { useLanguage } from '../../context/LanguageContext';


export const ChatThreadScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSession();
  const { t } = useLanguage();

  const [conversation, setConversation] = useState<Conversation | undefined | null>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLimitReached, setIsLimitReached] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const refreshChat = () => {
    if (id) {
       setConversation(getConversationById(id));
       setMessages(getMessagesByConversation(id));
    }
  };

  useEffect(() => {
    refreshChat();
    // Check limits on load
    if (user && id) {
       const sub = getSubscription(user.id);
       const isPro = sub && isSubscriptionActive(sub);
       // Optional: Check if they already hit a limit in previous session? 
       // For now, we reset limit state on reload unless we store it.
    }
    
    const interval = setInterval(refreshChat, 3000); // Reduced polling frequency
    return () => clearInterval(interval);
  }, [id, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || !id) return;
    
    const text = inputText;
    setInputText('');
    
    // 1. Send User Message (ALWAYS works, regardless of API key or Pro status)
    try {
      sendMessage({
        conversationId: id,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatarDataUrl,
        text: text
      });
      refreshChat();
    } catch (e: any) {
      console.error('Failed to send message:', e);
      // Basic error handling: show alert or set error state
      alert('Failed to send message. Please try again.');
      return;
    }
    
    // 2. Check if AI/Assistant conversation
    const isAIConversation = conversation?.participantIds.some(pid => 
      pid === 'support_bot' || pid.startsWith('ai_') || pid.startsWith('sys_')
    );

    // 3. AI Response Logic (only for AI conversations)
    if (isAIConversation && conversation) {
        const otherId = conversation.participantIds.find(pid => pid !== user.id);
        const otherIndex = conversation.participantIds.indexOf(otherId || '');
        const otherName = otherIndex >= 0 ? conversation.participantNames[otherIndex] : 'Assistant';
        const otherAvatar = otherIndex >= 0 ? conversation.participantAvatars?.[otherIndex] : undefined;

        // Check API key availability
        const hasAPIKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY);
        
        // Check Pro status
        const sub = getSubscription(user.id);
        const isPro = sub && isSubscriptionActive(sub);

        if (otherId) {
            setTimeout(() => {
                let response: string;

                if (!hasAPIKey) {
                    // No API key: friendly unavailable message
                    response = "AI assistant is temporarily unavailable. Please try again later or contact support.";
                } else if (!isPro) {
                    // Has API key but not Pro: upsell message
                    response = "AI insights are available for Pro members. Upgrade to continue our conversation!";
                    setIsLimitReached(true);
                } else {
                    // Pro user with API key: normal response
                    const responses = [
                        "That is an interesting perspective. Could you elaborate?",
                        "Based on your natal chart, this is a good time for reflection.",
                        "I hear you. How does this align with your goals?",
                        "Focus on your inner authority today.",
                        "Let's explore that further. What specific challenges are you facing?",
                        "This resonates with your Human Design profile.",
                        "I am here to support you on this journey."
                    ];
                    response = responses[Math.floor(Math.random() * responses.length)];
                }

                sendMessage({
                    conversationId: id,
                    senderId: otherId,
                    senderName: otherName,
                    senderAvatar: otherAvatar,
                    text: response
                });
                refreshChat();
            }, 1500 + Math.random() * 1000); // 1.5 - 2.5s delay
        }
    }
    
    // 4. For non-AI conversations (mentor, user-to-user), no auto-response needed
    // Messages just work, no gating
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
          src={user && conversation ? (conversation.participantIds[0] === user.id ? conversation.participantAvatars?.[1] : conversation.participantAvatars?.[0]) || `https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff` : ''}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800" 
          alt="User"
        />
        <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate flex-1">
          {user && conversation ? (conversation.participantIds[0] === user.id ? conversation.participantNames[1] : conversation.participantNames[0]) : 'Chat'}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {messages.map(msg => {
           const isMe = msg.senderId === user?.id;
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
