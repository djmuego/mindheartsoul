
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSession, BirthProfile, User, UserRole } from '../types';
import { storage, STORAGE_KEYS } from '../services/storage';
import { upsertUser, getUserById } from '../services/usersService';
import { UserSchema, BirthProfileSchema } from '../schemas/session.schema';

interface SessionContextType {
  session: UserSession; 
  updateSession: (session: Partial<UserSession>) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  loginMock: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  refreshUser: () => void;
  birthProfile: BirthProfile | null;
  setBirthProfile: (profile: BirthProfile | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession>({
    isAuthenticated: false,
    userName: 'Guest User'
  });

  const [user, setUserState] = useState<User | null>(null);
  const [birthProfile, setBirthProfileState] = useState<BirthProfile | null>(null);

  useEffect(() => {
    try {
      // Safe Load User
      const storedUser = storage.getValidatedJSON<User | null>(
        STORAGE_KEYS.USER_SESSION, 
        UserSchema.nullable(), 
        null
      );

      if (storedUser) {
        const freshUser = getUserById(storedUser.id) || storedUser;
        setUserState(freshUser);
        setSession(prev => ({ ...prev, isAuthenticated: true, userName: freshUser.name }));
      }

      // Safe Load Birth Profile
      const storedProfile = storage.getValidatedJSON<BirthProfile | null>(
        STORAGE_KEYS.BIRTH_PROFILE,
        BirthProfileSchema.nullable(),
        null
      );
      
      if (storedProfile) {
        setBirthProfileState(storedProfile);
      }
    } catch (e) {
      console.error("Failed to load session data", e);
    }
  }, []);

  const updateSession = (newSessionData: Partial<UserSession>) => {
    setSession(prev => ({ ...prev, ...newSessionData }));
  };

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      upsertUser(newUser);
      storage.setJSON(STORAGE_KEYS.USER_SESSION, newUser);
      updateSession({ isAuthenticated: true, userName: newUser.name, userId: newUser.id });
    } else {
      storage.remove(STORAGE_KEYS.USER_SESSION);
      updateSession({ isAuthenticated: false, userName: 'Guest', userId: undefined });
    }
  };

  const refreshUser = () => {
    if (user) {
      const fresh = getUserById(user.id);
      if (fresh) {
        setUserState(fresh);
        storage.setJSON(STORAGE_KEYS.USER_SESSION, fresh);
      }
    }
  };

  const loginMock = (name: string, email: string, role: UserRole) => {
    const existingUser = storage.getJSON<User[]>(STORAGE_KEYS.USERS_DB, []).find(u => u.email === email);
    
    if (existingUser) {
      setUser(existingUser);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        avatarDataUrl: `https://ui-avatars.com/api/?name=${name}&background=random`,
        createdAtIso: new Date().toISOString()
      };
      setUser(newUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const setBirthProfile = (profile: BirthProfile | null) => {
    setBirthProfileState(profile);
    if (profile) {
      storage.setJSON(STORAGE_KEYS.BIRTH_PROFILE, profile);
    } else {
      storage.remove(STORAGE_KEYS.BIRTH_PROFILE);
    }
  };

  return (
    <SessionContext.Provider value={{ 
      session, 
      updateSession, 
      user, 
      setUser, 
      loginMock, 
      logout,
      refreshUser,
      birthProfile, 
      setBirthProfile 
    }}>
      {children}
    </SessionContext.Provider>
  );
};
