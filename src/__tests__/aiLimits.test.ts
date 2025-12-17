
import { describe, it, expect, beforeEach } from 'vitest';
import { checkAiLimit, incrementAiUsage } from '../services/aiGuideService';
import { storage, STORAGE_KEYS } from '../services/storage';

describe('AI Limits Service', () => {
  beforeEach(() => {
    storage.remove(STORAGE_KEYS.AI_USAGE);
  });

  it('allows usage below limit for free user', () => {
    const { allowed } = checkAiLimit('u1', false);
    expect(allowed).toBe(true);
  });

  it('blocks usage after limit reached for free user', () => {
    // Simulate 5 messages
    for (let i = 0; i < 5; i++) {
      incrementAiUsage('u1');
    }
    
    const { allowed } = checkAiLimit('u1', false);
    expect(allowed).toBe(false);
  });

  it('allows unlimited usage for pro user', () => {
    // Simulate 100 messages
    for (let i = 0; i < 100; i++) {
      incrementAiUsage('u2');
    }
    
    const { allowed } = checkAiLimit('u2', true);
    expect(allowed).toBe(true);
  });
});
