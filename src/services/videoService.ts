
import { VideoSession } from '../types';
import { storage, STORAGE_KEYS } from './storage';

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
