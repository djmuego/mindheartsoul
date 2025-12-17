
import { MentorProfile } from '../types';
import { storage, STORAGE_KEYS } from './storage';
import { updateUserRole } from './usersService';
import { MOCK_MENTORS } from './mockData';

// Sync mock data to storage for MVP persistence
const seedMentors = () => {
  const stored = storage.getJSON<MentorProfile[]>(STORAGE_KEYS.MENTOR_PROFILES, []);
  if (stored.length === 0) {
    // Convert old mock shape to new profile shape
    const seeded = MOCK_MENTORS.map(m => ({
      userId: m.id, // Mocks use 'm1' as ID, we treat it as userId
      name: m.name,
      title: m.title,
      bio: m.bio || '',
      tags: m.tags,
      languages: m.languages,
      priceFrom: m.priceFrom,
      sessionTypes: m.sessionTypes,
      avatarUrl: m.avatarUrl,
      isVerified: true,
      availability: {
        weekdays: [1, 2, 3, 4, 5], // Mon-Fri
        startHour: 9,
        endHour: 17
      }
    }));
    storage.setJSON(STORAGE_KEYS.MENTOR_PROFILES, seeded);
  }
};

export const getMentorProfiles = (): MentorProfile[] => {
  seedMentors();
  return storage.getJSON<MentorProfile[]>(STORAGE_KEYS.MENTOR_PROFILES, []);
};

export const getMentorProfile = (userId: string): MentorProfile | undefined => {
  return getMentorProfiles().find(m => m.userId === userId);
};

export const applyForMentor = (userId: string, profileData: Partial<MentorProfile>) => {
  updateUserRole(userId, 'mentor_pending');
  
  const profiles = getMentorProfiles();
  const existingIndex = profiles.findIndex(p => p.userId === userId);
  
  const newProfile: MentorProfile = {
    userId,
    name: profileData.name || 'Unknown',
    title: profileData.title || 'Mentor',
    bio: profileData.bio || '',
    tags: profileData.tags || [],
    languages: profileData.languages || ['en'],
    priceFrom: profileData.priceFrom || 0,
    sessionTypes: profileData.sessionTypes || [],
    avatarUrl: profileData.avatarUrl,
    isVerified: false
  };

  if (existingIndex >= 0) {
    profiles[existingIndex] = { ...profiles[existingIndex], ...newProfile };
  } else {
    profiles.push(newProfile);
  }
  
  storage.setJSON(STORAGE_KEYS.MENTOR_PROFILES, profiles);
};

export const approveMentor = (userId: string) => {
  updateUserRole(userId, 'mentor');
  const profiles = getMentorProfiles();
  const index = profiles.findIndex(p => p.userId === userId);
  if (index >= 0) {
    profiles[index].isVerified = true;
    storage.setJSON(STORAGE_KEYS.MENTOR_PROFILES, profiles);
  }
};
