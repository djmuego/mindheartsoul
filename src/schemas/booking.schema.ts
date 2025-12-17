
import { z } from 'zod';

export const BookingStatusSchema = z.enum(['pending_payment', 'confirmed', 'cancelled', 'completed']);

export const BookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  mentorId: z.string(),
  sessionTypeId: z.string(),
  startsAtIso: z.string(),
  endsAtIso: z.string(),
  note: z.string().optional(),
  status: BookingStatusSchema,
  meetingUrl: z.string().optional(),
  createdAtIso: z.string(),
  paymentId: z.string().optional(),
});

export const BookingListSchema = z.array(BookingSchema);
