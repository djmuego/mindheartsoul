
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Plus } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { useT } from '../../i18n/useT';
import { getConversationsByUser, seedChatIfEmpty, Conversation } from '../../services/chatService';
import { MOCK_MENTORS } from '../../services/mockData';
import { Mentor } from '../../types';

export const ChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const t = useT();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  useEffect(() => {
    if (user) {
      seedChatIfEmpty(user.id, user.name);
      refreshConversations();
    }
  }, [user]);

  const refreshConversations = () => {
    if (user) {
      setConversations(getConversationsByUser(user.id));
    }
  };

  const getOtherParticipant = (conv: Conversation) => {
    const otherIndex = conv.participantIds[0] === user?.id ? 1 : 0;
    return {
      id: conv.participantIds[otherIndex],
      name: conv.participantNames[otherIndex],
      avatar: conv.participantAvatars?.[otherIndex],
    };
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('chat.title')}</h1>
        <button
          onClick={() => setShowNewChatModal(true)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
        >
          <Plus size={24} className="text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">No conversations yet</p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
            >
              Start a conversation
            </button>
          </div>
        ) : (
          conversations.map(conv => {
            const other = getOtherParticipant(conv);
            const isUnread = conv.lastMessage?.senderId !== user.id && conv.lastMessage;

            return (
              <button
                key={conv.id}
                onClick={() => navigate(`/chat/${conv.id}`)}
                className="w-full flex items-center space-x-3 p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <div className="relative">
                  <img
                    src={other.avatar || `https://ui-avatars.com/api/?name=${other.name}`}
                    alt={other.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {isUnread && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-900"></div>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {other.name}
                    </h3>
                    {conv.lastMessage && (
                      <span className="text-xs text-slate-400">
                        {formatTime(conv.lastMessage.createdAtIso)}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className={`text-sm line-clamp-1 ${isUnread ? 'text-slate-600 dark:text-slate-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                      {conv.lastMessage.senderId === user.id && 'You: '}
                      {conv.lastMessage.text}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Start New Conversation</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {MOCK_MENTORS.map((mentor: Mentor) => (
                <button
                  key={mentor.id}
                  onClick={() => {
                    navigate(`/chat/new?mentorId=${mentor.id}&mentorName=${encodeURIComponent(mentor.name)}`);
                    setShowNewChatModal(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                >
                  <img
                    src={mentor.avatarUrl || `https://ui-avatars.com/api/?name=${mentor.name}`}
                    alt={mentor.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 dark:text-white">{mentor.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{mentor.title}</div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNewChatModal(false)}
              className="mt-4 w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
