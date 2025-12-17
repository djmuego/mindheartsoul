import { describe, it, expect } from 'vitest';
import { HOME_SECTIONS, getVisibleSections } from '../features/home/sections/registry';
import { HomeSectionDef } from '../features/home/sections/types';

describe('Home Sections Registry', () => {
  it('exports HOME_SECTIONS array', () => {
    expect(HOME_SECTIONS).toBeDefined();
    expect(Array.isArray(HOME_SECTIONS)).toBe(true);
    expect(HOME_SECTIONS.length).toBeGreaterThan(0);
  });

  it('all sections have required properties', () => {
    HOME_SECTIONS.forEach(section => {
      expect(section.id).toBeDefined();
      expect(typeof section.id).toBe('string');
      expect(section.enabled).toBeDefined();
      expect(typeof section.enabled).toBe('boolean');
      expect(section.component).toBeDefined();
      expect(typeof section.component).toBe('function');
    });
  });

  it('getVisibleSections returns only enabled sections', () => {
    const mockSections: HomeSectionDef[] = [
      { id: 'daily_insight', enabled: true, component: () => null, priority: 1 },
      { id: 'upcoming_session', enabled: false, component: () => null, priority: 2 },
      { id: 'recommended_mentors', enabled: true, component: () => null, priority: 3 },
    ];

    const visible = getVisibleSections(mockSections, undefined, {}, false);
    
    expect(visible.length).toBe(2);
    expect(visible.find(s => s.id === 'daily_insight')).toBeDefined();
    expect(visible.find(s => s.id === 'recommended_mentors')).toBeDefined();
    expect(visible.find(s => s.id === 'upcoming_session')).toBeUndefined();
  });

  it('getVisibleSections filters by user role', () => {
    const mockSections: HomeSectionDef[] = [
      { id: 'daily_insight', enabled: true, component: () => null, priority: 1 },
      { id: 'recommended_mentors', enabled: true, component: () => null, priority: 2, roles: ['seeker'] },
      { id: 'upcoming_session', enabled: true, component: () => null, priority: 3, roles: ['mentor'] },
    ];

    // Seeker user
    const seekerVisible = getVisibleSections(mockSections, 'seeker', {}, false);
    expect(seekerVisible.length).toBe(2);
    expect(seekerVisible.find(s => s.id === 'daily_insight')).toBeDefined();
    expect(seekerVisible.find(s => s.id === 'recommended_mentors')).toBeDefined();
    expect(seekerVisible.find(s => s.id === 'upcoming_session')).toBeUndefined();

    // Mentor user
    const mentorVisible = getVisibleSections(mockSections, 'mentor', {}, false);
    expect(mentorVisible.length).toBe(2);
    expect(mentorVisible.find(s => s.id === 'daily_insight')).toBeDefined();
    expect(mentorVisible.find(s => s.id === 'upcoming_session')).toBeDefined();
    expect(mentorVisible.find(s => s.id === 'recommended_mentors')).toBeUndefined();
  });

  it('getVisibleSections filters by feature flags', () => {
    const mockSections: HomeSectionDef[] = [
      { id: 'daily_insight', enabled: true, component: () => null, priority: 1 },
      { id: 'recommended_mentors', enabled: true, component: () => null, priority: 2, featureFlag: 'enableMentors' },
      { id: 'upcoming_session', enabled: true, component: () => null, priority: 3, featureFlag: 'enableSessions' },
    ];

    const flags = { enableMentors: true, enableSessions: false };
    const visible = getVisibleSections(mockSections, undefined, flags, false);
    
    expect(visible.length).toBe(2);
    expect(visible.find(s => s.id === 'daily_insight')).toBeDefined();
    expect(visible.find(s => s.id === 'recommended_mentors')).toBeDefined();
    expect(visible.find(s => s.id === 'upcoming_session')).toBeUndefined();
  });

  it('getVisibleSections filters by Pro requirement', () => {
    const mockSections: HomeSectionDef[] = [
      { id: 'daily_insight', enabled: true, component: () => null, priority: 1 },
      { id: 'recommended_mentors', enabled: true, component: () => null, priority: 2, requiresPro: true },
      { id: 'upcoming_session', enabled: true, component: () => null, priority: 3 },
    ];

    // Free user
    const freeVisible = getVisibleSections(mockSections, undefined, {}, false);
    expect(freeVisible.length).toBe(2);
    expect(freeVisible.find(s => s.id === 'daily_insight')).toBeDefined();
    expect(freeVisible.find(s => s.id === 'upcoming_session')).toBeDefined();
    expect(freeVisible.find(s => s.id === 'recommended_mentors')).toBeUndefined();

    // Pro user
    const proVisible = getVisibleSections(mockSections, undefined, {}, true);
    expect(proVisible.length).toBe(3);
    expect(proVisible.find(s => s.id === 'recommended_mentors')).toBeDefined();
  });

  it('getVisibleSections sorts by priority', () => {
    const mockSections: HomeSectionDef[] = [
      { id: 'upcoming_session', enabled: true, component: () => null, priority: 30 },
      { id: 'daily_insight', enabled: true, component: () => null, priority: 10 },
      { id: 'recommended_mentors', enabled: true, component: () => null, priority: 20 },
    ];

    const visible = getVisibleSections(mockSections, undefined, {}, false);
    
    expect(visible.length).toBe(3);
    expect(visible[0].id).toBe('daily_insight'); // priority 10
    expect(visible[1].id).toBe('recommended_mentors'); // priority 20
    expect(visible[2].id).toBe('upcoming_session'); // priority 30
  });

  it('getVisibleSections handles multiple filters together', () => {
    const mockSections: HomeSectionDef[] = [
      { id: 'daily_insight', enabled: true, component: () => null, priority: 1 },
      { id: 'recommended_mentors', enabled: true, component: () => null, priority: 2, roles: ['seeker'], featureFlag: 'mentors' },
      { id: 'upcoming_session', enabled: true, component: () => null, priority: 3, requiresPro: true },
      { id: 'community_highlights', enabled: false, component: () => null, priority: 4 },
    ];

    const flags = { mentors: true };
    const visible = getVisibleSections(mockSections, 'seeker', flags, true);
    
    // Should show: daily_insight, recommended_mentors, upcoming_session
    // Should NOT show: community_highlights (disabled)
    expect(visible.length).toBe(3);
    expect(visible.find(s => s.id === 'daily_insight')).toBeDefined();
    expect(visible.find(s => s.id === 'recommended_mentors')).toBeDefined();
    expect(visible.find(s => s.id === 'upcoming_session')).toBeDefined();
    expect(visible.find(s => s.id === 'community_highlights')).toBeUndefined();
  });
});
