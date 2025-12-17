
import { StorageDriver } from './storageDriver/types';
import { localStorageDriver } from './storageDriver/localStorageDriver';
import { ZodSchema } from 'zod';

export const STORAGE_KEYS = {
  VERSION: 'mhs_storage_version',
  USER_SESSION: 'mhs_user_v1',
  USERS_DB: 'mhs_users_db_v1',
  MENTOR_PROFILES: 'mhs_mentor_profiles_v1',
  BOOKINGS: 'mhs_bookings_v1',
  PAYMENTS_DB: 'mhs_payments_db_v1',
  VIDEO_SESSIONS: 'mhs_video_sessions_v1',
  APIRONE_ACCOUNT: 'mhs_apirone_account_v1',
  BIRTH_PROFILE: 'mhs_birth_profile_v1',
  POSTS: 'mhs_posts_v1',
  COMMENTS: 'mhs_comments_v1',
  LIKES: 'mhs_post_likes_v1',
  REPORTS: 'mhs_reports_v1',
  THEME: 'mhs_theme_mode',
  LANG: 'mhs_lang_v1',
  COURSES: 'mhs_courses_v1',
  COURSE_PROGRESS: 'mhs_courses_progress_v1',
  CHATS: 'mhs_conversations_v1',
  MESSAGES: 'mhs_messages_v1',
  SUBSCRIPTION: 'mhs_subscription_v1',
  NOTIFICATIONS: 'mhs_notifications_v1',
  FEATURE_FLAGS: 'mhs_feature_flags_v1',
  AI_USAGE: 'mhs_ai_usage_v1',
  BLUEPRINT: 'mhs_blueprint_v1',
};

const CURRENT_SCHEMA_VERSION = 2;

// Singleton driver instance
let currentDriver: StorageDriver = localStorageDriver;

export const setStorageDriver = (driver: StorageDriver) => {
  currentDriver = driver;
};

export const getStorageDriver = () => currentDriver;

export const storage = {
  getJSON: <T>(key: string, fallback: T): T => {
    try {
      const item = currentDriver.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from storage`, e);
      return fallback;
    }
  },

  getValidatedJSON: <T>(key: string, schema: ZodSchema<T>, fallback: T): T => {
    try {
      const item = currentDriver.getItem(key);
      if (!item) return fallback;
      
      const parsed = JSON.parse(item);
      const result = schema.safeParse(parsed);
      
      if (result.success) {
        return result.data;
      } else {
        console.warn(`Validation failed for ${key}, using fallback.`, result.error);
        return fallback;
      }
    } catch (e) {
      console.error(`Error reading/validating ${key}`, e);
      return fallback;
    }
  },

  setJSON: (key: string, value: any): void => {
    try {
      currentDriver.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to storage`, e);
    }
  },

  remove: (key: string): void => {
    currentDriver.removeItem(key);
  }
};

export const migrateStorage = (): void => {
  const version = storage.getJSON<number>(STORAGE_KEYS.VERSION, 0);

  if (version < CURRENT_SCHEMA_VERSION) {
    console.log(`Migrating storage from v${version} to v${CURRENT_SCHEMA_VERSION}...`);
    storage.setJSON(STORAGE_KEYS.VERSION, CURRENT_SCHEMA_VERSION);
  }
};
