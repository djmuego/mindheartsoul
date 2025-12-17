
import { storage } from './storage';
import { generateAiReply } from './aiGuideService';
import { User, BirthProfile } from '../types';
import { ConversationListSchema, MessageListSchema } from '../schemas/chat.schema';

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  createdAtIso: string;
}

export interface Conversation {
  id: string;
  type: 'mentor' | 'ai';
  title: string;
  participantName?: string;
  avatarUrl?: string;
  lastMessageText?: string;
  lastMessageAtIso: string;
  unreadCount: number;
}

const CONVOS_KEY = 'mhs_conversations_v1';
const MESSAGES_KEY = 'mhs_messages_v1';

export const getConversations = (): Conversation[] => {
  const convos = storage.getValidatedJSON<Conversation[]>(CONVOS_KEY, ConversationListSchema, []);
  return convos.sort((a, b) => new Date(b.lastMessageAtIso).getTime() - new Date(a.lastMessageAtIso).getTime());
};

export const getConversationById = (id: string): Conversation | undefined => {
  return getConversations().find(c => c.id === id);
};

export const getMessages = (conversationId: string): Message[] => {
  const allMessages = storage.getValidatedJSON<Message[]>(MESSAGES_KEY, MessageListSchema, []);
  return allMessages
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAtIso).getTime() - new Date(b.createdAtIso).getTime());
};

export const sendMessage = async (
  conversationId: string, 
  text: string, 
  user: User, 
  birthProfile: BirthProfile | null, 
  locale: string
): Promise<Message> => {
  const allMessages = storage.getValidatedJSON<Message[]>(MESSAGES_KEY, MessageListSchema, []);
  const convos = getConversations();
  const convoIndex = convos.findIndex(c => c.id === conversationId);
  
  if (convoIndex === -1) throw new Error('Conversation not found');

  const userMsg: Message = {
    id: Math.random().toString(36).substr(2, 9),
    conversationId,
    role: 'user',
    text,
    createdAtIso: new Date().toISOString()
  };
  
  allMessages.push(userMsg);
  storage.setJSON(MESSAGES_KEY, allMessages);

  convos[convoIndex].lastMessageText = text;
  convos[convoIndex].lastMessageAtIso = userMsg.createdAtIso;
  storage.setJSON(CONVOS_KEY, convos);

  if (convos[convoIndex].type === 'ai') {
    generateAiReply({ text, locale, birthProfile, userName: user.name }).then(replyText => {
      const aiMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        conversationId,
        role: 'assistant',
        text: replyText,
        createdAtIso: new Date().toISOString()
      };
      
      const currentMessages = storage.getValidatedJSON<Message[]>(MESSAGES_KEY, MessageListSchema, []);
      currentMessages.push(aiMsg);
      storage.setJSON(MESSAGES_KEY, currentMessages);

      const currentConvos = getConversations();
      const idx = currentConvos.findIndex(c => c.id === conversationId);
      if (idx >= 0) {
        currentConvos[idx].lastMessageText = replyText;
        currentConvos[idx].lastMessageAtIso = aiMsg.createdAtIso;
        storage.setJSON(CONVOS_KEY, currentConvos);
      }
    });
  } else {
    setTimeout(() => {
       const mockReply: Message = {
        id: Math.random().toString(36).substr(2, 9),
        conversationId,
        role: 'assistant',
        text: "Thanks for your message! I'll get back to you shortly.",
        createdAtIso: new Date().toISOString()
      };
      const currentMessages = storage.getValidatedJSON<Message[]>(MESSAGES_KEY, MessageListSchema, []);
      currentMessages.push(mockReply);
      storage.setJSON(MESSAGES_KEY, currentMessages);
    }, 2000);
  }

  return userMsg;
};

export const seedChatsIfEmpty = () => {
  const convos = getConversations();
  if (convos.length > 0) return;

  const aiConvo: Conversation = {
    id: 'ai_guide',
    type: 'ai',
    title: 'AI Guide',
    participantName: 'AI Guide',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=MHS',
    lastMessageText: 'How can I guide you today?',
    lastMessageAtIso: new Date().toISOString(),
    unreadCount: 0
  };

  const mentorConvo: Conversation = {
    id: 'mentor_chat_1',
    type: 'mentor',
    title: 'Sarah Johnson',
    participantName: 'Sarah Johnson',
    avatarUrl: 'https://picsum.photos/seed/mentor1/200/200',
    lastMessageText: 'Looking forward to our session!',
    lastMessageAtIso: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 1
  };

  storage.setJSON(CONVOS_KEY, [aiConvo, mentorConvo]);
};
