
import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  text: z.string(),
  createdAtIso: z.string(),
});

export const ConversationSchema = z.object({
  id: z.string(),
  type: z.enum(['mentor', 'ai']),
  title: z.string(),
  participantName: z.string().optional(),
  avatarUrl: z.string().optional(),
  lastMessageText: z.string().optional(),
  lastMessageAtIso: z.string(),
  unreadCount: z.number(),
});

export const MessageListSchema = z.array(MessageSchema);
export const ConversationListSchema = z.array(ConversationSchema);
