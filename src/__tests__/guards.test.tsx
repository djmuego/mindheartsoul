import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouteGuard } from '../app/guards/RouteGuard';
import { AppModule } from '../app/modules/types';
import { MemoryRouter } from 'react-router-dom';
import { User } from '../types';

// Create controllable mock functions
const mockUseSession = vi.fn();
const mockUseFeatureFlags = vi.fn();
const mockUseEntitlements = vi.fn();
const mockPushNotification = vi.fn();

// Mock Hooks with dynamic return values
vi.mock('../context/SessionContext', () => ({
  useSession: () => mockUseSession()
}));

vi.mock('../hooks/useFeatureFlags', () => ({
  useFeatureFlags: () => mockUseFeatureFlags()
}));

vi.mock('../hooks/useEntitlements', () => ({
  useEntitlements: () => mockUseEntitlements()
}));

vi.mock('../services/notificationsService', () => ({
  pushNotification: (...args: any[]) => mockPushNotification(...args)
}));

describe('RouteGuard', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  const renderGuard = (module: AppModule) => {
    return render(
      <MemoryRouter>
        <RouteGuard module={module}>
          <div>Protected Content</div>
        </RouteGuard>
      </MemoryRouter>
    );
  };

  it('renders children if checks pass', () => {
    const regularUser: User = { 
      id: 'u1', 
      name: 'User', 
      email: 'user@test.com', 
      role: 'user',
      createdAtIso: new Date().toISOString()
    };
    
    mockUseSession.mockReturnValue({ user: regularUser });
    mockUseFeatureFlags.mockReturnValue({ flags: {} });
    mockUseEntitlements.mockReturnValue({ isPro: false });

    const module: AppModule = { id: 'test', routes: [] };
    renderGuard(module);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows access denied if role mismatch', () => {
    const regularUser: User = { 
      id: 'u1', 
      name: 'User', 
      email: 'user@test.com', 
      role: 'user', // Not admin
      createdAtIso: new Date().toISOString()
    };
    
    mockUseSession.mockReturnValue({ user: regularUser });
    mockUseFeatureFlags.mockReturnValue({ flags: {} });
    mockUseEntitlements.mockReturnValue({ isPro: false });

    const module: AppModule = { id: 'admin-only', routes: [], roles: ['admin'] };
    renderGuard(module);
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows upgrade screen if pro required', () => {
    const freeUser: User = { 
      id: 'u1', 
      name: 'Free User', 
      email: 'free@test.com', 
      role: 'user',
      createdAtIso: new Date().toISOString()
    };
    
    mockUseSession.mockReturnValue({ user: freeUser });
    mockUseFeatureFlags.mockReturnValue({ flags: {} });
    mockUseEntitlements.mockReturnValue({ isPro: false }); // Not Pro!

    const module: AppModule = { id: 'pro-only', routes: [], entitlements: { proOnly: true } };
    renderGuard(module);
    expect(screen.getByText('Pro Feature Locked')).toBeInTheDocument();
  });

  it('shows feature unavailable if flag disabled', () => {
    const user: User = { 
      id: 'u1', 
      name: 'User', 
      email: 'user@test.com', 
      role: 'user',
      createdAtIso: new Date().toISOString()
    };
    
    mockUseSession.mockReturnValue({ user });
    mockUseFeatureFlags.mockReturnValue({ flags: { disabledFeature: false } }); // Disabled!
    mockUseEntitlements.mockReturnValue({ isPro: false });

    const module: AppModule = { id: 'disabled', routes: [], featureFlag: 'disabledFeature' as any };
    renderGuard(module);
    expect(screen.getByText('Feature Unavailable')).toBeInTheDocument();
  });

  // Additional test: Admin user can access admin module
  it('allows admin to access admin-only module', () => {
    const adminUser: User = { 
      id: 'a1', 
      name: 'Admin', 
      email: 'admin@test.com', 
      role: 'admin', // Is admin!
      createdAtIso: new Date().toISOString()
    };
    
    mockUseSession.mockReturnValue({ user: adminUser });
    mockUseFeatureFlags.mockReturnValue({ flags: {} });
    mockUseEntitlements.mockReturnValue({ isPro: false });

    const module: AppModule = { id: 'admin-only', routes: [], roles: ['admin'] };
    renderGuard(module);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
  });

  // Additional test: Pro user can access pro modules
  it('allows pro user to access pro-only module', () => {
    const proUser: User = { 
      id: 'p1', 
      name: 'Pro User', 
      email: 'pro@test.com', 
      role: 'user',
      createdAtIso: new Date().toISOString()
    };
    
    mockUseSession.mockReturnValue({ user: proUser });
    mockUseFeatureFlags.mockReturnValue({ flags: {} });
    mockUseEntitlements.mockReturnValue({ isPro: true }); // Is Pro!

    const module: AppModule = { id: 'pro-only', routes: [], entitlements: { proOnly: true } };
    renderGuard(module);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Pro Feature Locked')).not.toBeInTheDocument();
  });

  // Additional test: Feature flag enabled allows access
  it('allows access when feature flag is enabled', () => {
    const user: User = { 
      id: 'u1', 
      name: 'User', 
      email: 'user@test.com', 
      role: 'user',
      createdAtIso: new Date().toISOString()
    };
    
    mockUseSession.mockReturnValue({ user });
    mockUseFeatureFlags.mockReturnValue({ flags: { enabledFeature: true } }); // Enabled!
    mockUseEntitlements.mockReturnValue({ isPro: false });

    const module: AppModule = { id: 'enabled', routes: [], featureFlag: 'enabledFeature' as any };
    renderGuard(module);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Feature Unavailable')).not.toBeInTheDocument();
  });
});
