
import { User, UserRole } from '../types';
import { storage, STORAGE_KEYS } from './storage';

export const getUsers = (): User[] => {
  return storage.getJSON<User[]>(STORAGE_KEYS.USERS_DB, []);
};

export const getUserById = (id: string): User | undefined => {
  return getUsers().find(u => u.id === id);
};

export const upsertUser = (user: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  
  if (index >= 0) {
    // Merge existing fields to preserve data
    users[index] = { ...users[index], ...user };
  } else {
    users.push({ ...user, createdAtIso: new Date().toISOString() });
  }
  
  storage.setJSON(STORAGE_KEYS.USERS_DB, users);
};

export const updateUserRole = (userId: string, role: UserRole): User | undefined => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index >= 0) {
    users[index].role = role;
    storage.setJSON(STORAGE_KEYS.USERS_DB, users);
    
    // If this is the current user in session, we might need to update the session storage too
    // But typically session just stores ID and we re-fetch. 
    // For MVP, SessionContext handles session key update, this handles DB.
    return users[index];
  }
  return undefined;
};
