
import { storage, STORAGE_KEYS } from './storage';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAtIso: string;
  readAtIso?: string;
}

export interface Conversation {
  id: string;
  participantIds: [string, string]; // Always 2 participants (User ↔ Mentor)
  participantNames: [string, string];
  participantAvatars?: [string?, string?];
  lastMessage?: {
    text: string;
    senderId: string;
    createdAtIso: string;
  };
  createdAtIso: string;
  updatedAtIso: string;
}

/**
 * Get or create conversation between two users
 */
export const getOrCreateConversation = (userId1: string, userId2: string, names: [string, string], avatars?: [string?, string?]): Conversation => {
  const conversations = storage.getJSON<Conversation[]>(STORAGE_KEYS.CHATS, []);
  
  // Find existing conversation
  const existing = conversations.find(c => 
    (c.participantIds[0] === userId1 && c.participantIds[1] === userId2) ||
    (c.participantIds[0] === userId2 && c.participantIds[1] === userId1)
  );

  if (existing) return existing;

  // Create new conversation
  const newConversation: Conversation = {
    id: `conv_${Date.now()}`,
    participantIds: [userId1, userId2],
    participantNames: names,
    participantAvatars: avatars,
    createdAtIso: new Date().toISOString(),
    updatedAtIso: new Date().toISOString(),
  };

  conversations.push(newConversation);
  storage.setJSON(STORAGE_KEYS.CHATS, conversations);
  return newConversation;
};

/**
 * Get all conversations for a user
 */
export const getConversationsByUser = (userId: string): Conversation[] => {
  const conversations = storage.getJSON<Conversation[]>(STORAGE_KEYS.CHATS, []);
  return conversations
    .filter(c => c.participantIds.includes(userId))
    .sort((a, b) => new Date(b.updatedAtIso).getTime() - new Date(a.updatedAtIso).getTime());
};

/**
 * Get conversation by ID
 */
export const getConversationById = (conversationId: string): Conversation | null => {
  const conversations = storage.getJSON<Conversation[]>(STORAGE_KEYS.CHATS, []);
  console.log('[chatService] getConversationById:', conversationId, 'found:', conversations.find(c => c.id === conversationId) ? 'yes' : 'no', 'total:', conversations.length);
  return conversations.find(c => c.id === conversationId) || null;
};

/**
 * Get messages for a conversation
 */
export const getMessagesByConversation = (conversationId: string): Message[] => {
  const messages = storage.getJSON<Message[]>(STORAGE_KEYS.MESSAGES, []);
  return messages
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAtIso).getTime() - new Date(b.createdAtIso).getTime());
};

/**
 * Send a message
 */
export const sendMessage = (data: {
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
}): Message => {
  const messages = storage.getJSON<Message[]>(STORAGE_KEYS.MESSAGES, []);
  
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    ...data,
    createdAtIso: new Date().toISOString(),
  };

  messages.push(newMessage);
  storage.setJSON(STORAGE_KEYS.MESSAGES, messages);

  // Update conversation's lastMessage
  updateConversationLastMessage(data.conversationId, newMessage);

  return newMessage;
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = (conversationId: string, userId: string): void => {
  const messages = storage.getJSON<Message[]>(STORAGE_KEYS.MESSAGES, []);
  const now = new Date().toISOString();

  messages.forEach(m => {
    if (m.conversationId === conversationId && m.senderId !== userId && !m.readAtIso) {
      m.readAtIso = now;
    }
  });

  storage.setJSON(STORAGE_KEYS.MESSAGES, messages);
};

/**
 * Get unread message count for user
 */
export const getUnreadCount = (userId: string): number => {
  const messages = storage.getJSON<Message[]>(STORAGE_KEYS.MESSAGES, []);
  const conversations = getConversationsByUser(userId);
  const conversationIds = conversations.map(c => c.id);

  return messages.filter(m => 
    conversationIds.includes(m.conversationId) &&
    m.senderId !== userId &&
    !m.readAtIso
  ).length;
};

/**
 * Update conversation's last message (internal)
 */
const updateConversationLastMessage = (conversationId: string, message: Message): void => {
  const conversations = storage.getJSON<Conversation[]>(STORAGE_KEYS.CHATS, []);
  const conversation = conversations.find(c => c.id === conversationId);

  if (conversation) {
    conversation.lastMessage = {
      text: message.text,
      senderId: message.senderId,
      createdAtIso: message.createdAtIso,
    };
    conversation.updatedAtIso = new Date().toISOString();
    storage.setJSON(STORAGE_KEYS.CHATS, conversations);
  }
};

/**
 * Seed demo conversations
 */
export const seedChatIfEmpty = (userId: string, userName: string): void => {
  const conversations = storage.getJSON<Conversation[]>(STORAGE_KEYS.CHATS, []);
  if (conversations.length > 0) return;

  // Create demo conversation with support
  const supportConv = getOrCreateConversation(
    userId,
    'support_bot',
    [userName, 'Support'],
    [undefined, 'https://ui-avatars.com/api/?name=Support&background=4f46e5&color=fff']
  );

  sendMessage({
    conversationId: supportConv.id,
    senderId: 'support_bot',
    senderName: 'Support',
    text: 'Welcome to MindHeartSoul! 👋 How can we help you today?',
  });
};
