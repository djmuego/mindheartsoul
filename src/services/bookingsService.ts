
import { Booking, BookingStatus } from '../types';
import { mulberry32, hashStringToSeed } from '../utils/seededRandom';
import { storage } from './storage';
import { BookingListSchema } from '../schemas/booking.schema';

const STORAGE_KEY = 'mhs_bookings_v1';

export const getBookings = (): Booking[] => {
  return storage.getValidatedJSON<Booking[]>(STORAGE_KEY, BookingListSchema, []);
};

export const getBookingById = (id: string): Booking | undefined => {
  const all = getBookings();
  return all.find(b => b.id === id);
};

export const getBookingsByUser = (userId: string): Booking[] => {
  const all = getBookings();
  return all
    .filter(b => b.userId === userId)
    .sort((a, b) => new Date(a.startsAtIso).getTime() - new Date(b.startsAtIso).getTime());
};

export const saveBooking = (booking: Booking): void => {
  const all = getBookings();
  const index = all.findIndex(b => b.id === booking.id);
  if (index >= 0) {
    all[index] = booking;
  } else {
    all.push(booking);
  }
  storage.setJSON(STORAGE_KEY, all);
};

export const createBooking = (
  userId: string,
  mentorId: string,
  sessionTypeId: string,
  startsAt: Date,
  durationMin: number,
  note?: string
): Booking => {
  const endsAt = new Date(startsAt.getTime() + durationMin * 60000);
  
  const newBooking: Booking = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    mentorId,
    sessionTypeId,
    startsAtIso: startsAt.toISOString(),
    endsAtIso: endsAt.toISOString(),
    note,
    status: 'pending_payment',
    createdAtIso: new Date().toISOString(),
    meetingUrl: `#/sessions/${Math.random().toString(36).substr(2, 9)}`
  };

  saveBooking(newBooking);
  return newBooking;
};

export const updateBookingStatus = (id: string, status: BookingStatus): Booking | null => {
  const booking = getBookingById(id);
  if (!booking) return null;
  
  booking.status = status;
  saveBooking(booking);
  return booking;
};

// --- Mock Slots Generator ---

export const getMockTimeSlots = (mentorId: string, dateIso: string): string[] => {
  const seedStr = `${mentorId}-${dateIso.split('T')[0]}`;
  const seed = hashStringToSeed(seedStr);
  const random = mulberry32(seed);

  const baseSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '18:00', '19:00'];
  return baseSlots.filter(() => random() > 0.4);
};
