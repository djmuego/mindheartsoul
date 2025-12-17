
import { BirthProfile } from '../types';
import { storage, STORAGE_KEYS } from './storage';
// import { GoogleGenAI } from "@google/genai"; // TODO: Replace with real Gemini SDK
// Mock implementation for now

interface AiReplyParams {
  text: string;
  locale: string;
  birthProfile?: BirthProfile | null;
  userName?: string;
  userId?: string; // Added for limit tracking
  isPro?: boolean; // Added for limit bypass
}

export const checkAiLimit = (userId: string, isPro: boolean): { allowed: boolean; count: number; limit: number } => {
  if (isPro) return { allowed: true, count: 0, limit: Infinity };

  const today = new Date().toISOString().split('T')[0];
  const usageMap = storage.getJSON<Record<string, Record<string, number>>>(STORAGE_KEYS.AI_USAGE, {});
  
  const dailyUsage = usageMap[today] || {};
  const count = dailyUsage[userId] || 0;
  const limit = 5;

  return { allowed: count < limit, count, limit };
};

export const incrementAiUsage = (userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const usageMap = storage.getJSON<Record<string, Record<string, number>>>(STORAGE_KEYS.AI_USAGE, {});
  
  if (!usageMap[today]) usageMap[today] = {};
  usageMap[today][userId] = (usageMap[today][userId] || 0) + 1;
  
  storage.setJSON(STORAGE_KEYS.AI_USAGE, usageMap);
};

export const generateAiReply = async ({ text, locale, birthProfile, userName, userId, isPro }: AiReplyParams): Promise<string> => {
  // Check limits if userId is provided
  if (userId) {
    const { allowed } = checkAiLimit(userId, isPro || false);
    if (!allowed) {
      throw new Error('LIMIT_REACHED');
    }
    incrementAiUsage(userId);
  }

  try {
    // TODO: Uncomment when real Gemini SDK is configured
    // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let systemInstruction = `You are a helpful, spiritual, and empathetic AI Guide for an app called MindHeartSoul. 
    Your tone is soothing, wise, and supportive. You help users navigate their journey of mind, heart, and soul.
    The user's name is ${userName || 'Traveler'}.
    The user's locale is ${locale || 'en'}.`;

    if (birthProfile) {
      systemInstruction += `\nThe user has a birth profile:
      Name: ${birthProfile.fullName || 'Unknown'}
      Date: ${birthProfile.birthDate}
      Time: ${birthProfile.birthTime}
      City: ${birthProfile.birthCity}`;
    } else {
      systemInstruction += `\nThe user has not set up their birth profile yet. Encourage them gently to do so for deeper insights if they ask about astrology.`;
    }

    // Mock response for now
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    return `Hello ${userName || 'Traveler'}! I'm your AI Guide. You asked: "${text}". This is a mock response. To enable real AI responses, configure the Gemini API key.`;
    
    return "I am sensing a disturbance in the flow. Please try asking again.";
  } catch (error) {
    console.error("AI Guide Error:", error);
    // Return a fallback message gracefully
    return "I am currently meditating on your question but cannot respond right now. Please try again later.";
  }
};
