
import { Mentor } from '../types';

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'm1',
    userId: 'm1',
    name: 'Sarah Johnson',
    title: 'Mindfulness Coach',
    languages: ['EN', 'ES'],
    tags: ['Mindfulness', 'Meditation', 'Stress Relief'],
    priceFrom: 50,
    avatarUrl: 'https://picsum.photos/seed/mentor1/200/200',
    bio: 'Certified mindfulness practitioner with over 10 years of experience helping individuals find peace in chaos.',
    isVerified: true,
    sessionTypes: [
      { id: 'st1', label: 'Discovery Call', durationMin: 30, price: 30 },
      { id: 'st2', label: 'Deep Dive Session', durationMin: 60, price: 80 },
    ]
  },
  {
    id: 'm2',
    userId: 'm2',
    name: 'David Chen',
    title: 'Vedic Astrologer',
    languages: ['EN', 'ZH'],
    tags: ['Astrology', 'Career', 'Relationships'],
    priceFrom: 90,
    avatarUrl: 'https://picsum.photos/seed/mentor2/200/200',
    bio: 'Decoding the stars to help you navigate your life path and career choices using ancient Vedic wisdom.',
    isVerified: true,
    sessionTypes: [
      { id: 'st3', label: 'Natal Chart Reading', durationMin: 60, price: 120 },
      { id: 'st4', label: 'Transit Update', durationMin: 30, price: 60 },
    ]
  },
  {
    id: 'm3',
    userId: 'm3',
    name: 'Elena Petrova',
    title: 'Holistic Therapist',
    languages: ['EN', 'RU', 'DE'],
    tags: ['Psychology', 'Healing', 'Trauma'],
    priceFrom: 120,
    avatarUrl: 'https://picsum.photos/seed/mentor3/200/200',
    bio: 'Integrating traditional psychology with holistic healing modalities to address the root causes of emotional blocks.',
    isVerified: true,
    sessionTypes: [
      { id: 'st5', label: 'Therapy Session', durationMin: 50, price: 120 },
    ]
  },
  {
    id: 'm4',
    userId: 'm4',
    name: 'Marcus Aurelius',
    title: 'Stoic Mentor',
    languages: ['EN', 'IT'],
    tags: ['Philosophy', 'Resilience', 'Leadership'],
    priceFrom: 200,
    avatarUrl: 'https://picsum.photos/seed/mentor4/200/200',
    bio: 'Applying ancient Stoic philosophy to modern leadership and personal resilience challenges.',
    isVerified: true,
    sessionTypes: [
      { id: 'st6', label: 'Leadership Coaching', durationMin: 60, price: 200 },
      { id: 'st7', label: 'Resilience Training', durationMin: 90, price: 280 },
    ]
  }
];

export const getMentorById = (id: string): Mentor | undefined => {
  return MOCK_MENTORS.find(m => m.id === id);
};
