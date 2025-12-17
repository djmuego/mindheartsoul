
import { BirthProfile } from '../types';
import { storage, STORAGE_KEYS } from './storage';
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    // Get API key from environment
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // If no API key, return friendly fallback message
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      return `Hello ${userName || 'Traveler'}! 👋 I'm your AI Guide. You asked: "${text}". 
      
⚠️ AI is temporarily unavailable. To enable real AI responses, please set your VITE_GEMINI_API_KEY in .env.local file.`;
    }
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Build system instruction
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

    // Generate response
    const prompt = `${systemInstruction}\n\nUser: ${text}\n\nAI Guide:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    
    return generatedText;
  } catch (error: any) {
    console.error("AI Guide Error:", error);
    
    // Provide specific error messages
    if (error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('401')) {
      return "🔑 The API key seems invalid. Please check your VITE_GEMINI_API_KEY in .env.local";
    }
    
    if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      return "⏰ API quota exceeded. Please try again later or upgrade your Gemini API plan.";
    }
    
    // Return a graceful fallback message
    return "I am currently meditating on your question but cannot respond right now. Please try again later.";
  }
};
