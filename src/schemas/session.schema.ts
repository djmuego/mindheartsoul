
import { z } from 'zod';

export const UserRoleSchema = z.enum(['seeker', 'mentor', 'mentor_pending', 'admin']);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  avatarDataUrl: z.string().optional(),
  createdAtIso: z.string().optional(),
});

export const BirthProfileSchema = z.object({
  fullName: z.string().optional(),
  birthDate: z.string(),
  birthTime: z.string(),
  birthCity: z.string(),
  tzOffsetMinutes: z.number(),
  savedAt: z.string(),
});

export const SubscriptionRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  plan: z.literal('pro'),
  status: z.enum(['active', 'canceled', 'expired']),
  startedAtIso: z.string(),
  expiresAtIso: z.string().optional(),
});
