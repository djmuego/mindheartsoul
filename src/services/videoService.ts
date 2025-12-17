
import { VideoSession, Booking } from '../types';
import { storage, STORAGE_KEYS } from './storage';
import { getBookingById } from './bookingsService';

/**
 * Session Join Status:
 * - 'too_early': More than 15 min before session start
 * - 'can_join': Within valid time window
 * - 'ended': Session has ended
 */
export type SessionJoinStatus = 'too_early' | 'can_join' | 'ended';

interface VideoSessionInfo {
  session: VideoSession | null;
  booking: Booking | null;
  status: SessionJoinStatus;
  message: string;
  canJoin: boolean;
}

export const getVideoSession = (bookingId: string): VideoSession => {
  const sessions = storage.getJSON<VideoSession[]>(STORAGE_KEYS.VIDEO_SESSIONS, []);
  let session = sessions.find(s => s.bookingId === bookingId);

  if (!session) {
    // Create deterministic room name
    const roomName = `MHS-Session-${bookingId.substring(0, 8)}`;
    session = {
      id: `vid_${Math.random().toString(36).substr(2, 9)}`,
      bookingId,
      provider: 'jitsi_stub',
      joinUrl: `https://meet.jit.si/${roomName}`,
      createdAtIso: new Date().toISOString()
    };
    sessions.push(session);
    storage.setJSON(STORAGE_KEYS.VIDEO_SESSIONS, sessions);
  }

  return session;
};

/**
 * Get full video session info with join status validation
 */
export const getVideoSessionInfo = (bookingId: string): VideoSessionInfo => {
  const booking = getBookingById(bookingId);
  
  if (!booking) {
    return {
      session: null,
      booking: null,
      status: 'ended',
      message: 'Booking not found',
      canJoin: false
    };
  }

  const session = getVideoSession(bookingId);
  const now = new Date().getTime();
  const startTime = new Date(booking.startsAtIso).getTime();
  const endTime = new Date(booking.endsAtIso).getTime();
  
  // Allow joining 15 minutes before session start
  const joinWindowStart = startTime - (15 * 60 * 1000);
  
  let status: SessionJoinStatus;
  let message: string;
  let canJoin: boolean;
  
  if (now < joinWindowStart) {
    status = 'too_early';
    const minutesUntilJoin = Math.ceil((joinWindowStart - now) / (60 * 1000));
    message = `Session opens in ${minutesUntilJoin} minutes`;
    canJoin = false;
  } else if (now >= joinWindowStart && now <= endTime) {
    status = 'can_join';
    message = 'Session is ready to join';
    canJoin = true;
  } else {
    status = 'ended';
    message = 'This session has ended';
    canJoin = false;
  }
  
  return {
    session,
    booking,
    status,
    message,
    canJoin
  };
};
